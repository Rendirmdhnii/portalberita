import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function BeritaIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini secara permanen dari database?')) {
      try {
        const { error } = await supabase.from('berita').delete().eq('id', id);
        if (error) throw error;

        setMessage('Berita berhasil dihapus secara permanen.');
        fetchPosts();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menghapus berita: ' + err.message);
      }
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Berita Redaksi - PojokTV</title>
      </Head>

      {/* Flash Message */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
            &larr; Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Berita Redaksi</h1>
        </div>
        <Link href="/admin/berita/create" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-base shadow-sm transition-colors border border-red-700 text-center">
          Tulis Berita Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-base text-gray-700">Gunakan tabel di bawah ini untuk melihat, mengubah, atau menghapus artikel berita yang telah ditulis.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 font-bold">
            <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat data berita...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-base">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-800 text-sm uppercase tracking-wide font-bold">
                <tr>
                  <th className="px-6 py-4 font-bold">Judul Berita</th>
                  <th className="px-6 py-4 font-bold">Rubrik Kategori</th>
                  <th className="px-6 py-4 font-bold">Status Tayang</th>
                  <th className="px-6 py-4 text-right">Tindakan / Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-bold">
                      Belum ada berita terdaftar di database redaksi.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 line-clamp-2 max-w-md">{post.title}</p>
                        <p className="text-sm text-gray-700 mt-1">Ditulis oleh: {post.author}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-900 text-xs px-3 py-1 rounded-full font-bold border border-gray-300">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          post.status === 'Published'
                            ? 'bg-green-100 text-green-900 border border-green-300'
                            : 'bg-orange-100 text-orange-900 border border-orange-300'
                        }`}>
                          {post.status === 'Published' ? 'DIPUBLIKASI' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/berita/edit/${post.id}`}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-4 py-2 rounded-lg border border-blue-300 font-bold text-sm transition-colors"
                          >
                            Ubah / Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            type="button"
                            className="bg-red-50 hover:bg-red-100 text-red-900 px-4 py-2 rounded-lg border border-red-300 font-bold text-sm transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
