import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalViews: 0, totalBerita: 0, totalDraft: 0,
    totalVideo: 0, totalKategori: 0, totalIklan: 0,
  });
  const [beritaPopuler, setBeritaPopuler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { data: publishedPosts },
        { data: draftPosts },
        { data: videos },
        { data: categories },
        { data: ads },
        { data: popularPosts },
      ] = await Promise.all([
        supabase.from('posts').select('id, views').eq('status', 'Published'),
        supabase.from('posts').select('id').neq('status', 'Published'),
        supabase.from('videos').select('id'),
        supabase.from('categories').select('id'),
        supabase.from('ads').select('id').eq('is_active', true),
        supabase.from('posts').select('id, title, author, category, status, views').order('views', { ascending: false }).limit(5),
      ]);

      const totalViews = (publishedPosts || []).reduce((sum, p) => sum + (p.views || 0), 0);

      setStats({
        totalViews,
        totalBerita: (publishedPosts || []).length,
        totalDraft: (draftPosts || []).length,
        totalVideo: (videos || []).length,
        totalKategori: (categories || []).length,
        totalIklan: (ads || []).length,
      });
      setBeritaPopuler(popularPosts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Dashboard Admin - PojokTV</title></Head>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Ringkasan Statistik Website Redaksi</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Memuat data...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-blue-600">
              <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Total Pembaca (Views)</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{stats.totalViews.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-gray-600 mt-1">Total akumulasi pembaca berita aktif</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-green-600">
              <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Berita Dipublikasi</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{stats.totalBerita.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-gray-600 mt-1">Artikel tayang yang dibaca publik</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-yellow-500">
              <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Draft / Menunggu</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{stats.totalDraft.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-gray-600 mt-1">Artikel belum dipublikasikan</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-red-600">
              <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Total Video</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{stats.totalVideo.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-gray-600 mt-1">Video tayang dari YouTube Embed</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-purple-600">
              <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Total Rubrik</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{stats.totalKategori.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-gray-600 mt-1">Rubrik berita aktif yang tersedia</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-orange-500">
              <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Iklan Aktif</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{stats.totalIklan.toLocaleString('id-ID')}</h3>
              <p className="text-sm text-gray-600 mt-1">Kontrak iklan aktif yang sedang tayang</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h3 className="text-gray-900 text-base font-bold uppercase tracking-wide mb-4">Aksi Menu Cepat Redaksi</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/posts/create" className="text-base bg-blue-100 hover:bg-blue-200 text-blue-900 px-6 py-3 rounded-md font-bold transition-colors border border-blue-300 shadow-sm">Tulis Berita Baru</Link>
              <Link href="/admin/categories" className="text-base bg-green-100 hover:bg-green-200 text-green-900 px-6 py-3 rounded-md font-bold transition-colors border border-green-300 shadow-sm">Kelola Rubrik</Link>
              <Link href="/admin/ads" className="text-base bg-orange-100 hover:bg-orange-200 text-orange-900 px-6 py-3 rounded-md font-bold transition-colors border border-orange-300 shadow-sm">Kelola Iklan</Link>
              <Link href="/admin/videos" className="text-base bg-red-100 hover:bg-red-200 text-red-900 px-6 py-3 rounded-md font-bold transition-colors border border-red-300 shadow-sm">Kelola Video</Link>
            </div>
          </div>

          {/* Berita Terpopuler Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-950">Daftar Berita Terpopuler</h2>
                <p className="text-sm text-gray-700 mt-1">Daftar berita dengan pembaca (views) tertinggi di website publik.</p>
              </div>
              <Link href="/admin/posts" className="text-base text-blue-700 hover:text-blue-900 font-bold hover:underline">
                Lihat Semua Berita →
              </Link>
            </div>
            {beritaPopuler.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <p className="font-bold text-lg">Belum ada berita terpopuler</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-base">
                  <thead className="bg-gray-50 text-sm uppercase text-gray-800 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Peringkat</th>
                      <th className="px-6 py-4">Judul Berita</th>
                      <th className="px-6 py-4">Kategori Rubrik</th>
                      <th className="px-6 py-4">Status Tayang</th>
                      <th className="px-6 py-4 text-right">Jumlah Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {beritaPopuler.map((post, index) => (
                      <tr key={post.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-gray-950 font-bold">Peringkat {index + 1}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 line-clamp-2 max-w-sm">{post.title}</p>
                          <p className="text-sm text-gray-700 mt-1">Penulis: {post.author}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-900 text-xs px-3 py-1 rounded-full font-bold border border-gray-300">{post.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${post.status === 'Published' ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-orange-100 text-orange-900 border border-orange-300'}`}>
                            {post.status === 'Published' ? 'DIPUBLIKASI' : 'DRAFT'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-gray-950 text-lg">{(post.views || 0).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
