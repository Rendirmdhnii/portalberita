import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats = {}, beritaPopuler = [] }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout>
            <Head title="Dashboard Admin - PojokTV" />

            {/* Flash message */}
            {flash?.message && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
                    {flash.message}
                </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Ringkasan Statistik Website Redaksi</h1>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Card Views */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-blue-600">
                    <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Total Pembaca (Views)</p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2">{(stats.totalViews || 0).toLocaleString('id-ID')}</h3>
                    <p className="text-sm text-gray-600 mt-1">Total akumulasi pembaca berita aktif</p>
                </div>

                {/* Card Berita Publish */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-green-600">
                    <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Berita Dipublikasi</p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2">{(stats.totalBerita || 0).toLocaleString('id-ID')}</h3>
                    <p className="text-sm text-gray-600 mt-1">Artikel tayang yang dibaca publik</p>
                </div>

                {/* Card Draft */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-yellow-500">
                    <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Draft / Menunggu</p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2">{(stats.totalDraft || 0).toLocaleString('id-ID')}</h3>
                    <p className="text-sm text-gray-600 mt-1">Artikel belum dipublikasikan</p>
                </div>

                {/* Card Video */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-red-600">
                    <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Total Video</p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2">{(stats.totalVideo || 0).toLocaleString('id-ID')}</h3>
                    <p className="text-sm text-gray-600 mt-1">Video tayang dari YouTube Embed</p>
                </div>

                {/* Card Kategori */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-purple-600">
                    <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Total Rubrik</p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2">{(stats.totalKategori || 0).toLocaleString('id-ID')}</h3>
                    <p className="text-sm text-gray-600 mt-1">Rubrik berita aktif yang tersedia</p>
                </div>

                {/* Card Iklan */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-100 border-l-8 border-l-orange-500">
                    <p className="text-base text-gray-700 font-bold uppercase tracking-wide">Iklan Aktif</p>
                    <h3 className="text-4xl font-black text-gray-900 mt-2">{(stats.totalIklan || 0).toLocaleString('id-ID')}</h3>
                    <p className="text-sm text-gray-600 mt-1">Kontrak iklan aktif yang sedang tayang</p>
                </div>
            </div>

            {/* Quick Action links */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-gray-900 text-base font-bold uppercase tracking-wide mb-4">Aksi Menu Cepat Redaksi</h3>
                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/posts/create" className="text-base bg-blue-100 hover:bg-blue-200 text-blue-900 px-6 py-3 rounded-md font-bold transition-colors border border-blue-300 shadow-sm">
                        Tulis Berita Baru
                    </Link>
                    <Link href="/admin/categories" className="text-base bg-green-100 hover:bg-green-200 text-green-900 px-6 py-3 rounded-md font-bold transition-colors border border-green-300 shadow-sm">
                        Kelola Rubrik
                    </Link>
                    <Link href="/admin/ads" className="text-base bg-orange-100 hover:bg-orange-200 text-orange-900 px-6 py-3 rounded-md font-bold transition-colors border border-orange-300 shadow-sm">
                        Kelola Iklan
                    </Link>
                    <Link href="/admin/videos" className="text-base bg-red-100 hover:bg-red-200 text-red-900 px-6 py-3 rounded-md font-bold transition-colors border border-red-300 shadow-sm">
                        Kelola Video
                    </Link>
                </div>
            </div>

            {/* Top Posts Table */}
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

                {!beritaPopuler || beritaPopuler.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <p className="font-bold text-lg">Belum ada berita terpopuler</p>
                        <p className="text-base mt-1">Mulai buat berita baru untuk mengumpulkan statistik pembaca.</p>
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
                                        <td className="px-6 py-4 text-right font-black text-gray-950 text-lg">
                                            {(post.views || 0).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
