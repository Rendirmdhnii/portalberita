import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabaseClient';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export default function AdminPostCreate() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', content: '', status: 'Published' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    supabase.from('categories').select('*').eq('status', 'Aktif').order('name').then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

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
    if (!form.content) newErrors.content = 'Isi berita wajib diisi.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let imageUrl = null;

      // Upload image to Supabase Storage
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const fileName = `posts/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      const slug = slugify(form.title) + '-' + Date.now();

      const { error } = await supabase.from('posts').insert([{
        title: form.title,
        slug,
        category: form.category,
        content: form.content,
        image: imageUrl,
        author: user?.email?.split('@')[0] || 'Admin',
        status: form.status,
        views: 0,
      }]);

      if (error) throw error;
      router.push('/admin/posts');
    } catch (err) {
      setErrors({ general: err.message || 'Gagal menyimpan berita.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <Head><title>Tulis Berita Baru - PojokTV</title></Head>

      <div className="mb-6">
        <Link href="/admin/posts" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm inline-block">
          ← Kembali ke Daftar Berita
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Tulis Berita Baru</h2>

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
              placeholder="Ketik judul berita di sini..."
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
            <label className="block text-base font-bold text-gray-800 mb-1">Gambar Utama Thumbnail Berita</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950"
            />
            <p className="text-xs text-gray-700 mt-1">Format JPG/PNG/WebP, maksimal ukuran 2MB. Gambar akan diupload ke Supabase Storage.</p>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-40 object-cover rounded-lg border border-gray-200" />
            )}
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita</label>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              style={{ minHeight: '300px', marginBottom: '50px' }}
              placeholder="Ketik isi berita lengkap di sini..."
            />
            {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-base transition-colors shadow-sm mt-4 inline-block disabled:opacity-60"
          >
            {processing ? 'Menyimpan...' : 'Simpan dan Publikasikan Berita'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
