import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function CategoryIndex() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    setProcessing(true);

    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const { error } = await supabase
        .from('categories')
        .insert([{ name, slug, status: 'Aktif' }]);

      if (error) throw error;

      setName('');
      setMessage('Rubrik baru berhasil ditambahkan.');
      fetchCategories();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Gagal menambahkan rubrik: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus rubrik berita ini? Semua berita di rubrik ini mungkin akan terpengaruh.')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setMessage('Rubrik berhasil dihapus.');
        fetchCategories();
        setTimeout(() => setMessage(''), 4000);
      } catch (err) {
        alert('Gagal menghapus rubrik: ' + err.message);
      }
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Rubrik Kategori Berita - PojokTV</title>
      </Head>

      {message && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg text-green-900 text-base font-bold">
          {message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kelola Rubrik Kategori Berita</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Rubrik */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Tambah Rubrik Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-1">Nama Rubrik Berita</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Cth: Politik, Sidoarjo, Ekonomi" 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium" 
                required 
              />
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">Ketik nama rubrik di atas, kemudian klik tombol Simpan Rubrik.</p>
            </div>
            <button 
              type="submit" 
              disabled={processing} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md text-base transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : 'Simpan Rubrik Baru'}
            </button>
          </form>
        </div>

        {/* Tabel Data Rubrik */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-950 text-lg">Daftar Rubrik Aktif</h3>
            <p className="text-sm text-gray-700 mt-0.5">Terdapat {categories.length} rubrik aktif</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold">
              <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat rubrik...
            </div>
          ) : (
            <table className="w-full text-left text-base">
              <thead className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-800 font-bold">
                <tr>
                  <th className="px-6 py-4">Nama Rubrik</th>
                  <th className="px-6 py-4 text-right">Tindakan Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.length > 0 ? categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(cat.id)} 
                        className="text-red-700 hover:text-red-900 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-300 transition-colors cursor-pointer"
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
