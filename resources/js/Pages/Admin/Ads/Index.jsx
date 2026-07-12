import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdIndex({ ads }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        position: 'Header',
        image: null,
        link: '',
        tanggal_berakhir: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/ads', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus iklan ini dari sistem?')) {
            router.delete(`/admin/ads/${id}`);
        }
    };

    const positionLabel = (pos) => {
        const labels = {
            'Header': 'Header (Atas - 728x90)',
            'Tengah Konten': 'Tengah Konten (In-Feed - 728x90)',
            'Sidebar Atas': 'Sidebar Atas (Kanan - 300x250)',
            'Sidebar Bawah': 'Sidebar Bawah (Kanan Panjang - 300x600)',
            'Footer': 'Footer (Bawah - 970x250)',
            'header': 'Header (Atas - 728x90)',
            'Header (728x90)': 'Header (Atas - 728x90)',
            'sidebar': 'Sidebar Atas (Kanan - 300x250)',
            'Sidebar (300x250)': 'Sidebar Atas (Kanan - 300x250)',
            'Footer (970x250)': 'Footer (Bawah - 970x250)'
        };
        return labels[pos] || pos;
    };

    return (
        <AdminLayout>
            <Head title="Kelola Iklan - PojokTV" />

            {/* Flash Message */}
            {flash?.message && (
                <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
                    {flash.message}
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Iklan Redaksi</h1>

            {/* Panduan Manajemen Tata Letak Iklan */}
            <div className="bg-yellow-50 border-2 border-yellow-300 p-6 mb-6 rounded-lg text-yellow-950">
                <h3 className="font-bold text-lg mb-2">Panduan Manajemen Tata Letak Iklan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base leading-relaxed">
                    <ul className="list-disc pl-5">
                        <li><strong>Header:</strong> Slot utama di bagian atas website redaksi.</li>
                        <li><strong>Tengah Konten:</strong> Iklan menyela di baris berita utama.</li>
                        <li><strong>Footer:</strong> Banner lebar di bagian paling bawah website.</li>
                    </ul>
                    <ul className="list-disc pl-5">
                        <li><strong>Sidebar Atas & Bawah:</strong> Tampil di kolom samping kanan beranda.</li>
                        <li className="font-bold text-red-700 mt-2">Pemberitahuan Kontrak: Hapus iklan secara manual apabila masa kontrak/tayang klien telah berakhir demi ketertiban administrasi.</li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Tambah Iklan */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">Tambah Iklan Baru</h3>

                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-900 text-base leading-relaxed font-bold">
                            {Object.values(errors).map((err, i) => <p key={i}>{err}</p>)}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Nama Iklan / Nama Klien</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Cth: DPRD Sidoarjo Ad Banner"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Posisi Pasang Iklan</label>
                            <select
                                value={data.position}
                                onChange={e => setData('position', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                            >
                                <option value="Header">Header (Atas - 728x90)</option>
                                <option value="Tengah Konten">Tengah Konten (In-Feed - 728x90)</option>
                                <option value="Sidebar Atas">Sidebar Atas (Kanan - 300x250)</option>
                                <option value="Sidebar Bawah">Sidebar Bawah (Kanan Panjang - 300x600)</option>
                                <option value="Footer">Footer (Bawah - 970x250)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Tautan Web Tujuan (Opsional)</label>
                            <input
                                type="url"
                                value={data.link}
                                onChange={e => setData('link', e.target.value)}
                                placeholder="https://dprd.sidoarjokab.go.id"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Tanggal Berakhir Kontrak (Opsional)</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                                value={data.tanggal_berakhir}
                                onChange={e => setData('tanggal_berakhir', e.target.value)}
                            />
                            <p className="text-sm text-gray-750 mt-1 leading-relaxed">*Klik di atas untuk memilih tanggal berakhir. Kosongkan jika iklan tayang permanen.</p>
                        </div>

                        <div>
                            <label className="block text-base font-bold text-gray-800 mb-1">Gambar Iklan Banner (Wajib)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setData('image', e.target.files[0])}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950"
                                required
                            />
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik di sini untuk memasukkan gambar JPG, PNG, GIF, atau WebP dari komputer Anda (maks. 2MB)</p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {processing ? 'Sedang Mengunggah...' : 'Upload & Pasang Iklan'}
                        </button>
                    </form>
                </div>

                {/* Tabel Daftar Iklan */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="font-bold text-gray-950 text-lg">Daftar Iklan Aktif</h3>
                        <p className="text-sm text-gray-700 mt-0.5">Terdapat {ads.length} iklan yang terdaftar di database</p>
                    </div>

                    {ads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                            <p className="font-bold text-lg">Belum ada iklan terdaftar</p>
                            <p className="text-base mt-1">Tambahkan iklan pertama Anda melalui form di sebelah kiri.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-base">
                                <thead className="bg-gray-50 text-sm uppercase text-gray-800 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Preview</th>
                                        <th className="px-6 py-4">Nama Iklan</th>
                                        <th className="px-6 py-4">Posisi</th>
                                        <th className="px-6 py-4">Link Tujuan</th>
                                        <th className="px-6 py-4">Status Kontrak</th>
                                        <th className="px-6 py-4">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {ads.map(ad => {
                                        const isExpired = ad.tanggal_berakhir && new Date(ad.tanggal_berakhir) < new Date(new Date().setHours(0,0,0,0));
                                        return (
                                            <tr key={ad.id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <img
                                                        src={`/storage/${ad.image}`}
                                                        alt={ad.name}
                                                        className="h-12 w-24 object-cover rounded-md border border-gray-300 bg-gray-100"
                                                        onError={e => { e.target.src = ''; e.target.className = 'h-12 w-24 bg-gray-200 rounded-md'; }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">{ad.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                                                        {positionLabel(ad.position)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {ad.link ? (
                                                        <a href={ad.link} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline text-sm font-bold truncate max-w-[120px] block">
                                                            {ad.link}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isExpired ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
                                                            EXPIRED
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-900 border border-green-300">
                                                            AKTIF
                                                        </span>
                                                    )}
                                                    {ad.tanggal_berakhir && (
                                                        <div className="text-sm text-gray-700 mt-1 font-bold">
                                                            Hingga: {ad.tanggal_berakhir}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDelete(ad.id)}
                                                        className="text-red-700 hover:text-red-900 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-300 transition-colors"
                                                    >
                                                        Hapus Iklan
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
