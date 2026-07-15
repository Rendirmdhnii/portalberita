import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

const ITEMS_PER_PAGE = 10;

// Collapsible Instructions Component
function GuideBox({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-blue-800 font-semibold text-sm hover:bg-blue-100 transition-colors"
      >
        <span>{title}</span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-xs transition-transform`}></i>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-blue-700 leading-relaxed border-t border-blue-200">
          {children}
        </div>
      )}
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 mt-0">
      <p className="text-sm text-gray-500">
        Halaman <span className="font-bold text-gray-900">{currentPage}</span> dari <span className="font-bold text-gray-900">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default function BeritaIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching berita:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (confirm('Yakin mau hapus berita ini? Tidak bisa dikembalikan lho!')) {
      try {
        const { error } = await supabase.from('berita').delete().eq('id', id);
        if (error) throw error;
        setMessage('✅ Mantap! Berita berhasil dihapus secara permanen.');
        fetchPosts();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menghapus berita: ' + err.message);
      }
    }
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / ITEMS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const statusBadge = (status) => status === 'Published'
    ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-150 text-green-800 border border-green-300">TAYANG</span>
    : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-850 border border-orange-350">DRAFT (BELUM TAYANG)</span>;

  return (
    <AdminLayout>
      <Head><title>Kelola Berita Redaksi - PojokTV</title></Head>

      {/* Flash Message */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-900 text-sm font-bold shadow-sm">
          <i className="fa-solid fa-circle-check mr-2 text-green-600 text-base"></i>{message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Daftar Berita Redaksi</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} artikel tersimpan</p>
        </div>
        <Link
          href="/redaksi-portal/berita/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Tulis Berita Baru</span>
        </Link>
      </div>

      {/* Panduan Pengguna */}
      <GuideBox title="💡 Cara Menggunakan Halaman Ini">
        <p>Gunakan <strong>kolom pencarian</strong> untuk menemukan berita berdasarkan judul, penulis, atau kategori. Klik <strong>Ubah/Edit</strong> untuk mengubah isi berita, atau <strong>Hapus</strong> untuk menghapus permanen dari database. Setiap halaman menampilkan 10 berita.</p>
      </GuideBox>

      {/* Search Bar */}
      <div className="relative mb-4">
        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          type="text"
          placeholder="Cari judul berita, penulis, atau kategori..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400 font-bold">
            <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat data berita...
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-bold">
            {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Belum ada berita terdaftar di database.'}
          </div>
        ) : (
          <>
            {/* === MOBILE CARD VIEW (tampil di HP, sembunyikan di desktop) === */}
            <div className="md:hidden divide-y divide-gray-100">
              {paginatedPosts.map(post => (
                <div key={post.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm line-clamp-2">{post.title}</p>
                      {post.is_headline && (
                        <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-yellow-300 shadow-sm">
                          🌟 BERITA UTAMA KOTAK BESAR
                        </span>
                      )}
                    </div>
                    {statusBadge(post.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold">{post.category}</span>
                    <span>· {post.author}</span>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href={`/redaksi-portal/berita/edit/${post.id}`}
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-lg font-bold text-xs shadow-sm transition-colors"
                    >
                      <i className="fa-solid fa-pen mr-1"></i>Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 rounded-lg font-bold text-xs shadow-md transition-colors"
                    >
                      <i className="fa-solid fa-trash mr-1"></i>Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* === DESKTOP TABLE VIEW (sembunyikan di HP) === */}
            <div className="overflow-x-auto w-full">
              <table className="hidden md:table w-full text-left border-collapse text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 text-xs uppercase tracking-wide font-bold">
                  <tr>
                    <th className="px-6 py-4 font-bold">Judul Berita</th>
                    <th className="px-6 py-4 font-bold">Rubrik</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPosts.map(post => (
                    <tr key={post.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-900 line-clamp-2 max-w-md">{post.title}</p>
                        {post.is_headline && (
                          <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-yellow-300 shadow-sm">
                            🌟 BERITA UTAMA KOTAK BESAR
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{post.author}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-gray-200">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">{statusBadge(post.status)}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end items-center">
                          <Link
                            href={`/redaksi-portal/berita/edit/${post.id}`}
                            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors mr-2"
                          >Edit</Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                          >Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
