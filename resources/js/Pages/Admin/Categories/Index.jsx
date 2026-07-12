import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CategoryIndex({ categories }) {
    const { data, setData, post, processing, reset } = useForm({ name: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/categories', { onSuccess: () => reset() });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus rubrik berita ini? Semua berita di rubrik ini mungkin akan terpengaruh.')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Rubrik Kategori Berita - PojokTV" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Rubrik Kategori Berita</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah Rubrik */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Tambah Rubrik Baru</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Nama Rubrik Berita</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                placeholder="Cth: Politik, Sidoarjo, Ekonomi" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium" 
                                required 
                            />
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">Ketik nama rubrik di atas, kemudian klik tombol Simpan Rubrik.</p>
                        </div>
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base transition-colors shadow-sm"
                        >
                            Simpan Rubrik Baru
                        </button>
                    </form>
                </div>

                {/* Tabel Data Rubrik */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-950 text-lg">Daftar Rubrik Aktif</h3>
                        <p className="text-sm text-gray-700 mt-0.5">Terdapat {categories ? categories.length : 0} rubrik aktif</p>
                    </div>

                    <table className="w-full text-left text-base">
                        <thead className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-800 font-bold">
                            <tr>
                                <th className="px-6 py-4">Nama Rubrik</th>
                                <th className="px-6 py-4 text-right">Tindakan Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories && categories.length > 0 ? categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(cat.id)} 
                                            className="text-red-700 hover:text-red-900 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-300 transition-colors"
                                        >
                                            Hapus Rubrik
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-12 text-center text-gray-500 font-bold">
                                        Belum ada rubrik terdaftar
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
