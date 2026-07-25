import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import PinAuthModal from '@/components/admin/PinAuthModal';
import ResponsiveAd from '@/components/ResponsiveAd';

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

  // Form states (Single Image Upload)
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Header');
  const [link, setLink] = useState('');
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleOpenPreview = () => {
    if (!previewUrl) {
      alert('Pilih berkas gambar iklan terlebih dahulu!');
      return;
    }
    setShowPreview(true);
  };

  const getGuidelineText = (pos) => {
    return 'Tips: Upload 1 file gambar iklan utama (WebP, JPG, PNG). Sistem otomatis menyesuaikan bentuk banner secara proporsional (3.2:1 di HP & 4.8:1 di Laptop) mengisi bingkai secara sempurna tanpa ruang kosong.';
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName(''); setPosition('Header'); setLink(''); setTanggalBerakhir('');
    setImageFile(null); setPreviewUrl('');
    setEditingId(null);
    const fileInput = document.getElementById('ad-image-input');
    if (fileInput) fileInput.value = '';
    const fileInputModal = document.getElementById('ad-image-input-modal');
    if (fileInputModal) fileInputModal.value = '';
  };

  const handleEdit = (iklan) => {
    setEditingId(iklan.id);
    setName(iklan.name || '');
    setPosition(iklan.position || 'Header');
    setLink(iklan.link || '');
    setTanggalBerakhir(iklan.tanggal_berakhir || '');
    setPreviewUrl(iklan.image || iklan.image_mobile_url || '');
    setImageFile(null);
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
      let publicUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `ads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, imageFile);
        if (uploadError) throw new Error('Gagal mengunggah gambar: ' + uploadError.message);
        const { data: { publicUrl: loadedUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        publicUrl = loadedUrl;
      }

      const payload = {
        name,
        position,
        link: link || '-',
        tanggal_berakhir: tanggalBerakhir || null,
        is_active: true
      };

      if (imageFile) {
        payload.image = publicUrl;
        payload.image_mobile_url = publicUrl;
      }

      if (editingId) {
        const { error: updateError } = await supabase.from('ads').update(payload).eq('id', editingId);
        if (updateError) throw updateError;
        setMessage('Iklan berhasil diperbarui.');
      } else {
        if (!imageFile) {
          throw new Error('Gambar Iklan Utama Wajib diisi!');
        }
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
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">Gambar Iklan Utama (Desktop &amp; Mobile)</label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-semibold mb-2">
                  <i className="fa-solid fa-circle-info mr-1"></i>{getGuidelineText(position)}
                </div>
                <input id="ad-image-input-modal" type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" required={!editingId} />
              </div>
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-colors"
            >
              ❌ Tutup Pratinjau
            </button>
          </div>

          {/* Main Preview Container */}
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center pointer-events-none select-none">
            {previewDevice === 'desktop' ? (
              /* Desktop Mockup Layout */
              <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 text-white overflow-y-auto max-h-[85vh] flex flex-col gap-6">
                <div className="max-w-4xl mx-auto w-full bg-white text-slate-950 p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div className="text-2xl font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV.com</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">DUMMY WEBSITE PREVIEW</div>
                  </div>

                  {position === 'Header' && (
                    <div className="w-full flex flex-col items-center justify-center mb-6 bg-gray-100 p-2 border rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT IKLAN HEADER ATAS ]</span>
                      <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div className="p-4 bg-slate-50 border rounded-lg">
                        <div className="w-20 h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-6 bg-slate-300 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>

                      {position === 'Tengah Konten' && (
                        <div className="w-full flex flex-col items-center justify-center my-6 bg-gray-100 p-2 border rounded-lg">
                          <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT IKLAN TENGAH KONTEN ]</span>
                          <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 bg-slate-50 border rounded-lg flex flex-col items-center justify-center min-h-[150px]">
                        {position === 'Sidebar Atas' ? (
                          <>
                            <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT SIDEBAR ATAS ]</span>
                            <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400">Slot Sidebar Atas (Kosong)</span>
                        )}
                      </div>

                      <div className="p-4 bg-slate-50 border rounded-lg flex flex-col items-center justify-center min-h-[250px]">
                        {position === 'Sidebar Bawah' ? (
                          <>
                            <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT SIDEBAR BAWAH ]</span>
                            <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400">Slot Sidebar Bawah (Kosong)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {position === 'Footer' && (
                    <div className="w-full flex flex-col items-center justify-center mt-6 bg-gray-100 p-2 border rounded-lg">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">[ SLOT IKLAN FOOTER ]</span>
                      <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Mobile Mockup Layout */
              <div className="w-[375px] h-[700px] border-[14px] border-gray-900 rounded-[3rem] mx-auto overflow-hidden relative shadow-2xl bg-white mt-4 text-slate-950 flex flex-col">
                <div className="overflow-y-auto h-full p-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="text-lg font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-mono">MOBILE PREVIEW</div>
                  </div>

                  {position === 'Header' && (
                    <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-1 border rounded-lg">
                      <span className="text-[9px] text-gray-400 font-bold mb-0.5">[ HEADER SLIDER ]</span>
                      <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 border rounded-lg">
                      <div className="w-12 h-3 bg-slate-200 rounded mb-1"></div>
                      <div className="h-4 bg-slate-300 rounded mb-1 w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>

                    {position === 'Tengah Konten' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-1 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-0.5">[ IN-FEED SLIDER ]</span>
                        <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                    </div>

                    {position === 'Sidebar Atas' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-2 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-1">[ SIDEBAR ATAS ]</span>
                        <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                      </div>
                    )}

                    {position === 'Sidebar Bawah' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-2 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-1">[ SIDEBAR BAWAH ]</span>
                        <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
                      </div>
                    )}

                    {position === 'Footer' && (
                      <div className="w-full flex flex-col items-center justify-center bg-gray-100 p-1 border rounded-lg">
                        <span className="text-[9px] text-gray-400 font-bold mb-0.5">[ FOOTER SLIDER ]</span>
                        <ResponsiveAd linkTujuan={link} image={previewUrl} altText={name || 'Pratinjau Iklan'} />
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
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors lg:hidden">
          <i className="fa-solid fa-plus"></i>
          <span>Pasang Iklan Baru</span>
        </button>
      </div>

      <GuideBox title="💡 Cara Menggunakan Halaman Ini">
        <p>Isi formulir di sebelah kiri dan upload 1 gambar iklan terbaik → pratinjau iklan responsif akan tampil secara real-time di kolom kanan. Gambar akan otomatis melakukan auto-scale secara 100% utuh di Desktop maupun HP tanpa terpotong.</p>
      </GuideBox>

      {/* Main Grid Section: 2 Columns (Form Left, Live Preview Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Kolom Kiri: Form Input Iklan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-base text-gray-900 mb-4 border-b pb-2 flex items-center justify-between">
            <span>{editingId ? 'Edit Data Iklan' : 'Pasang Iklan Baru'}</span>
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
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">Gambar Iklan Utama (Desktop &amp; Mobile)</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-semibold mb-2">
                <i className="fa-solid fa-circle-info mr-1"></i>{getGuidelineText(position)}
              </div>
              <input id="ad-image-input" type="file" accept="image/*" onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" required={!editingId} />
            </div>
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

        {/* Kolom Kanan: Pratinjau Iklan (Live) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
              <h3 className="font-bold text-base text-gray-900">Pratinjau Iklan (Live)</h3>
            </div>
            <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md font-bold text-xs">
              {positionLabel(position)}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center p-4 bg-slate-50 border border-dashed border-gray-300 rounded-xl min-h-[280px]">
            {previewUrl ? (
              <div className="w-full block pointer-events-none select-none">
                <ResponsiveAd
                  linkTujuan={link}
                  image={previewUrl}
                  altText={name || 'Pratinjau Iklan'}
                />
              </div>
            ) : (
              <div className="text-center p-6 max-w-sm">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Pratinjau Siap Divalidasi</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Silakan upload 1 gambar iklan untuk melihat pratinjau auto-scale tanpa terpotong.
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
            <input type="text" placeholder="Cari nama iklan atau posisi..."
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
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {paginated.map(ad => (
                <div key={ad.id} className="p-4 flex gap-3 items-start">
                  <img src={ad.image || ad.image_mobile_url} alt={ad.name}
                    className="w-16 h-12 object-contain rounded-lg border border-gray-200 shrink-0 bg-gray-100"
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
                        <img src={ad.image || ad.image_mobile_url} alt={ad.name}
                          className="h-10 w-20 object-contain rounded-md border border-gray-200 bg-gray-100"
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
