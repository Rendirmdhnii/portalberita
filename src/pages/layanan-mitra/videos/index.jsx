import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import PinAuthModal from '@/components/admin/PinAuthModal';

const ITEMS_PER_PAGE = 10;

function GuideBox({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-blue-800 font-semibold text-sm hover:bg-blue-100 transition-colors"
      >
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

export default function VideoIndex() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [judul, setJudul] = useState('');
  const [link, setLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase.from('videos').select('*').order('id', { ascending: false });
      if (fetchErr) throw fetchErr;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const extractYoutubeId = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|live\/|shorts\/)|youtu\.be\/).+$/;
    if (!youtubeRegex.test(url)) return null;
    try {
      const cleanedUrl = url.trim();
      if (cleanedUrl.includes('youtu.be/')) {
        const id = cleanedUrl.split('youtu.be/')[1]?.split(/[?#&]/)[0];
        if (id?.length === 11) return id;
      }
      if (cleanedUrl.includes('/live/')) {
        const id = cleanedUrl.split('/live/')[1]?.split(/[?#&]/)[0];
        if (id?.length === 11) return id;
      }
      if (cleanedUrl.includes('/shorts/')) {
        const id = cleanedUrl.split('/shorts/')[1]?.split(/[?#&]/)[0];
        if (id?.length === 11) return id;
      }
      const match = cleanedUrl.match(/^.*(v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      if (match?.[2]?.length === 11) return match[2];
      return null;
    } catch { return null; }
  };

  const handleOpenPreview = () => {
    const ytId = extractYoutubeId(link);
    if (!ytId) {
      alert('Tolong masukkan Link URL YouTube yang valid dulu ya, pak/bu!');
      return;
    }
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setProcessing(true);
    setError('');
    try {
      const ytId = extractYoutubeId(link);
      if (!ytId) throw new Error('Format link YouTube tidak valid. Harap masukkan tautan yang benar.');
      const { error: insertError } = await supabase.from('videos').insert([{ judul, link, youtube_id: ytId }]);
      if (insertError) throw insertError;
      setJudul('');
      setLink('');
      setMessage('Video YouTube berhasil ditambahkan.');
      setShowModal(false);
      fetchVideos();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan video.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      try {
        const { error: deleteErr } = await supabase.from('videos').delete().eq('id', id);
        if (deleteErr) throw deleteErr;
        setMessage('Video berhasil dihapus.');
        fetchVideos();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menghapus video: ' + err.message);
      }
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return videos;
    return videos.filter(v => v.judul?.toLowerCase().includes(q) || v.youtube_id?.toLowerCase().includes(q));
  }, [videos, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const AddForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); setPendingAction(() => handleSubmit); setIsPinModalOpen(true); }} className="space-y-4">
      {error && <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm font-bold">{error}</div>}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">Judul Video</label>
        <input type="text" value={judul} onChange={e => setJudul(e.target.value)}
          placeholder="Cth: Detik-detik Pengesahan Pengurus DPC PKB"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required autoFocus />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">Link URL YouTube</label>
        <input type="text" value={link} onChange={e => setLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required />
        <p className="text-xs text-gray-500 mt-1">Tempel link video YouTube dari browser Anda.</p>
      </div>
      <div className="flex flex-col gap-2.5 mt-4">
        <button type="button" onClick={handleOpenPreview}
          className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-100 shadow-sm transition-all cursor-pointer text-center">
          Lihat Pratinjau
        </button>
        <button type="submit" disabled={processing}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer">
          {processing ? 'Menyimpan...' : 'Simpan & Tayangkan Video'}
        </button>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <Head><title>Kelola Pojok Video - PojokTV</title></Head>

      {/* Modal (Mobile) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl rounded-b-none sm:rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Tambah Video Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-xl">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <AddForm />
          </div>
        </div>
      )}

      {/* Modal Pratinjau Video */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm overflow-hidden">
          {/* Header Modal */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-base">Pratinjau Tampilan</span>
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
              className="bg-red-650 hover:bg-red-750 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-colors"
            >
              ❌ Tutup Pratinjau
            </button>
          </div>

          {/* Main Preview Container */}
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            {previewDevice === 'desktop' ? (
              /* Desktop Wrapper */
              <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 text-white overflow-y-auto max-h-[85vh]">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl md:text-2xl font-bold mb-4 font-serif text-white">{judul || 'Judul Video Belum Ditulis'}</h2>
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black border border-slate-800">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${extractYoutubeId(link)}`}
                      title={judul}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 italic">Foto/Video: Dokumentasi Redaksi PojokTV</p>
                </div>
              </div>
            ) : (
              /* Mobile Mockup Frame */
              <div className="w-[375px] h-[700px] border-[14px] border-gray-900 rounded-[3rem] mx-auto overflow-hidden relative shadow-2xl bg-slate-900 mt-4 text-white">
                <div className="overflow-y-auto h-full p-4">
                  <h2 className="text-base font-bold mb-3 font-serif leading-snug">{judul || 'Judul Video Belum Ditulis'}</h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow bg-black border border-slate-800">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${extractYoutubeId(link)}`}
                      title={judul}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Foto/Video: Dokumentasi Redaksi PojokTV</p>
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
          <h1 className="text-xl font-bold text-gray-900">Kelola Pojok Video</h1>
          <p className="text-sm text-gray-500 mt-0.5">{videos.length} video tayang</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors">
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Tambah Video</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      <GuideBox title="💡 Cara Menggunakan Halaman Ini">
        <p>Klik <strong>+ Tambah Video</strong> lalu tempel link YouTube (format: youtube.com/watch?v=... atau youtu.be/...). Sistem akan otomatis mengekstrak ID video. Video yang salah bisa dihapus dengan tombol Hapus di setiap baris.</p>
      </GuideBox>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desktop Form */}
        <div className="hidden lg:block bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-base text-gray-900 mb-4 border-b pb-2">Tambah Video Baru</h3>
          <AddForm />
        </div>

        {/* Daftar Video */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="text" placeholder="Cari judul video..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat video...</div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-bold text-sm">
              {searchQuery ? `Tidak ada video "${searchQuery}"` : 'Belum ada video tayang.'}
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {paginated.map(video => (
                  <div key={video.id} className="p-4 flex gap-3 items-start">
                    <img src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                      alt={video.judul} className="w-20 h-14 object-cover rounded-lg border border-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm line-clamp-2">{video.judul}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{video.youtube_id}</p>
                      <button onClick={() => handleDelete(video.id)}
                        className="mt-2 text-xs bg-red-50 hover:bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border border-red-200 font-bold transition-colors">
                        <i className="fa-solid fa-trash mr-1"></i>Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Preview</th>
                      <th className="px-6 py-3">Judul Video</th>
                      <th className="px-6 py-3">YouTube ID</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map(video => (
                      <tr key={video.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-3">
                          <img src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                            alt={video.judul} className="h-10 w-20 object-cover rounded-md border border-gray-200" />
                        </td>
                        <td className="px-6 py-3 font-bold text-gray-900 max-w-xs">
                          <p className="line-clamp-2">{video.judul}</p>
                        </td>
                        <td className="px-6 py-3 font-mono text-xs text-gray-500">{video.youtube_id}</td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={() => { setPendingAction(() => () => handleDelete(video.id)); setIsPinModalOpen(true); }}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-3 py-1.5 rounded-lg border border-red-200 font-bold transition-colors">
                            Hapus
                          </button>
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
