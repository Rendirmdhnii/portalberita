import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';

export default function VideoIndex({ videos }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        judul: '',
        link: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/videos', {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus video ini dari Pojok Video?')) {
            router.delete(`/admin/videos/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pojok Video - PojokTV" />

            {/* Flash Message */}
            {flash?.message && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
                    {flash.message}
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Pojok Video</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah Video */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Tambah Video Baru</h3>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Judul Video</label>
                            <input
                                type="text"
                                value={data.judul}
                                onChange={e => setData('judul', e.target.value)}
                                placeholder="Cth: Detik-detik Pengesahan Pengurus DPC PKB"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                                required
                            />
                            <InputError message={errors.judul} className="mt-1" />
                        </div>

                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Link URL YouTube</label>
                            <input
                                type="text"
                                value={data.link}
                                onChange={e => setData('link', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                                required
                            />
                            <InputError message={errors.link} className="mt-1" />
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik di atas untuk menempelkan link video YouTube dari browser Anda.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan & Tayangkan Video'}
                        </button>
                    </form>
                </div>

                {/* Tabel Daftar Video */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-950 text-lg">Daftar Video Tayang</h3>
                        <p className="text-sm text-gray-700 mt-0.5">Terdapat {videos.length} video tayang di Pojok Video</p>
                    </div>

                    {videos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <p className="font-bold text-lg">Belum ada video tayang</p>
                            <p className="text-base mt-1">Tambahkan video YouTube pertama Anda di form sebelah kiri.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-base">
                                <thead className="bg-gray-50 text-sm uppercase text-gray-800 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Preview</th>
                                        <th className="px-6 py-4">Judul Video</th>
                                        <th className="px-6 py-4">YouTube ID</th>
                                        <th className="px-6 py-4 text-right">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {videos.map(video => (
                                        <tr key={video.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <img
                                                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                                    alt={video.judul}
                                                    className="h-12 w-24 object-cover rounded-md border border-gray-300 bg-gray-100"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">{video.judul}</td>
                                            <td className="px-6 py-4 font-mono text-sm text-gray-700">{video.youtube_id}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(video.id)}
                                                    className="text-red-700 hover:text-red-900 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-300 transition-colors"
                                                >
                                                    Hapus Video
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
