import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import PinAuthModal from '@/components/admin/PinAuthModal';

const ITEMS_PER_PAGE = 15;

function GuideBox({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
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
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors">
          ← Prev
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors">
          Next →
        </button>
      </div>
    </div>
  );
}

export default function CategoryIndex() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCallback, setPinCallback] = useState(null);

  const triggerWithPin = (callback) => {
    setPinCallback(() => callback);
    setIsPinModalOpen(true);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (name.trim() === '') return;
    
    triggerWithPin(async () => {
      setProcessing(true);
      try {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        // Fetch the current maximum sort_order to append this category at the end
        const { data: maxData } = await supabase
          .from('categories')
          .select('sort_order')
          .order('sort_order', { ascending: false })
          .limit(1);

        const maxSortOrder = maxData && maxData.length > 0 ? (maxData[0].sort_order || 0) : 0;
        const nextSortOrder = maxSortOrder + 1;

        const { error } = await supabase.from('categories').insert([{ name, slug, status: 'Aktif', sort_order: nextSortOrder }]);
        if (error) throw error;
        setName('');
        setMessage('Rubrik baru berhasil ditambahkan.');
        setShowModal(false);
        fetchCategories();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menambahkan rubrik: ' + err.message);
      } finally {
        setProcessing(false);
      }
    });
  };

  const moveUp = async (category) => {
    const index = categories.findIndex(c => c.id === category.id);
    if (index <= 0) return; // Already at the top
    const prevCategory = categories[index - 1];

    let currentOrder = category.sort_order ?? 0;
    let prevOrder = prevCategory.sort_order ?? 0;

    // Swap values
    if (currentOrder === prevOrder) {
      currentOrder = prevOrder - 1;
    } else {
      const temp = currentOrder;
      currentOrder = prevOrder;
      prevOrder = temp;
    }

    setProcessing(true);
    try {
      const [res1, res2] = await Promise.all([
        supabase.from('categories').update({ sort_order: currentOrder }).eq('id', category.id),
        supabase.from('categories').update({ sort_order: prevOrder }).eq('id', prevCategory.id)
      ]);
      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;

      await fetchCategories();
      setMessage('Urutan rubrik berhasil diperbarui.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Gagal mengubah urutan rubrik: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const moveDown = async (category) => {
    const index = categories.findIndex(c => c.id === category.id);
    if (index < 0 || index >= categories.length - 1) return; // Already at the bottom
    const nextCategory = categories[index + 1];

    let currentOrder = category.sort_order ?? 0;
    let nextOrder = nextCategory.sort_order ?? 0;

    // Swap values
    if (currentOrder === nextOrder) {
      currentOrder = nextOrder + 1;
    } else {
      const temp = currentOrder;
      currentOrder = nextOrder;
      nextOrder = temp;
    }

    setProcessing(true);
    try {
      const [res1, res2] = await Promise.all([
        supabase.from('categories').update({ sort_order: currentOrder }).eq('id', category.id),
        supabase.from('categories').update({ sort_order: nextOrder }).eq('id', nextCategory.id)
      ]);
      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;

      await fetchCategories();
      setMessage('Urutan rubrik berhasil diperbarui.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Gagal mengubah urutan rubrik: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus rubrik ini? Semua berita di rubrik ini mungkin terpengaruh.')) {
      triggerWithPin(async () => {
        try {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
          setMessage('Rubrik berhasil dihapus.');
          fetchCategories();
          setTimeout(() => setMessage(''), 4000);
        } catch (err) {
          alert('Gagal menghapus rubrik: ' + err.message);
        }
      });
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(c => c.name?.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const AddForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">Nama Rubrik Baru</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Cth: Politik, Sidoarjo, Ekonomi"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950"
          required
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">Slug akan digenerate otomatis dari nama rubrik.</p>
      </div>
      <button
        type="submit"
        disabled={processing}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
      >
        {processing ? 'Menyimpan...' : 'Simpan Rubrik Baru'}
      </button>
    </form>
  );

  return (
    <AdminLayout>
      <Head><title>Kelola Rubrik Kategori Berita - PojokTV</title></Head>

      {/* Modal Tambah Rubrik (Mobile) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl rounded-b-none sm:rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Tambah Rubrik Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-xl">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <AddForm />
          </div>
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-900 text-sm font-bold">
          <i className="fa-solid fa-check mr-2"></i>{message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kelola Rubrik Kategori</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} rubrik aktif</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          <span className="hidden sm:inline">Tambah Rubrik</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Panduan */}
      <GuideBox title="💡 Cara Menggunakan Halaman Ini">
        <p>Klik tombol <strong>+ Tambah Rubrik</strong> untuk membuat kategori baru. Rubrik yang sudah ada bisa dihapus dengan tombol merah di kanan setiap item. <strong>Hati-hati:</strong> menghapus rubrik bisa memengaruhi berita yang terkategori di rubrik tersebut.</p>
      </GuideBox>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (Desktop only — di mobile pakai modal) */}
        <div className="hidden lg:block bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-base text-gray-900 mb-4 border-b pb-2">Tambah Rubrik Baru</h3>
          <AddForm />
        </div>

        {/* Daftar Rubrik */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Cari nama rubrik..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">
              <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat rubrik...
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-bold text-sm">
              {searchQuery ? `Tidak ada rubrik "${searchQuery}"` : 'Belum ada rubrik terdaftar.'}
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {paginated.map(cat => {
                  const globalIdx = categories.findIndex(c => c.id === cat.id);
                  const isFirst = globalIdx === 0;
                  const isLast = globalIdx === categories.length - 1;
                  return (
                    <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
                            Urutan: {cat.sort_order ?? 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono">/kategori/{cat.slug}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => moveUp(cat)}
                          disabled={isFirst || processing}
                          className="text-blue-700 hover:text-white hover:bg-blue-600 p-1.5 rounded border border-blue-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Naik"
                        >
                          <i className="fa-solid fa-arrow-up text-xs"></i>
                        </button>
                        <button
                          onClick={() => moveDown(cat)}
                          disabled={isLast || processing}
                          className="text-blue-700 hover:text-white hover:bg-blue-600 p-1.5 rounded border border-blue-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          title="Turun"
                        >
                          <i className="fa-solid fa-arrow-down text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-700 text-xs bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg border border-red-200 font-bold transition-colors shrink-0"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block max-h-[50vh] sm:max-h-[55vh] overflow-y-auto overflow-x-auto relative">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm border-b border-gray-200 text-xs uppercase text-gray-700 font-bold">
                    <tr>
                      <th className="px-6 py-1.5">Nama Rubrik</th>
                      <th className="px-6 py-1.5">Urutan</th>
                      <th className="px-6 py-1.5">Slug URL</th>
                      <th className="px-6 py-1.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map(cat => {
                      const globalIdx = categories.findIndex(c => c.id === cat.id);
                      const isFirst = globalIdx === 0;
                      const isLast = globalIdx === categories.length - 1;
                      return (
                        <tr key={cat.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-1.5 font-bold text-gray-900 text-sm">{cat.name}</td>
                          <td className="px-6 py-1.5 font-semibold text-gray-700 text-sm">
                            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200 text-xs font-mono">
                              {cat.sort_order ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-1.5 font-mono text-xs text-gray-500 text-sm">/kategori/{cat.slug}</td>
                          <td className="px-6 py-1.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => moveUp(cat)}
                                disabled={isFirst || processing}
                                className="text-blue-700 hover:text-white hover:bg-blue-600 p-1.5 rounded border border-blue-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                title="Naik"
                              >
                                <i className="fa-solid fa-arrow-up text-xs"></i>
                              </button>
                              <button
                                onClick={() => moveDown(cat)}
                                disabled={isLast || processing}
                                className="text-blue-700 hover:text-white hover:bg-blue-600 p-1.5 rounded border border-blue-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                title="Turun"
                              >
                                <i className="fa-solid fa-arrow-down text-xs"></i>
                              </button>
                              <button onClick={() => handleDelete(cat.id)}
                                className="text-red-700 text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg border border-red-200 font-bold transition-colors">
                                Hapus Rubrik
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
        onClose={() => setIsPinModalOpen(false)} 
        onSuccess={() => {
          setIsPinModalOpen(false);
          if (pinCallback) pinCallback();
        }}
      />
    </AdminLayout>
  );
}
