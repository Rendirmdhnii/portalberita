import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('id, title, author, category, status, views, created_at')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini secara permanen dari database?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) {
      setFlash('Berita berhasil dihapus.');
      fetchPosts();
      setTimeout(() => setFlash(''), 3000);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Kelola Berita Redaksi - PojokTV</title></Head>

      {flash && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
          {flash}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Berita Redaksi</h1>
        </div>
        <Link href="/admin/posts/create" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-base shadow-sm transition-colors border border-red-700 text-center">
          Tulis Berita Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-base text-gray-700">Gunakan tabel di bawah ini untuk melihat, mengubah, atau menghapus artikel berita yang telah ditulis.</p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-base">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-800 text-sm uppercase tracking-wide font-bold">
                <tr>
                  <th className="px-6 py-4 font-bold">Judul Berita</th>
                  <th className="px-6 py-4 font-bold">Rubrik</th>
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${post.status === 'Published' ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-orange-100 text-orange-900 border border-orange-300'}`}>
                          {post.status === 'Published' ? 'DIPUBLIKASI' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/posts/edit/${post.id}`}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-4 py-2 rounded-lg border border-blue-300 font-bold text-sm transition-colors"
                          >
                            Ubah / Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-900 px-4 py-2 rounded-lg border border-red-300 font-bold text-sm transition-colors"
                          >
                            Hapus Berita
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
