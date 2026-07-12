import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';

// Safely load ReactQuill client-side only
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function BeritaCreate() {
  const router = useRouter();
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

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
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Custom Quill Image Handler
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            const file = input.files[0];
            if (file) {
              try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_editor_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `berita/editor/${fileName}`;

                const { error: uploadError } = await supabase.storage
                  .from('images')
                  .upload(filePath, file);

                if (uploadError) throw new Error('Gagal upload gambar ke editor: ' + uploadError.message);

                const { data: { publicUrl } } = supabase.storage
                  .from('images')
                  .getPublicUrl(filePath);

                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, 'image', publicUrl);
              } catch (err) {
                alert(err.message);
              }
            }
          };
        }
      }
    }
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      let imageUrl = '';

      // 1. Upload image to Supabase Storage if file exists
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

      // 3. Get currently logged in user for author
      const { data: { session } } = await supabase.auth.getSession();
      const author = session?.user?.email?.split('@')[0] || 'Admin';

      // 4. Insert into 'berita' table
      const { error: insertError } = await supabase
        .from('berita')
        .insert([
          {
            title,
            slug,
            category,
            content,
            image: imageUrl,
            author,
            status: 'Published',
            views: 0
          }
        ]);

      if (insertError) throw insertError;

      router.push('/admin/berita');
    } catch (err) {
      setError(err.message || 'Gagal menyimpan berita.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Tulis Berita Baru - PojokTV</title>
      </Head>

      <div className="mb-6">
        <Link href="/admin/berita" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm inline-block">
          &larr; Kembali ke Daftar Berita
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Tulis Berita Baru</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm font-bold flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Judul Artikel Berita</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ketik judul berita di sini..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium" 
              required 
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Pilih Kategori Rubrik</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium" 
              required
            >
              <option value="">-- Silakan Pilih Rubrik --</option>
              {loadingCategories ? (
                <option disabled>Memuat rubrik...</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Gambar Utama Thumbnail Berita</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950" 
              required
            />
            <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik di sini untuk memasukkan gambar utama dari komputer Anda (format JPG/PNG/WebP, maksimal ukuran 2MB).</p>
            
            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-500 mb-1">Pratinjau Thumbnail Baru:</p>
                <img src={previewUrl} alt="Preview Thumbnail" className="w-full max-h-48 object-contain border rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita</label>
            {/* Rich Text Editor React Quill */}
            <div className="bg-white text-gray-950 rounded-lg border border-gray-300 overflow-hidden">
              <ReactQuill 
                ref={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Ketik isi berita lengkap di sini..."
                theme="snow"
                className="min-h-[300px] text-base"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={processing} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-base transition-colors shadow-sm mt-4 inline-block disabled:opacity-50 cursor-pointer"
          >
            {processing ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin mr-2"></i>Menyimpan...
              </>
            ) : 'Simpan dan Publikasikan Berita'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
