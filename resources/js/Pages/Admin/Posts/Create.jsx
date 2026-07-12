import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';

export default function PostCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '', category: '', content: '', image: null
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/posts');
    };

    return (
        <AdminLayout>
            <Head title="Tulis Berita Baru - PojokTV" />
            
            <div className="mb-6">
                <Link href="/admin/posts" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm inline-block">
                    &larr; Kembali ke Daftar Berita
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Tulis Berita Baru</h2>
                
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Judul Artikel Berita</label>
                        <input 
                            type="text" 
                            value={data.title} 
                            onChange={e => setData('title', e.target.value)} 
                            placeholder="Ketik judul berita di sini..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium" 
                            required 
                        />
                        <InputError message={errors.title} className="mt-1" />
                    </div>

                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Pilih Kategori Rubrik</label>
                        <select 
                            value={data.category} 
                            onChange={e => setData('category', e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium" 
                            required
                        >
                            <option value="">-- Silakan Pilih Rubrik --</option>
                            {categories && categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.category} className="mt-1" />
                    </div>

                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Gambar Utama Thumbnail Berita</label>
                        <input 
                            type="file" 
                            onChange={e => setData('image', e.target.files[0])} 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950" 
                        />
                        <InputError message={errors.image} className="mt-1" />
                        <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik di sini untuk memasukkan gambar utama dari komputer Anda (format JPG/PNG/WebP, maksimal ukuran 2MB).</p>
                    </div>

                    <div>
                        <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita</label>
                        <textarea 
                            value={data.content} 
                            onChange={e => setData('content', e.target.value)} 
                            rows="12" 
                            placeholder="Ketik isi berita lengkap di sini..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium leading-relaxed" 
                            required
                        ></textarea>
                        <InputError message={errors.content} className="mt-1" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-base transition-colors shadow-sm mt-4 inline-block"
                    >
                        Simpan dan Publikasikan Berita
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
