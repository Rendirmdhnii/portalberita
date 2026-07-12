import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function AdIndex() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [position, setPosition] = useState('Header');
  const [link, setLink] = useState('');
  const [tanggalBerakhir, setTanggalBerakhir] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error: fetchErr } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setAds(data || []);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Pilih berkas gambar iklan terlebih dahulu!');
      return;
    }
    setProcessing(true);
    setError('');

    try {
      // 1. Upload to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) throw new Error('Gagal mengunggah gambar: ' + uploadError.message);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 2. Insert to Supabase ads table
      const { error: insertError } = await supabase
        .from('ads')
        .insert([
          {
            name,
            position,
            image: publicUrl,
            link: link || '-',
            is_active: true
          }
        ]);

      if (insertError) throw insertError;

      // Reset Form
      setName('');
      setPosition('Header');
      setLink('');
      setTanggalBerakhir('');
      setImageFile(null);
      
      // Reset input element value
      const fileInput = document.getElementById('ad-image-input');
      if (fileInput) fileInput.value = '';

      setMessage('Iklan berhasil ditambahkan dan ditayangkan.');
      fetchAds();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Gagal menambahkan iklan.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus iklan ini dari sistem?')) {
      try {
        const { error: deleteErr } = await supabase
          .from('ads')
          .delete()
          .eq('id', id);

        if (deleteErr) throw deleteErr;

        setMessage('Iklan berhasil dihapus.');
        fetchAds();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menghapus iklan: ' + err.message);
      }
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
      <Head>
        <title>Kelola Iklan - PojokTV</title>
      </Head>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-900 text-base font-bold">
          {error}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Kontrak Pemasangan Iklan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Iklan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Pasang Iklan Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Nama Iklan / Klien</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Cth: Iklan Banner Pemkab Sidoarjo"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Pilih Posisi Iklan</label>
              <select
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
                required
              >
                <option value="Header">Header (Atas - 728x90)</option>
                <option value="Tengah Konten">Tengah Konten (In-Feed - 728x90)</option>
                <option value="Sidebar Atas">Sidebar Atas (Kanan - 300x250)</option>
                <option value="Sidebar Bawah">Sidebar Bawah (Kanan Panjang - 300x600)</option>
                <option value="Footer">Footer (Bawah - 970x250)</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Tautan / Link Tujuan (Opsional)</label>
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://tautan-iklan.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Tanggal Berakhir Kontrak (Opsional)</label>
              <input
                type="date"
                value={tanggalBerakhir}
                onChange={e => setTanggalBerakhir(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-slate-700 font-medium"
              />
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">*Kosongkan jika iklan tayang permanen.</p>
            </div>

            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Gambar Iklan Banner (Wajib)</label>
              <input
                id="ad-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950"
                required
              />
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">Format JPG, PNG, GIF, atau WebP (maks. 2MB)</p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
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

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">
              <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat iklan...
            </div>
          ) : ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <p className="font-bold text-lg">Belum ada iklan terdaftar</p>
              <p className="text-sm mt-1">Tambahkan iklan pertama Anda melalui form di sebelah kiri.</p>
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
                    <th className="px-6 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ads.map(ad => (
                    <tr key={ad.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={ad.image}
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
                        {ad.link && ad.link !== '-' ? (
                          <a href={ad.link} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900 hover:underline text-sm font-bold truncate max-w-[120px] block">
                            {ad.link}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-700 hover:text-red-900 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-300 transition-colors cursor-pointer"
                        >
                          Hapus
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
