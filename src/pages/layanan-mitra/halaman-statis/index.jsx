import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    const ForwardedReactQuill = ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    ForwardedReactQuill.displayName = 'ForwardedReactQuill';
    return ForwardedReactQuill;
  },
  { ssr: false }
);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean']
  ]
};

export default function HalamanStatisIndex() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [judul, setJudul] = useState('');
  const [konten, setKonten] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('halaman_statis')
        .select('*')
        .order('judul', { ascending: true });
      if (error) throw error;
      setPages(data || []);
    } catch (err) {
      console.error('Error fetching static pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page) => {
    setEditingPage(page);
    setJudul(page.judul);
    setKonten(page.konten || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!judul.trim()) return alert('Judul tidak boleh kosong.');
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('halaman_statis')
        .update({
          judul,
          konten,
          updated_at: new Date().toISOString()
        })
        .eq('slug', editingPage.slug);

      if (error) throw error;

      setMessage(`Halaman "${judul}" berhasil diperbarui.`);
      setEditingPage(null);
      fetchPages();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Gagal memperbarui halaman: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Halaman Statis - Panel Admin PojokTV.com</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Halaman Statis</h1>
            <p className="text-sm text-gray-500">Sesuaikan isi halaman legalitas dan profile publik PojokTV.</p>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>{message}</span>
          </div>
        )}

        {editingPage ? (
          /* EDIT FORM VIEW */
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-800">Ubah Halaman: <span className="text-blue-600 font-mono text-lg">{editingPage.slug}</span></h2>
              <button 
                type="button"
                onClick={() => setEditingPage(null)}
                className="text-gray-400 hover:text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">JUDUL HALAMAN *</label>
                <input 
                  type="text" 
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">KONTEN HALAMAN *</label>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
                  <ReactQuill 
                    value={konten}
                    onChange={setKonten}
                    modules={modules}
                    theme="snow"
                    style={{ minHeight: '350px' }}
                    className="text-base"
                    placeholder="Tulis konten halaman di sini..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  disabled={processing}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-55 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : 'Simpan & Perbarui'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500 font-medium flex flex-col items-center gap-3">
                <i className="fa-solid fa-spinner animate-spin text-2xl text-blue-600"></i>
                <span>Memuat data halaman...</span>
              </div>
            ) : pages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Tidak ada halaman statis yang ditemukan di database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-650">Judul</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-650">Slug / Routing</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-650">Terakhir Diubah</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-650 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {pages.map((page) => (
                      <tr key={page.slug} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{page.judul}</td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-sm">{page.slug}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {page.updated_at ? new Date(page.updated_at).toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEdit(page)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50/30 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-pen-to-square"></i> Edit Konten
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
