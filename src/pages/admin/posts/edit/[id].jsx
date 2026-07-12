import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function AdminPostEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', content: '', status: 'Published' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('categories').select('*').eq('status', 'Aktif').order('name'),
      supabase.from('posts').select('*').eq('id', id).single(),
    ]).then(([{ data: cats }, { data: post }]) => {
      setCategories(cats || []);
      if (post) {
        setForm({ title: post.title, category: post.category, content: post.content || '', status: post.status });
        if (post.image) setImagePreview(post.image.startsWith('http') ? post.image : `/storage/${post.image}`);
      }
      setLoading(false);
    });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.title) newErrors.title = 'Judul wajib diisi.';
    if (!form.category) newErrors.category = 'Kategori wajib dipilih.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setProcessing(true);
    try {
      let imageUrl = undefined;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `posts/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      const updateData = {
        title: form.title,
        category: form.category,
        content: form.content,
        status: form.status,
        ...(imageUrl ? { image: imageUrl } : {}),
      };

      const { error } = await supabase.from('posts').update(updateData).eq('id', id);
      if (error) throw error;
      router.push('/admin/posts');
    } catch (err) {
      setErrors({ general: err.message || 'Gagal menyimpan perubahan.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <AdminLayout><div className="py-20 text-center text-gray-400">Memuat data...</div></AdminLayout>;

  return (
    <AdminLayout>
      <Head><title>Edit Berita - PojokTV</title></Head>

      <div className="mb-6">
        <Link href="/admin/posts" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm inline-block">
          ← Kembali ke Daftar Berita
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Ubah / Edit Berita</h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Judul Artikel Berita</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
              required
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Pilih Kategori Rubrik</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
              required
            >
              <option value="">-- Silakan Pilih Rubrik --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
            >
              <option value="Published">Published (Terbit)</option>
              <option value="Draft">Draft (Simpan Dulu)</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Ganti Gambar Thumbnail</label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mb-2 h-40 object-cover rounded-lg border border-gray-200" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950"
            />
            <p className="text-xs text-gray-700 mt-1">Biarkan kosong jika tidak ingin mengganti gambar.</p>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita</label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              style={{ minHeight: '300px', marginBottom: '50px' }}
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-base transition-colors shadow-sm mt-4 inline-block disabled:opacity-60"
          >
            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
