import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import Cropper from 'react-easy-crop';
import PinAuthModal from '@/components/admin/PinAuthModal';

// ============================================================
// Canvas Cropping Helpers
// ============================================================
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    if (url && !url.startsWith('data:')) {
      image.setAttribute('crossOrigin', 'anonymous');
    }
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Canvas is empty')); return; }
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
}

// ============================================================
// Shared Sub-Components
// ============================================================
function GuideBox({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-blue-800 font-semibold text-sm hover:bg-blue-100 transition-colors">
        <span>{title}</span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-xs`}></i>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-blue-700 leading-relaxed border-t border-blue-200">
          {children}
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <p className="text-sm text-gray-500">Hal. <strong>{currentPage}</strong> / <strong>{totalPages}</strong></p>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors">← Prev</button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
const ITEMS_PER_PAGE = 8;

export default function AdIndex() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Header');
  const [link, setLink] = useState('');
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState('');
  const [croppingType, setCroppingType] = useState('desktop');
  const [mobileOriginalFileName, setMobileOriginalFileName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleOpenPreview = () => {
    if (!previewUrl) {
      alert('Pilih berkas gambar iklan terlebih dahulu!');
      return;
    }
    setShowPreview(true);
  };

  // Cropper states
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('');

  const getAspectForPosition = (pos) => {
    switch (pos) {
      case 'Header': case 'Tengah Konten': case 'header': case 'Header (728x90)': return 728 / 90;
      case 'Sidebar Atas': case 'sidebar': case 'Sidebar (300x250)': return 300 / 250;
      case 'Sidebar Bawah': return 300 / 600;
      case 'Footer': case 'Footer (970x250)': return 970 / 250;
      default: return 728 / 90;
    }
  };

  const getGuidelineText = (pos) => {
    return 'Tips: Berikan angka Resolusi (px) atau Rasio di atas kepada desainer grafis Anda. Sistem akan otomatis menyesuaikan gambar agar rapi di HP maupun Laptop tanpa terpotong. Maksimal ukuran file: 2MB (Gunakan format WebP, JPG, atau PNG agar web tetap cepat).';
  };

  const positionLabel = (pos) => {
    const labels = {
      'Header': 'Spanduk Paling Atas (Di Bawah Logo) — (1200x200 px | Rasio 6:1)',
      'Tengah Konten': 'Menyelip di Tengah Daftar Berita — (728x90 px | Rasio 8:1)',
      'Sidebar Atas': 'Samping Kanan (Bentuk Kotak) — (300x250 px | Rasio 6:5)',
      'Sidebar Bawah': 'Samping Kanan (Memanjang ke Bawah) — (300x600 px | Rasio 1:2)',
      'Footer': 'Spanduk Paling Bawah Website — (970x250 px | Rasio 4:1)',
      'header': 'Spanduk Paling Atas (Di Bawah Logo) — (1200x200 px | Rasio 6:1)',
      'sidebar': 'Samping Kanan (Bentuk Kotak) — (300x250 px | Rasio 6:5)',
    };
    return labels[pos] || pos;
  };

  const positionBadgeColor = (pos) => {
    if (pos?.includes('Header') || pos === 'header') return 'bg-purple-100 text-purple-800 border-purple-300';
    if (pos?.includes('Sidebar')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (pos?.includes('Footer')) return 'bg-green-100 text-green-800 border-green-300';
    if (pos?.includes('Tengah')) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase.from('ads').select('*').order('id', { ascending: false });
      if (fetchErr) throw fetchErr;
      setAds(data || []);
    } catch (err) { console.error('Error fetching ads:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAds(); }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalFileName(file.name);
      setCroppingType('desktop');
      const reader = new FileReader();
      reader.addEventListener('load', () => { setCropImageSrc(reader.result); setIsCropModalOpen(true); });
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMobileOriginalFileName(file.name);
      setCroppingType('mobile');
      const reader = new FileReader();
      reader.addEventListener('load', () => { setCropImageSrc(reader.result); setIsCropModalOpen(true); });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels); };

  const handleSaveCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (croppingType === 'mobile') {
        const fileExt = mobileOriginalFileName.split('.').pop() || 'jpg';
        const file = new File([croppedBlob], `mobile_cropped_${Date.now()}.${fileExt}`, { type: croppedBlob.type });
        setMobileImageFile(file);
        setMobilePreviewUrl(URL.createObjectURL(croppedBlob));
      } else {
        const fileExt = originalFileName.split('.').pop() || 'jpg';
        const file = new File([croppedBlob], `cropped_${Date.now()}.${fileExt}`, { type: croppedBlob.type });
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(croppedBlob));
      }
      setIsCropModalOpen(false);
    } catch (err) { alert('Gagal memotong gambar: ' + err.message); }
  };

  const handleCancelCrop = () => {
    setIsCropModalOpen(false);
    if (croppingType === 'mobile') {
      const f = document.getElementById('ad-mobile-image-input');
      if (f) f.value = '';
      const fm = document.getElementById('ad-mobile-image-input-modal');
      if (fm) fm.value = '';
    } else {
      const f = document.getElementById('ad-image-input');
      if (f) f.value = '';
      const fm = document.getElementById('ad-image-input-modal');
      if (fm) fm.value = '';
    }
  };

  const resetForm = () => {
    setName(''); setPosition('Header'); setLink(''); setTanggalBerakhir('');
    setImageFile(null); setPreviewUrl('');
    setMobileImageFile(null); setMobilePreviewUrl('');
    setEditingId(null);
    const fileInput = document.getElementById('ad-image-input');
    if (fileInput) fileInput.value = '';
    const fileInputModal = document.getElementById('ad-image-input-modal');
    if (fileInputModal) fileInputModal.value = '';
    const mobileFileInput = document.getElementById('ad-mobile-image-input');
    if (mobileFileInput) mobileFileInput.value = '';
    const mobileFileInputModal = document.getElementById('ad-mobile-image-input-modal');
    if (mobileFileInputModal) mobileFileInputModal.value = '';
  };

  const handleEdit = (iklan) => {
    setEditingId(iklan.id);
    setName(iklan.name || '');
    setPosition(iklan.position || 'Header');
    setLink(iklan.link || '');
    setTanggalBerakhir(iklan.tanggal_berakhir || '');
    setPreviewUrl(iklan.image || '');
    setMobilePreviewUrl(iklan.image_mobile_url || '');
    setImageFile(null);
    setMobileImageFile(null);
    setShowFormModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
    setShowFormModal(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!editingId && !imageFile) { alert('Pilih berkas gambar iklan terlebih dahulu!'); return; }
    
    setProcessing(true);
    setError('');
    try {
      let publicUrl = previewUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `ads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) throw new Error('Gagal mengunggah gambar: ' + uploadError.message);
        const { data: { publicUrl: loadedUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        publicUrl = loadedUrl;
      }

      let mobilePublicUrl = mobilePreviewUrl || null;
      if (mobileImageFile) {
        const mFileExt = mobileImageFile.name.split('.').pop();
        const mFileName = `mobile_${Date.now()}_${Math.random().toString(36).substring(2)}.${mFileExt}`;
        const mFilePath = `ads/${mFileName}`;
        const { error: mUploadError } = await supabase.storage.from('images').upload(mFilePath, mobileImageFile);
        if (mUploadError) throw new Error('Gagal mengunggah gambar mobile: ' + mUploadError.message);
        const { data: { publicUrl: mPublicUrl } } = supabase.storage.from('images').getPublicUrl(mFilePath);
        mobilePublicUrl = mPublicUrl;
      }

      const payload = {
        name,
        position,
        image: publicUrl,
        image_mobile_url: mobilePublicUrl,
        link: link || '-',
        tanggal_berakhir: tanggalBerakhir || null,
        is_active: true
      };

      if (editingId) {
        const { error: updateError } = await supabase.from('ads').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        setMessage('Iklan berhasil diperbarui.');
      } else {
        const { error: insertError } = await supabase.from('ads').insert([payload]);
        if (insertError) throw insertError;
        setMessage('Iklan berhasil ditambahkan dan ditayangkan.');
      }

      resetForm();
      setShowFormModal(false);
      fetchAds();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan iklan.');
    } finally { setProcessing(false); }
  };

  const handleDelete = async (id) => {
    try {
      const { error: deleteErr } = await supabase.from('ads').delete().eq('id', id);
      if (deleteErr) throw deleteErr;
      setMessage('Iklan berhasil dihapus.');
      fetchAds();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) { alert('Gagal menghapus iklan: ' + err.message); }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ads;
    return ads.filter(a => a.name?.toLowerCase().includes(q) || a.position?.toLowerCase().includes(q));
  }, [ads, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  return (
    <AdminLayout>
      <Head><title>Kelola Iklan - PojokTV</title></Head>

      {/* Crop Modal (always on top) */}
      {isCropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <i className="fa-solid fa-crop-simple text-red-500"></i>
                Sesuaikan Gambar ({croppingType === 'mobile' ? 'Khusus HP' : positionLabel(position)})
              </h3>
              <button type="button" onClick={handleCancelCrop}
                className="text-gray-400 hover:text-white text-sm">Batal</button>
            </div>
            <div className="relative flex-1 bg-slate-950 min-h-[280px] sm:min-h-[380px]">
              <Cropper image={cropImageSrc} crop={crop} zoom={zoom} aspect={croppingType === 'mobile' ? (300 / 250) : getAspectForPosition(position)}
                onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="px-6 py-5 bg-slate-900 border-t border-slate-800 flex flex-col gap-4 text-white">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-400">Zoom</span>
                <input type="range" value={zoom} min={1} max={3} step={0.1} aria-label="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-red-600 cursor-pointer" />
                <span className="text-xs text-slate-300 font-bold">{zoom.toFixed(1)}x</span>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={handleCancelCrop}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Batal</button>
                <button type="button" onClick={handleSaveCrop}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow cursor-pointer">
                  Potong &amp; Gunakan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Mobile Slide-Up) */}
      {showFormModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/50 px-4" onClick={() => setShowFormModal(false)}>
          <div className="bg-white rounded-2xl rounded-b-none sm:rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">{editingId ? 'Edit Data Iklan' : 'Pasang Iklan Baru'}</h3>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-700 text-xl">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setPendingAction(() => handleSubmit); setIsPinModalOpen(true); }} className="space-y-4">
              {error && <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-bold">{error}</div>}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Nama Iklan / Klien</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Cth: Iklan Banner Pemkab Sidoarjo"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  required autoFocus />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Posisi Iklan</label>
                <select value={position} onChange={e => setPosition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required>
                  <option value="Header">Spanduk Paling Atas (Di Bawah Logo) — (1200x200 px | Rasio 6:1)</option>
                  <option value="Tengah Konten">Menyelip di Tengah Daftar Berita — (728x90 px | Rasio 8:1)</option>
                  <option value="Sidebar Atas">Samping Kanan (Bentuk Kotak) — (300x250 px | Rasio 6:5)</option>
                  <option value="Sidebar Bawah">Samping Kanan (Memanjang ke Bawah) — (300x600 px | Rasio 1:2)</option>
                  <option value="Footer">Spanduk Paling Bawah Website — (970x250 px | Rasio 4:1)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Link Tujuan (Opsional)</label>
                <input type="url" value={link} onChange={e => setLink(e.target.value)}
                  placeholder="https://tautan-iklan.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Tanggal Berakhir Kontrak (Opsional)</label>
                <input type="date" value={tanggalBerakhir} onChange={e => setTanggalBerakhir(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-slate-700" />
                <p className="text-xs text-gray-500 mt-1">*Kosongkan jika iklan tayang permanen.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Gambar Iklan Utama / Desktop (Wajib)</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-semibold mb-2">
                  <i className="fa-solid fa-circle-info mr-1"></i>{getGuidelineText(position)}
                </div>
                <input id="ad-image-input-modal" type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" required={!editingId} />
                {previewUrl && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-gray-600 mb-1">Pratinjau Hasil Crop:</p>
                    <img src={previewUrl} alt="Preview Iklan" className="w-full max-h-36 object-contain border rounded-lg shadow-sm" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Gambar Iklan Khusus HP (Opsional)</label>
                <input id="ad-mobile-image-input-modal" type="file" accept="image/*" onChange={handleMobileImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" />
                <p className="text-[10px] text-gray-500 mt-1">Tips: Upload desain versi kotak (misal 300x250 px) agar iklan tampil gagah dan terbaca jelas di layar HP. Jika Anda mengosongkan ini, sistem akan otomatis menggunakan Gambar Utama.</p>
                {mobilePreviewUrl && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-gray-600 mb-1">Pratinjau Layar HP:</p>
                    <img src={mobilePreviewUrl} alt="Preview Iklan Mobile" className="w-full max-h-36 object-contain border rounded-lg shadow-sm" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2.5 mt-4">
                <button type="button" onClick={handleOpenPreview}
                  className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-100 shadow-sm transition-all cursor-pointer text-center">
                  Lihat Pratinjau
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit}
                    className="w-full px-6 py-3 bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-200 shadow-sm transition-all cursor-pointer text-center">
                    Batal Edit
                  </button>
                )}
                <button type="submit" disabled={processing}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-50 shadow-sm cursor-pointer">
                  {processing ? 'Menyimpan...' : (editingId ? 'Update Iklan' : 'Upload & Pasang Iklan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Iklan */}
      {showPreview && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-black/80 backdrop-blur-sm overflow-hidden">
          {/* Header Modal */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-base">Pratinjau Letak Iklan</span>
              <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
                    previewDevice === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💻 Tampilan PC
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${
                    previewDevice === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📱 Tampilan HP
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="bg-red-655 hover:bg-red-755 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-colors"
            >
              ❌ Tutup Pratinjau
            </button>
          </div>

          {/* Main Preview Container */}
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            {previewDevice === 'desktop' ? (
              /* Desktop Mockup Layout */
              <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 text-white overflow-y-auto max-h-[85vh] flex flex-col gap-6">
                <div className="max-w-4xl mx-auto w-full bg-white text-slate-950 p-6 rounded-xl shadow">
                  {/* Logo / Header Row */}
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div className="text-2xl font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV.com</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">DUMMY WEBSITE PREVIEW</div>
                  </div>

                  {/* Slot Header Atas (728x90) */}
                  {position === 'Header' && (
                    <div className="w-full flex flex-col items-center justify-center mb-6 bg-gray-100 p-2 border rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT IKLAN HEADER ATAS (728x90) ]</span>
                      <img src={previewUrl} alt="Ad Header" className="max-w-full h-auto max-h-20 object-contain shadow-sm" />
                    </div>
                  )}

                  {/* Core Layout Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Content Area */}
                    <div className="col-span-2 space-y-6">
                      {/* Article Title */}
                      <div className="p-4 bg-slate-50 border rounded-lg">
                        <div className="w-20 h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-6 bg-slate-300 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>

                      {/* Slot Tengah Konten (728x90) */}
                      {position === 'Tengah Konten' && (
                        <div className="w-full flex flex-col items-center justify-center my-6 bg-gray-100 p-2 border rounded-lg">
                          <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT IKLAN TENGAH KONTEN (728x90) ]</span>
                          <img src={previewUrl} alt="Ad Content" className="max-w-full h-auto max-h-20 object-contain shadow-sm" />
                        </div>
                      )}

                      {/* Article Paragraphs */}
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                      {/* Slot Sidebar Atas (300x250) */}
                      <div className="p-4 bg-slate-50 border rounded-lg flex flex-col items-center justify-center min-h-[150px]">
                        {position === 'Sidebar Atas' ? (
                          <>
                            <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT SIDEBAR ATAS (300x250) ]</span>
                            <img src={previewUrl} alt="Ad Sidebar Top" className="w-full max-h-44 object-contain shadow-sm rounded" />
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400">Slot Sidebar Atas (Kosong)</span>
                        )}
                      </div>

                      {/* Slot Sidebar Bawah (300x600) */}
                      <div className="p-4 bg-slate-50 border rounded-lg flex flex-col items-center justify-center min-h-[250px]">
                        {position === 'Sidebar Bawah' ? (
                          <>
                            <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT SIDEBAR BAWAH (300x600) ]</span>
                            <img src={previewUrl} alt="Ad Sidebar Bottom" className="w-full max-h-72 object-contain shadow-sm rounded" />
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400">Slot Sidebar Bawah (Kosong)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Slot Footer (970x250) */}
                  {position === 'Footer' && (
                    <div className="w-full flex flex-col items-center justify-center mt-6 bg-gray-100 p-2 border rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT IKLAN FOOTER (970x250) ]</span>
                      <img src={previewUrl} alt="Ad Footer" className="max-w-full h-auto max-h-36 object-contain shadow-sm" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mobile Mockup Layout */
              <div className="w-[375px] h-[700px] border-[14px] border-gray-900 rounded-[3rem] mx-auto overflow-hidden relative shadow-2xl bg-white mt-4 text-slate-955 flex flex-col">
                <div className="overflow-y-auto h-full p-4 flex flex-col gap-4">
                  {/* Logo / Header Row */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-lg font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-mono">MOBILE PREVIEW</div>
                  </div>

                  {/* Slot Header Atas (728x90) on Mobile */}
                  {position === 'Header' && (
                    <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-1 border rounded-lg">
                      <span className="text-[9px] text-gray-400 font-bold mb-0.5">[ HEADER SLIDER (Mobile Fit) ]</span>
                      <img src={previewUrl} alt="Ad Header Mobile" className="max-w-full h-auto max-h-12 object-contain shadow-sm" />
                    </div>
                  )}

                  {/* Article Content Area */}
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 border rounded-lg">
                      <div className="w-12 h-3 bg-slate-200 rounded mb-1"></div>
                      <div className="h-4 bg-slate-300 rounded mb-1 w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>

                    {/* Slot Tengah Konten (728x90) on Mobile */}
                    {position === 'Tengah Konten' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-1 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-0.5">[ IN-FEED SLIDER (Mobile Fit) ]</span>
                        <img src={previewUrl} alt="Ad Content Mobile" className="max-w-full h-auto max-h-12 object-contain shadow-sm" />
                      </div>
                    )}

                    {/* Text Mockup */}
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                    </div>

                    {/* Slot Sidebar Atas (300x250) on Mobile */}
                    {position === 'Sidebar Atas' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-2 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-1">[ SIDEBAR ATAS (300x250) ]</span>
                        <img src={previewUrl} alt="Ad Sidebar Top Mobile" className="w-full max-h-40 object-contain shadow-sm rounded" />
                      </div>
                    )}

                    {/* Slot Sidebar Bawah (300x600) on Mobile */}
                    {position === 'Sidebar Bawah' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-2 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-1">[ SIDEBAR BAWAH (300x600) ]</span>
                        <img src={previewUrl} alt="Ad Sidebar Bottom Mobile" className="w-full max-h-60 object-contain shadow-sm rounded" />
                      </div>
                    )}

                    {/* Slot Footer (970x250) on Mobile */}
                    {position === 'Footer' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-1 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-0.5">[ FOOTER SLIDER (Mobile Fit) ]</span>
                        <img src={previewUrl} alt="Ad Footer Mobile" className="max-w-full h-auto max-h-16 object-contain shadow-sm" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {message && <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-900 text-sm font-bold"><i className="fa-solid fa-check mr-2"></i>{message}</div>}

      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kelola Pemasangan Iklan</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ads.length} iklan terdaftar</p>
        </div>
        <button onClick={() => setShowFormModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors">
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Pasang Iklan Baru</span>
          <span className="sm:hidden">Pasang</span>
        </button>
      </div>

      <GuideBox title="💡 Cara Menggunakan Halaman Ini">
        <p>Klik <strong>Pasang Iklan Baru</strong> → isi nama klien, pilih posisi slot, upload foto → sistem akan melakukan <strong>Auto-Scale</strong> secara responsif menyesuaikan layar pembaca tanpa memotong gambar. Iklan yang aktif dapat dihapus kapan saja dari daftar di bawah.</p>
      </GuideBox>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desktop Form (sidebar kiri) */}
        <div className="hidden lg:block bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-base text-gray-900 mb-4 border-b pb-2">{editingId ? 'Edit Data Iklan' : 'Pasang Iklan Baru'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-bold">{error}</div>}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Nama Iklan / Klien</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Cth: Iklan Banner Pemkab Sidoarjo"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Posisi Iklan</label>
              <select value={position} onChange={e => setPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required>
                 <option value="Header">Spanduk Paling Atas (Di Bawah Logo) — (1200x200 px | Rasio 6:1)</option>
                 <option value="Tengah Konten">Menyelip di Tengah Daftar Berita — (728x90 px | Rasio 8:1)</option>
                 <option value="Sidebar Atas">Samping Kanan (Bentuk Kotak) — (300x250 px | Rasio 6:5)</option>
                 <option value="Sidebar Bawah">Samping Kanan (Memanjang ke Bawah) — (300x600 px | Rasio 1:2)</option>
                 <option value="Footer">Spanduk Paling Bawah Website — (970x250 px | Rasio 4:1)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Link Tujuan (Opsional)</label>
              <input type="url" value={link} onChange={e => setLink(e.target.value)}
                placeholder="https://tautan-iklan.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Tanggal Berakhir Kontrak (Opsional)</label>
              <input type="date" value={tanggalBerakhir} onChange={e => setTanggalBerakhir(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-slate-700" />
              <p className="text-xs text-gray-500 mt-1">*Kosongkan jika iklan tayang permanen.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Gambar Iklan Utama / Desktop (Wajib)</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-semibold mb-2">
                <i className="fa-solid fa-circle-info mr-1"></i>{getGuidelineText(position)}
              </div>
              <input id="ad-image-input" type="file" accept="image/*" onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" required={!editingId} />
              {previewUrl && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-gray-600 mb-1">Pratinjau Hasil Crop:</p>
                  <img src={previewUrl} alt="Preview Iklan" className="w-full max-h-36 object-contain border rounded-lg shadow-sm" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Gambar Iklan Khusus HP (Opsional)</label>
              <input id="ad-mobile-image-input" type="file" accept="image/*" onChange={handleMobileImageChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" />
              <p className="text-[10px] text-gray-500 mt-1">Tips: Upload desain versi kotak (misal 300x250 px) agar iklan tampil gagah dan terbaca jelas di layar HP. Jika Anda mengosongkan ini, sistem akan otomatis menggunakan Gambar Utama.</p>
              {mobilePreviewUrl && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-gray-600 mb-1">Pratinjau Layar HP:</p>
                  <img src={mobilePreviewUrl} alt="Preview Iklan Mobile" className="w-full max-h-36 object-contain border rounded-lg shadow-sm" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2.5 mt-4">
              <button type="button" onClick={handleOpenPreview}
                className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-100 shadow-sm transition-all cursor-pointer text-center">
                Lihat Pratinjau
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit}
                  className="w-full px-6 py-3 bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-200 shadow-sm transition-all cursor-pointer text-center">
                  Batal Edit
                </button>
              )}
              <button type="submit" disabled={processing}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-50 shadow-sm cursor-pointer">
                {processing ? 'Menyimpan...' : (editingId ? 'Update Iklan' : 'Upload & Pasang Iklan')}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Iklan */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="text" placeholder="Cari nama iklan atau posisi..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat iklan...</div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-bold text-sm">
              {searchQuery ? `Tidak ada iklan "${searchQuery}"` : 'Belum ada iklan terdaftar.'}
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {paginated.map(ad => (
                  <div key={ad.id} className="p-4 flex gap-3 items-start">
                    <img src={ad.image} alt={ad.name}
                      className="w-16 h-12 object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-100"
                      onError={e => { e.target.src = ''; e.target.className = 'w-16 h-12 bg-gray-200 rounded-lg shrink-0'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{ad.name}</p>
                      <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${positionBadgeColor(ad.position)}`}>
                        {positionLabel(ad.position)}
                      </span>
                      {ad.link && ad.link !== '-' && (
                        <p className="text-xs text-blue-600 truncate mt-0.5">{ad.link}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEdit(ad)}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 font-bold transition-colors">
                          <i className="fa-solid fa-pen-to-square mr-1"></i>Edit
                        </button>
                        <button onClick={() => { setPendingAction(() => () => handleDelete(ad.id)); setIsPinModalOpen(true); }}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border border-red-200 font-bold transition-colors">
                          <i className="fa-solid fa-trash mr-1"></i>Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3">Preview</th>
                      <th className="px-5 py-3">Nama Iklan</th>
                      <th className="px-5 py-3">Posisi</th>
                      <th className="px-5 py-3">Link Tujuan</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map(ad => (
                      <tr key={ad.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-5 py-3">
                          <img src={ad.image} alt={ad.name}
                            className="h-10 w-20 object-cover rounded-md border border-gray-200 bg-gray-100"
                            onError={e => { e.target.src = ''; e.target.className = 'h-10 w-20 bg-gray-200 rounded-md'; }} />
                        </td>
                        <td className="px-5 py-3 font-bold text-gray-900 max-w-[160px]">
                          <p className="line-clamp-2">{ad.name}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${positionBadgeColor(ad.position)}`}>
                            {positionLabel(ad.position)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {ad.link && ad.link !== '-' ? (
                            <a href={ad.link} target="_blank" rel="noreferrer"
                              className="text-blue-700 hover:underline text-xs font-semibold truncate max-w-[100px] block">
                              {ad.link}
                            </a>
                          ) : <span className="text-gray-400 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(ad)}
                              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 font-bold transition-colors">
                              Edit
                            </button>
                            <button onClick={() => { setPendingAction(() => () => handleDelete(ad.id)); setIsPinModalOpen(true); }}
                              className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border border-red-200 font-bold transition-colors">
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>
      <PinAuthModal 
        isOpen={isPinModalOpen} 
        onClose={() => { setIsPinModalOpen(false); setPendingAction(null); }} 
        onSuccess={() => {
          setIsPinModalOpen(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
      />
    </AdminLayout>
  );
}
