import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', status: 'Aktif' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
    setLoading(false);
  };

  const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleEdit = (cat) => {
    setEditItem(cat);
    setForm({ name: cat.name, slug: cat.slug, status: cat.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus rubrik ini?')) return;
    await supabase.from('categories').delete().eq('id', id);
    showFlash('Rubrik berhasil dihapus.');
    fetchCategories();
  };

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const slug = form.slug || slugify(form.name);
      if (editItem) {
        const { error } = await supabase.from('categories').update({ name: form.name, slug, status: form.status }).eq('id', editItem.id);
        if (error) throw error;
        showFlash('Rubrik berhasil diperbarui.');
      } else {
        const { error } = await supabase.from('categories').insert([{ name: form.name, slug, status: form.status }]);
        if (error) throw error;
        showFlash('Rubrik berhasil ditambahkan.');
      }
      setShowForm(false);
      setEditItem(null);
      setForm({ name: '', slug: '', status: 'Aktif' });
      fetchCategories();
    } catch (err) {
      showFlash('Error: ' + (err.message || 'Gagal menyimpan.'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Kelola Rubrik - PojokTV</title></Head>

      {flash && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">{flash}</div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Rubrik / Kategori</h1>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ name: '', slug: '', status: 'Aktif' }); }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-base shadow-sm transition-colors border border-red-700"
        >
          + Tambah Rubrik Baru
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-lg mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editItem ? 'Edit Rubrik' : 'Tambah Rubrik Baru'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Rubrik</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Contoh: Politik"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="contoh: politik"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={processing} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-60">
                {processing ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Tambah Rubrik')}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200">
                Batal
              </button>
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
                <th className="px-6 py-4">Nama Rubrik</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-bold">Belum ada rubrik.</td></tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">/kategori/{cat.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cat.status === 'Aktif' ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(cat)} className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-4 py-2 rounded-lg border border-blue-300 font-bold text-sm">Edit</button>
                        <button onClick={() => handleDelete(cat.id)} className="bg-red-50 hover:bg-red-100 text-red-900 px-4 py-2 rounded-lg border border-red-300 font-bold text-sm">Hapus</button>
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
