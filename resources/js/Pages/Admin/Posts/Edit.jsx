import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';

export default function PostEdit({ post, categories }) {
    const { data, setData, post: inertiaPost, processing, errors } = useForm({
        _method: 'PUT',
        title: post.title || '',
        category: post.category || '',
        content: post.content || '',
        image: null,
        status: post.status || 'Published',
    });

    const submit = (e) => {
        e.preventDefault();
        inertiaPost(`/admin/posts/${post.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Ubah Berita - PojokTV" />

            <div className="mb-6">
                <Link
                    href="/admin/posts"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm"
                >
                    &larr; Kembali ke Daftar Berita
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Ubah / Edit Berita</h2>

                <form onSubmit={submit} className="space-y-5">
                    {/* Judul */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Judul Berita <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                            required
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    {/* Rubrik */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Rubrik / Kategori <span className="text-red-500">*</span></label>
                        <select
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                        >
                            <option value="">-- Pilih Rubrik --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.category} className="mt-1" />
                    </div>

                    {/* Upload Gambar */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Upload Gambar Baru</label>
                        <p className="text-sm text-gray-750 mb-2 leading-relaxed">Klik di bawah untuk mengganti gambar. Biarkan kosong jika tidak ingin mengganti gambar saat ini.</p>
                        {post.image && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-700 mb-1 font-bold">Gambar saat ini:</p>
                                <img
                                    src={`/storage/${post.image}`}
                                    alt="Thumbnail saat ini"
                                    className="h-24 w-40 object-cover rounded-lg border border-gray-300 bg-gray-100"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('image', e.target.files[0])}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950"
                        />
                        <InputError message={errors.image} className="mt-1" />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Status Publikasi</label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                        >
                            <option value="Published">DIPUBLIKASI (TAYANG)</option>
                            <option value="Draft">DRAFT (BELUM TAYANG)</option>
                        </select>
                        <InputError message={errors.status} className="mt-1" />
                    </div>

                    {/* Isi Berita */}
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita <span className="text-red-500">*</span></label>
                        <textarea
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            rows="12"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium resize-y leading-relaxed"
                            required
                        ></textarea>
                        <InputError message={errors.content} className="mt-1" />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-md text-base transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {processing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Berita'}
                        </button>
                        <Link
                            href="/admin/posts"
                            className="text-gray-800 hover:text-gray-950 hover:underline font-bold text-base bg-gray-100 border border-gray-300 px-6 py-3 rounded-md transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
