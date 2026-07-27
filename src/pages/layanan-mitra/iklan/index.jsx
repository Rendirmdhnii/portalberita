import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import PinAuthModal from '@/components/admin/PinAuthModal';
import ResponsiveAd from '@/components/ResponsiveAd';
import Cropper from 'react-easy-crop';

// Canvas Cropping Helpers
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

  // Form states (3 Responsive Banner Uploads)
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Header');
  const [link, setLink] = useState('');
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState('');
  const [tabletFile, setTabletFile] = useState(null);
  const [tabletPreviewUrl, setTabletPreviewUrl] = useState('');
  const [mobileFile, setMobileFile] = useState(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState('');

  const handleOpenPreview = () => {
    if (!desktopPreviewUrl && !tabletPreviewUrl && !mobilePreviewUrl) {
      alert('Pilih/upload setidaknya 1 berkas banner iklan terlebih dahulu!');
      return;
    }
    setShowPreview(true);
  };

  const positionLabel = (pos) => {
    const labels = {
      'Header': 'Spanduk Paling Atas (Di Bawah Logo)',
      'Tengah Konten': 'Menyelip di Tengah Daftar Berita',
      'Sidebar Atas': 'Samping Kanan (Bentuk Kotak)',
      'Sidebar Bawah': 'Samping Kanan (Memanjang ke Bawah)',
      'Footer': 'Spanduk Paling Bawah Website',
      'header': 'Spanduk Paling Atas (Di Bawah Logo)',
      'sidebar': 'Samping Kanan (Bentuk Kotak)',
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

  // Cropper states
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('');
  const [cropAspect, setCropAspect] = useState(4.8 / 1);
  const [cropTarget, setCropTarget] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  const handleBannerFileChange = (e, target) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalFileName(file.name);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropTarget(target);

      const previewUrl = URL.createObjectURL(file);
      if (target === 'desktop') {
        setCropAspect(4.8 / 1);
        if (desktopPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(desktopPreviewUrl);
        setDesktopFile(file);
        setDesktopPreviewUrl(previewUrl);
      } else if (target === 'tablet') {
        setCropAspect(4.27 / 1);
        if (tabletPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(tabletPreviewUrl);
        setTabletFile(file);
        setTabletPreviewUrl(previewUrl);
      } else if (target === 'mobile') {
        setCropAspect(3.2 / 1);
        if (mobilePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(mobilePreviewUrl);
        setMobileFile(file);
        setMobilePreviewUrl(previewUrl);
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropImageSrc(reader.result);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleReCropTarget = (target) => {
    let url = '';
    if (target === 'desktop') { url = desktopPreviewUrl; setCropAspect(4.8 / 1); }
    else if (target === 'tablet') { url = tabletPreviewUrl; setCropAspect(4.27 / 1); }
    else if (target === 'mobile') { url = mobilePreviewUrl; setCropAspect(3.2 / 1); }

    if (!url) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropTarget(target);
    setCropImageSrc(url);
    setIsCropModalOpen(true);
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !cropTarget) return;
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!croppedBlob) return;
      const fileExt = originalFileName ? originalFileName.split('.').pop() : 'jpg';
      const file = new File([croppedBlob], `ad_${cropTarget}_${Date.now()}.${fileExt}`, { type: croppedBlob.type || 'image/jpeg' });
      const newUrl = URL.createObjectURL(croppedBlob);

      if (cropTarget === 'desktop') {
        if (desktopPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(desktopPreviewUrl);
        setDesktopFile(file);
        setDesktopPreviewUrl(newUrl);
      } else if (cropTarget === 'tablet') {
        if (tabletPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(tabletPreviewUrl);
        setTabletFile(file);
        setTabletPreviewUrl(newUrl);
      } else if (cropTarget === 'mobile') {
        if (mobilePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(mobilePreviewUrl);
        setMobileFile(file);
        setMobilePreviewUrl(newUrl);
      }

      setIsCropModalOpen(false);
    } catch (err) {
      alert('Gagal memotong gambar: ' + err.message);
    }
  };

  const handleCancelCrop = () => {
    setIsCropModalOpen(false);
  };

  const resetForm = () => {
    setName(''); setPosition('Header'); setLink(''); setTanggalBerakhir('');
    setDesktopFile(null); setDesktopPreviewUrl('');
    setTabletFile(null); setTabletPreviewUrl('');
    setMobileFile(null); setMobilePreviewUrl('');
    setEditingId(null);

    ['ad-desktop-input', 'ad-tablet-input', 'ad-mobile-input', 'ad-desktop-input-modal', 'ad-tablet-input-modal', 'ad-mobile-input-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  };

  const handleEdit = (iklan) => {
    setEditingId(iklan.id);
    setName(iklan.name || '');
    setPosition(iklan.position || 'Header');
    setLink(iklan.link || '');
    setTanggalBerakhir(iklan.tanggal_berakhir || '');

    setDesktopPreviewUrl(iklan.desktop_image_url || iklan.image || '');
    setTabletPreviewUrl(iklan.tablet_image_url || iklan.image || '');
    setMobilePreviewUrl(iklan.mobile_image_url || iklan.image_mobile_url || iklan.image || '');
    setDesktopFile(null); setTabletFile(null); setMobileFile(null);

    setShowFormModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
    setShowFormModal(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setProcessing(true);
    setError('');
    try {
      let uploadedDesktopUrl = desktopPreviewUrl;
      let uploadedTabletUrl = tabletPreviewUrl;
      let uploadedMobileUrl = mobilePreviewUrl;

      if (desktopFile) {
        const fileExt = desktopFile.name.split('.').pop();
        const fileName = `desktop_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `ads/${fileName}`;
        const { error: uploadErr } = await supabase.storage.from('images').upload(filePath, desktopFile);
        if (uploadErr) throw new Error('Gagal mengunggah banner desktop: ' + uploadErr.message);
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        uploadedDesktopUrl = publicUrl;
      }

      if (tabletFile) {
        const fileExt = tabletFile.name.split('.').pop();
        const fileName = `tablet_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `ads/${fileName}`;
        const { error: uploadErr } = await supabase.storage.from('images').upload(filePath, tabletFile);
        if (uploadErr) throw new Error('Gagal mengunggah banner tablet: ' + uploadErr.message);
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        uploadedTabletUrl = publicUrl;
      }

      if (mobileFile) {
        const fileExt = mobileFile.name.split('.').pop();
        const fileName = `mobile_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `ads/${fileName}`;
        const { error: uploadErr } = await supabase.storage.from('images').upload(filePath, mobileFile);
        if (uploadErr) throw new Error('Gagal mengunggah banner mobile: ' + uploadErr.message);
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        uploadedMobileUrl = publicUrl;
      }

      if (!editingId) {
        if (!uploadedDesktopUrl || !uploadedTabletUrl || !uploadedMobileUrl) {
          throw new Error('Semua 3 file banner (Desktop, Tablet, Mobile) wajib diunggah!');
        }
      }

      const payload = {
        name,
        position,
        link: link || '-',
        tanggal_berakhir: tanggalBerakhir || null,
        is_active: true,
        desktop_image_url: uploadedDesktopUrl,
        tablet_image_url: uploadedTabletUrl,
        mobile_image_url: uploadedMobileUrl,
        image: uploadedDesktopUrl || uploadedMobileUrl,
        image_mobile_url: uploadedMobileUrl || uploadedDesktopUrl,
      };

      if (editingId) {
        const { error: updateError } = await supabase.from('ads').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        setMessage('Iklan berhasil diperbarui.');
      } else {
        const { error: insertError } = await supabase.from('ads').insert([payload]);
        if (insertError) throw insertError;
        setMessage('Iklan 3 banner responsif berhasil ditayangkan.');
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

  const renderFileInputSection = (isModal = false) => {
    const suffix = isModal ? '-modal' : '';
    return (
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <i className="fa-solid fa-layer-group text-red-600"></i>
          3 File Banner Responsif (Wajib Upload)
        </p>

        {/* Input 1: Banner Desktop */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">
            Upload Banner Desktop <span className="text-gray-500 font-normal">(Rekomendasi: 1440x300 px | Rasio 4.8:1)</span> *
          </label>
          <input id={`ad-desktop-input${suffix}`} type="file" accept="image/*" onChange={(e) => handleBannerFileChange(e, 'desktop')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none bg-white" required={!editingId && !desktopPreviewUrl} />
          {desktopPreviewUrl && (
            <div className="mt-1.5 flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={desktopPreviewUrl} alt="Desktop" className="h-8 w-20 object-contain rounded border bg-white" />
                <span className="text-[11px] text-green-700 font-bold">✓ Banner Desktop Siap</span>
              </div>
              <button type="button" onClick={() => handleReCropTarget('desktop')} className="text-[11px] text-blue-700 hover:underline font-bold">
                Potong Lagi
              </button>
            </div>
          )}
        </div>

        {/* Input 2: Banner Tablet */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">
            Upload Banner Tablet <span className="text-gray-500 font-normal">(Rekomendasi: 768x180 px | Rasio 4.27:1)</span> *
          </label>
          <input id={`ad-tablet-input${suffix}`} type="file" accept="image/*" onChange={(e) => handleBannerFileChange(e, 'tablet')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none bg-white" required={!editingId && !tabletPreviewUrl} />
          {tabletPreviewUrl && (
            <div className="mt-1.5 flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={tabletPreviewUrl} alt="Tablet" className="h-8 w-20 object-contain rounded border bg-white" />
                <span className="text-[11px] text-green-700 font-bold">✓ Banner Tablet Siap</span>
              </div>
              <button type="button" onClick={() => handleReCropTarget('tablet')} className="text-[11px] text-blue-700 hover:underline font-bold">
                Potong Lagi
              </button>
            </div>
          )}
        </div>

        {/* Input 3: Banner Mobile */}
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">
            Upload Banner Mobile <span className="text-gray-500 font-normal">(Rekomendasi: 640x200 px | Rasio 3.2:1)</span> *
          </label>
          <input id={`ad-mobile-input${suffix}`} type="file" accept="image/*" onChange={(e) => handleBannerFileChange(e, 'mobile')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none bg-white" required={!editingId && !mobilePreviewUrl} />
          {mobilePreviewUrl && (
            <div className="mt-1.5 flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={mobilePreviewUrl} alt="Mobile" className="h-8 w-16 object-contain rounded border bg-white" />
                <span className="text-[11px] text-green-700 font-bold">✓ Banner Mobile Siap</span>
              </div>
              <button type="button" onClick={() => handleReCropTarget('mobile')} className="text-[11px] text-blue-700 hover:underline font-bold">
                Potong Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Head><title>Kelola Iklan 3 Banner Responsif - PojokTV</title></Head>

      {/* Form Modal (Mobile Slide-Up) */}
      {showFormModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/50 px-4" onClick={() => setShowFormModal(false)}>
          <div className="bg-white rounded-2xl rounded-b-none sm:rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">{editingId ? 'Edit Data Iklan 3 Banner' : 'Pasang Iklan 3 Banner Baru'}</h3>
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
                  <option value="Header">Spanduk Paling Atas (Di Bawah Logo)</option>
                  <option value="Tengah Konten">Menyelip di Tengah Daftar Berita</option>
                  <option value="Sidebar Atas">Samping Kanan (Bentuk Kotak)</option>
                  <option value="Sidebar Bawah">Samping Kanan (Memanjang ke Bawah)</option>
                  <option value="Footer">Spanduk Paling Bawah Website</option>
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

              {renderFileInputSection(true)}

              <div className="flex flex-col gap-2.5 mt-4">
                <button type="button" onClick={handleOpenPreview}
                  className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-100 shadow-sm transition-all cursor-pointer text-center">
                  Lihat Pratinjau Full Mockup
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

      {/* Modal Pratinjau Iklan (Full Layout) */}
      {showPreview && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-black/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-base">Pratinjau Letak Iklan Responsif</span>
              <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${previewDevice === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                  💻 PC (Desktop)
                </button>
                <button onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-md font-bold text-xs transition-colors ${previewDevice === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                  📱 HP (Mobile)
                </button>
              </div>
            </div>
            <button onClick={() => setShowPreview(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-colors">
              ❌ Tutup Pratinjau
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center pointer-events-none select-none">
            {previewDevice === 'desktop' ? (
              <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 text-white overflow-y-auto max-h-[85vh] flex flex-col gap-6">
                <div className="max-w-4xl mx-auto w-full bg-white text-slate-950 p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div className="text-2xl font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV.com</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">DESKTOP PREVIEW</div>
                  </div>

                  {position === 'Header' && (
                    <div className="w-full flex flex-col items-center justify-center mb-6 bg-gray-100 p-2 border rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">[ BANNER HEADER DESKTOP ]</span>
                      <ResponsiveAd linkTujuan={link} desktopImageUrl={desktopPreviewUrl} tabletImageUrl={tabletPreviewUrl} mobileImageUrl={mobilePreviewUrl} altText={name || 'Pratinjau'} />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="p-4 bg-slate-50 border rounded-lg">
                        <div className="w-20 h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-6 bg-slate-300 rounded mb-2 w-3/4"></div>
                      </div>

                      {position === 'Tengah Konten' && (
                        <div className="w-full flex flex-col items-center justify-center my-6 bg-gray-100 p-2 border rounded-lg">
                          <span className="text-[10px] text-gray-400 font-bold mb-1">[ BANNER TENGAH KONTEN DESKTOP ]</span>
                          <ResponsiveAd linkTujuan={link} desktopImageUrl={desktopPreviewUrl} tabletImageUrl={tabletPreviewUrl} mobileImageUrl={mobilePreviewUrl} altText={name || 'Pratinjau'} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-6">
                      {position === 'Sidebar Atas' && (
                        <ResponsiveAd linkTujuan={link} desktopImageUrl={desktopPreviewUrl} tabletImageUrl={tabletPreviewUrl} mobileImageUrl={mobilePreviewUrl} altText={name || 'Pratinjau'} />
                      )}
                      {position === 'Sidebar Bawah' && (
                        <ResponsiveAd linkTujuan={link} desktopImageUrl={desktopPreviewUrl} tabletImageUrl={tabletPreviewUrl} mobileImageUrl={mobilePreviewUrl} altText={name || 'Pratinjau'} />
                      )}
                    </div>
                  </div>

                  {position === 'Footer' && (
                    <div className="w-full flex flex-col items-center justify-center mt-6 bg-gray-100 p-2 border rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">[ BANNER FOOTER DESKTOP ]</span>
                      <ResponsiveAd linkTujuan={link} desktopImageUrl={desktopPreviewUrl} tabletImageUrl={tabletPreviewUrl} mobileImageUrl={mobilePreviewUrl} altText={name || 'Pratinjau'} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-[375px] h-[700px] border-[14px] border-gray-900 rounded-[3rem] mx-auto overflow-hidden relative shadow-2xl bg-white mt-4 text-slate-950 flex flex-col">
                <div className="overflow-y-auto h-full p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-lg font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-mono">MOBILE PREVIEW</div>
                  </div>

                  <ResponsiveAd linkTujuan={link} desktopImageUrl={desktopPreviewUrl} tabletImageUrl={tabletPreviewUrl} mobileImageUrl={mobilePreviewUrl} altText={name || 'Pratinjau'} />
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
          <h1 className="text-xl font-bold text-gray-900">Kelola Pemasangan Iklan (3 Banner Responsif)</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ads.length} iklan terdaftar</p>
        </div>
        <button onClick={() => setShowFormModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors lg:hidden">
          <i className="fa-solid fa-plus"></i>
          <span>Pasang Iklan Baru</span>
        </button>
      </div>

      <GuideBox title="💡 Sistem 3 Banner Responsif (Desktop, Tablet, Mobile)">
        <p>Setiap pasang iklan membutuhkan 3 berkas gambar terpisah (Desktop 4.8:1, Tablet 4.27:1, Mobile 3.2:1). Dengan teknologi HTML5 &lt;picture&gt;, browser pengunjung akan memilih gambar secara otomatis sesuai perangkat yang digunakan tanpa perlu melakukan crop atau kompresi paksa.</p>
      </GuideBox>

      {/* Main Grid Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Form Left */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-base text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
            <span>{editingId ? 'Edit Data Iklan 3 Banner' : 'Pasang Iklan 3 Banner Baru'}</span>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="text-xs text-red-600 hover:underline font-semibold">
                Batal Edit
              </button>
            )}
          </h3>
          <form onSubmit={(e) => { e.preventDefault(); setPendingAction(() => handleSubmit); setIsPinModalOpen(true); }} className="space-y-4">
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
                 <option value="Header">Spanduk Paling Atas (Di Bawah Logo)</option>
                 <option value="Tengah Konten">Menyelip di Tengah Daftar Berita</option>
                 <option value="Sidebar Atas">Samping Kanan (Bentuk Kotak)</option>
                 <option value="Sidebar Bawah">Samping Kanan (Memanjang ke Bawah)</option>
                 <option value="Footer">Spanduk Paling Bawah Website</option>
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

            {renderFileInputSection(false)}

            <div className="flex flex-col gap-2.5 pt-2">
              <button type="button" onClick={handleOpenPreview}
                className="w-full px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-100 shadow-sm transition-all cursor-pointer text-center text-sm">
                Lihat Pratinjau Full Mockup
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit}
                  className="w-full px-6 py-2.5 bg-gray-100 border border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-200 shadow-sm transition-all cursor-pointer text-center text-sm">
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

        {/* Live Preview Right */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
              <h3 className="font-bold text-base text-gray-900">Pratinjau HTML5 &lt;picture&gt; (Live)</h3>
            </div>
            <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md font-bold text-xs">
              {positionLabel(position)}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center p-4 bg-slate-50 border border-dashed border-gray-300 rounded-xl min-h-[280px]">
            {desktopPreviewUrl || tabletPreviewUrl || mobilePreviewUrl ? (
              <div className="w-full block pointer-events-none select-none">
                <ResponsiveAd
                  linkTujuan={link}
                  desktopImageUrl={desktopPreviewUrl}
                  tabletImageUrl={tabletPreviewUrl}
                  mobileImageUrl={mobilePreviewUrl}
                  altText={name || 'Pratinjau Iklan'}
                />
              </div>
            ) : (
              <div className="text-center p-6 max-w-sm">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Pratinjau 3 Banner Responsif</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Upload file banner Desktop, Tablet, dan Mobile di kolom sebelah kiri untuk menguji tag &lt;picture&gt;.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daftar Iklan Terdaftar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gray-50">
          <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
            <i className="fa-solid fa-list-check text-red-600"></i>
            Daftar Iklan Terdaftar
          </h2>
          <div className="relative w-full sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" placeholder="Cari nama iklan..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
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
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3">Banners (Desktop/Tablet/Mobile)</th>
                    <th className="px-5 py-3">Nama Iklan</th>
                    <th className="px-5 py-3">Posisi</th>
                    <th className="px-5 py-3">Link</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(ad => (
                    <tr key={ad.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <img src={ad.desktop_image_url || ad.image} title="Desktop Banner" alt="Desktop" className="h-8 w-14 object-contain rounded border bg-gray-100" />
                          <img src={ad.tablet_image_url || ad.image} title="Tablet Banner" alt="Tablet" className="h-8 w-10 object-contain rounded border bg-gray-100" />
                          <img src={ad.mobile_image_url || ad.image_mobile_url || ad.image} title="Mobile Banner" alt="Mobile" className="h-8 w-8 object-contain rounded border bg-gray-100" />
                        </div>
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
                          <a href={ad.link} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline text-xs font-semibold truncate max-w-[100px] block">
                            {ad.link}
                          </a>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(ad)} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 font-bold transition-colors">
                            Edit
                          </button>
                          <button onClick={() => { setPendingAction(() => () => handleDelete(ad.id)); setIsPinModalOpen(true); }} className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border border-red-200 font-bold transition-colors">
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

      {/* Interactive Image Cropper Modal */}
      {isCropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2 capitalize">
                <i className="fa-solid fa-crop-simple text-red-500"></i>
                Potong Banner {cropTarget}
              </h3>
              <button type="button" onClick={handleCancelCrop} className="text-gray-400 hover:text-white text-sm">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="relative flex-1 bg-slate-950 min-h-[300px] sm:min-h-[380px]">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={cropAspect || undefined}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-3 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-1">Rasio Banner Target:</span>
                <button type="button" onClick={() => setCropAspect(4.8 / 1)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${cropAspect === 4.8 / 1 ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  Desktop (4.8:1)
                </button>
                <button type="button" onClick={() => setCropAspect(4.27 / 1)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${cropAspect === 4.27 / 1 ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  Tablet (4.27:1)
                </button>
                <button type="button" onClick={() => setCropAspect(3.2 / 1)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${cropAspect === 3.2 / 1 ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  Mobile (3.2:1)
                </button>
                <button type="button" onClick={() => setCropAspect(null)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${cropAspect === null ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  Bebas / Free
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-400">Zoom</span>
                <input type="range" value={zoom} min={1} max={3} step={0.1} aria-label="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-red-600 cursor-pointer" />
                <span className="text-xs text-slate-300 font-bold font-mono">{zoom.toFixed(1)}x</span>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={handleCancelCrop} className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="button" onClick={handleSaveCrop} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors shadow cursor-pointer flex items-center gap-2">
                  <i className="fa-solid fa-check"></i>
                  Konfirmasi Potongan Banner {cropTarget}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
