import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function BeritaEdit() {
  const router = useRouter();
  const { id } = router.query;

  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Published');
  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'Aktif')
        .order('name');
      
      if (catError) throw catError;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error: postError } = await supabase
        .from('berita')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;

      setPost(data);
      setTitle(data.title || '');
      setCategory(data.category || '');
      setContent(data.content || '');
      setStatus(data.status || 'Published');
      setExistingImage(data.image || '');
    } catch (err) {
      setError('Gagal memuat berita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      let imageUrl = existingImage;

      // 1. Upload new image to Supabase Storage if file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `berita/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error('Gagal mengunggah gambar: ' + uploadError.message);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 2. Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now();

      // 3. Update 'berita' table
      const { error: updateError } = await supabase
        .from('berita')
        .update({
          title,
          slug,
          category,
          content,
          image: imageUrl,
          status
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/admin/berita');
    } catch (err) {
      setError(err.message || 'Gagal mengubah berita.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-gray-400 font-bold">
          <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat detail berita...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Ubah Berita - PojokTV</title>
      </Head>

      <div className="mb-6">
        <Link href="/admin/berita" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
          &larr; Kembali ke Daftar Berita
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Ubah / Edit Berita</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-bold flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Judul Berita <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
              required
            />
          </div>

          {/* Rubrik */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Rubrik / Kategori <span className="text-red-500">*</span></label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
              required
            >
              <option value="">-- Pilih Rubrik --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Upload Gambar Baru</label>
            <p className="text-sm text-gray-700 mb-2 leading-relaxed">Klik di bawah untuk mengganti gambar. Biarkan kosong jika tidak ingin mengganti gambar saat ini.</p>
            {existingImage && (
              <div className="mb-3">
                <p className="text-sm text-gray-700 mb-1 font-bold">Gambar saat ini:</p>
                <img
                  src={existingImage}
                  alt="Thumbnail saat ini"
                  className="h-24 w-40 object-cover rounded-lg border border-gray-300 bg-gray-100"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Status Publikasi</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium"
            >
              <option value="Published">DIPUBLIKASI (TAYANG)</option>
              <option value="Draft">DRAFT (BELUM TAYANG)</option>
            </select>
          </div>

          {/* Isi Berita */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita <span className="text-red-500">*</span></label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows="12"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium resize-y leading-relaxed"
              required
            ></textarea>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-md text-base transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {processing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Berita'}
            </button>
            <Link
              href="/admin/berita"
              className="text-gray-800 hover:text-gray-950 hover:underline font-bold text-base bg-gray-100 border border-gray-300 px-6 py-3 rounded-md transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
