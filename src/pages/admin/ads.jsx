import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', position: 'Header', image: '', link: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchAds(); }, []);

  const fetchAds = async () => {
    setLoading(true);
    const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    setAds(data || []);
    setLoading(false);
  };

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleEdit = (ad) => {
    setEditItem(ad);
    setForm({ name: ad.name, position: ad.position, image: ad.image || '', link: ad.link || '', is_active: ad.is_active });
    setImagePreview(ad.image || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus iklan ini?')) return;
    await supabase.from('ads').delete().eq('id', id);
    showFlash('Iklan berhasil dihapus.');
    fetchAds();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      let imageUrl = form.image;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `ads/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      const payload = { name: form.name, position: form.position, image: imageUrl, link: form.link, is_active: form.is_active };

      if (editItem) {
        const { error } = await supabase.from('ads').update(payload).eq('id', editItem.id);
        if (error) throw error;
        showFlash('Iklan berhasil diperbarui.');
      } else {
        const { error } = await supabase.from('ads').insert([payload]);
        if (error) throw error;
        showFlash('Iklan berhasil ditambahkan.');
      }
      setShowForm(false); setEditItem(null); setImageFile(null); setImagePreview(null);
      setForm({ name: '', position: 'Header', image: '', link: '', is_active: true });
      fetchAds();
    } catch (err) {
      showFlash('Error: ' + (err.message || 'Gagal menyimpan.'));
    } finally {
      setProcessing(false);
    }
  };

  const POSITIONS = ['Header (728x90)', 'Sidebar Atas (300x250)', 'Sidebar Bawah (300x600)', 'Tengah Konten (728x90)', 'Footer (970x250)'];

  return (
    <AdminLayout>
      <Head><title>Kelola Iklan - PojokTV</title></Head>

      {flash && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">{flash}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Iklan</h1>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ name: '', position: 'Header', image: '', link: '', is_active: true }); setImagePreview(null); }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-base shadow-sm transition-colors"
        >
          + Tambah Iklan Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editItem ? 'Edit Iklan' : 'Tambah Iklan Baru'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Iklan</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="Contoh: Banner Atas Halaman Utama" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Posisi Penempatan</label>
              <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Gambar Iklan</label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="mb-2 h-24 object-contain border border-gray-200 rounded" />}
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">URL Tujuan Klik</label>
              <input type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 text-red-600 border-gray-300 rounded" />
              <label htmlFor="is_active" className="text-sm font-bold text-gray-700">Aktifkan Iklan Ini</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={processing} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-60">
                {processing ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Tambah Iklan')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200">Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Memuat data...</div>
        ) : (
          <table className="w-full text-left text-base">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-800 text-sm uppercase tracking-wide font-bold">
              <tr>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Nama Iklan</th>
                <th className="px-6 py-4">Posisi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ads.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-bold">Belum ada iklan terdaftar.</td></tr>
              ) : (
                ads.map(ad => (
                  <tr key={ad.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      {ad.image ? <img src={ad.image} alt={ad.name} className="h-12 w-24 object-contain rounded border border-gray-200" /> : <div className="h-12 w-24 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Tidak ada</div>}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{ad.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ad.position}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${ad.is_active ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                        {ad.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(ad)} className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-4 py-2 rounded-lg border border-blue-300 font-bold text-sm">Edit</button>
                        <button onClick={() => handleDelete(ad.id)} className="bg-red-50 hover:bg-red-100 text-red-900 px-4 py-2 rounded-lg border border-red-300 font-bold text-sm">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
