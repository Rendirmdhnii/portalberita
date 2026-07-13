import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';
import NewsGallery from '@/components/NewsGallery';
import { supabase } from '@/lib/supabase';

// Safely load ReactQuill client-side only
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    const ForwardedReactQuill = ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    ForwardedReactQuill.displayName = 'ForwardedReactQuill';
    return ForwardedReactQuill;
  },
  { 
    ssr: false, 
    loading: () => <p className="text-gray-500 font-bold p-4">Memuat editor teks...</p> 
  }
);
import 'react-quill-new/dist/quill.snow.css';

export default function BeritaCreate() {
  const router = useRouter();
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Redaksi PojokTV');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      setPreviewUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleRemovePreview = (index) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== index));
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== index));
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
        image: function() {
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

                const quill = this.quill;
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

    // Validasi minimal 1 foto
    if (imageFiles.length === 0) {
      setError('Harap pilih minimal satu gambar berita.');
      setProcessing(false);
      return;
    }

    try {
      let imageUrls = [];

      // 1. Upload images to Supabase Storage
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `berita/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw new Error('Gagal mengunggah gambar: ' + uploadError.message);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrl);
      }

      // 2. Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now();

      // 3. Keep the user-inputted author (use fallback if empty)
      const finalAuthor = author.trim() || 'Redaksi PojokTV';

      // 4. Insert into 'berita' table
      const { error: insertError } = await supabase
        .from('berita')
        .insert([
          {
            title,
            slug,
            category,
            content,
            images: imageUrls, // Simpan sebagai array jsonb
            author: finalAuthor,
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-serif font-bold text-2xl md:text-3xl" 
              required 
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Nama Penulis / Reporter</label>
            <input 
              type="text" 
              value={author} 
              onChange={e => setAuthor(e.target.value)} 
              placeholder="Ketik nama penulis atau reporter..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-950 font-medium text-base" 
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
            <label className="block text-base font-bold text-gray-800 mb-1">Gambar / Foto Berita (Bisa pilih lebih dari satu)</label>
             <input 
              type="file" 
              accept="image/*"
              multiple
              onChange={handleImageChange} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none text-gray-950" 
            />
            <p className="text-xs text-gray-700 mt-1 leading-relaxed">Klik untuk memilih satu atau beberapa foto dari komputer Anda (format JPG/PNG/WebP, maksimal ukuran 2MB per file).</p>
            
            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-500 mb-2">Pratinjau Gambar Terpilih ({previewUrls.length}):</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative border rounded p-1 bg-gray-50 flex flex-col justify-between">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemovePreview(index)}
                        className="mt-1 bg-red-50 text-red-700 hover:bg-red-100 text-[10px] py-1 rounded border border-red-200 transition font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Isi Lengkap Berita</label>
            {/* Rich Text Editor React Quill */}
            <div className="bg-white text-gray-950 rounded-lg border border-gray-300 overflow-hidden prose prose-slate max-w-none font-sans text-base leading-relaxed">
              <ReactQuill 
                forwardedRef={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Ketik isi berita lengkap di sini..."
                theme="snow"
                className="min-h-[300px] text-base"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <button 
              type="submit" 
              disabled={processing} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-base transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {processing ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin mr-2"></i>Menyimpan...
                </>
              ) : 'Simpan dan Publikasikan Berita'}
            </button>

            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md text-base transition-colors shadow-sm cursor-pointer"
            >
              <i className="fa-solid fa-eye mr-2"></i>Pratinjau
            </button>
          </div>
        </form>
      </div>

      {/* Modal Pratinjau (Preview Modal) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 overflow-y-auto backdrop-blur-sm p-4 sm:p-6 md:p-8 flex justify-center">
          <div className="bg-gray-50 w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
            
            {/* Top Control Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Mode Pratinjau Berita (Simulasi Halaman Publik)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>

            {/* Simulated Public Article Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="max-w-5xl mx-auto">
                
                {/* Branding Simulation */}
                <div className="bg-white py-4 border-b border-gray-200 rounded-t-xl px-4 flex justify-between items-center">
                  <span className="text-2xl font-black tracking-tighter text-slate-900">
                    Pojok<span className="text-red-600">TV.com</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">SIMULASI</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
                  
                  {/* Left Column: Article */}
                  <div className="w-full min-w-0 lg:col-span-2">
                    <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-red-50 text-red-600 text-xs font-extrabold px-3 py-1 rounded border border-red-200 uppercase">
                          {category || 'Kategori'}
                        </span>
                        <span className="text-gray-300 text-sm">/</span>
                        <span className="text-gray-400 text-xs font-semibold">Detail Berita</span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight mb-4">
                        {title || 'Judul Berita Belum Diisi'}
                      </h1>

                      {/* Render images from state using NewsGallery */}
                      <NewsGallery images={previewUrls} />

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-500 border-b border-gray-200 pb-4 mb-6">
                        <div className="flex items-center gap-1.5">
                          <i className="fa-regular fa-user text-red-600"></i>
                          <span>Oleh: <strong className="text-slate-800 font-semibold">Redaktur</strong></span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1.5">
                          <i className="fa-regular fa-calendar text-red-600"></i>
                          <span>Senin, 13 Juli 2026</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div 
                        className="article-content berita-content prose prose-slate md:prose-lg max-w-none font-sans text-gray-800 leading-relaxed prose-serif-title w-full max-w-full overflow-hidden break-words whitespace-normal [&_p]:mb-6"
                        dangerouslySetInnerHTML={{ __html: content || '<p className="text-gray-400 italic">Isi berita kosong. Silakan tulis di editor.</p>' }}
                      />
                    </article>
                  </div>

                  {/* Right Column: Sidebar */}
                  <div className="w-full lg:col-span-1">
                    <div className="flex flex-col gap-6">
                      <div className="bg-slate-200 border border-slate-300 rounded-lg flex flex-col justify-center items-center text-center p-4 text-slate-500 font-sans select-none w-full h-[250px]">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Advertisement</span>
                        <span className="text-xs font-bold uppercase text-slate-500">PojokTV Ad Network</span>
                        <span className="text-[10px] text-slate-400 mt-1">Slot Iklan (300x250)</span>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <h3 className="text-sm font-black uppercase text-slate-900 border-b border-gray-200 pb-2 mb-4 tracking-wide">
                          <i className="fa-solid fa-fire text-red-500 mr-1.5"></i> Berita Populer (Simulasi)
                        </h3>
                        <div className="flex flex-col divide-y divide-gray-100 text-xs gap-3">
                          <div className="py-2">
                            <span className="font-bold text-red-600">1. </span>
                            <span className="font-semibold text-slate-800">Contoh Berita Populer Pertama PojokTV</span>
                          </div>
                          <div className="py-2">
                            <span className="font-bold text-red-600">2. </span>
                            <span className="font-semibold text-slate-800">Sidoarjo Siaga Satu Pasca Banjir Bandang</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

