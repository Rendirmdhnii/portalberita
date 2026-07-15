import { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import AdminLayout from '@/layouts/AdminLayout';
import NewsGallery from '@/components/NewsGallery';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

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

export default function BeritaEdit() {
  const router = useRouter();
  const { id } = router.query;
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState(null);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Redaksi PojokTV');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Published');
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [existingGallery, setExistingGallery] = useState([]);
  
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [newThumbnailPreviewUrl, setNewThumbnailPreviewUrl] = useState('');
  
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviewUrls, setNewGalleryPreviewUrls] = useState([]);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isHeadline, setIsHeadline] = useState(false);
  
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
      setAuthor(data.author || 'Redaksi PojokTV');
      setCategory(data.category || '');
      setContent(data.content || '');
      setStatus(data.status || 'Published');
      setIsHeadline(data.is_headline || false);
      
      // Load images (jsonb) or fallback to image (text)
      const imgs = data.images || data.image;
      let allImgs = [];
      if (imgs) {
        if (Array.isArray(imgs)) {
          allImgs = imgs;
        } else if (typeof imgs === 'string') {
          try {
            if (imgs.startsWith('[')) {
              allImgs = JSON.parse(imgs);
            } else {
              allImgs = [imgs];
            }
          } catch (e) {
            allImgs = [imgs];
          }
        }
      }
      
      if (data.gambar_utama) {
        setExistingThumbnail(data.gambar_utama);
        setExistingGallery(allImgs.filter(img => img !== data.gambar_utama));
      } else if (allImgs.length > 0) {
        setExistingThumbnail(allImgs[0] || '');
        setExistingGallery(allImgs.slice(1) || []);
      } else {
        setExistingThumbnail('');
        setExistingGallery([]);
      }
    } catch (err) {
      setError('Gagal memuat berita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewThumbnailFile(file);
      setNewThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveNewThumbnail = () => {
    setNewThumbnailFile(null);
    setNewThumbnailPreviewUrl('');
  };

  const handleRemoveExistingThumbnail = () => {
    setExistingThumbnail('');
  };

  const handleGalleryChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewGalleryFiles(prev => [...prev, ...files]);
      setNewGalleryPreviewUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleRemoveExistingGalleryItem = (idxToRemove) => {
    setExistingGallery(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleRemoveNewGalleryItem = (idxToRemove) => {
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== idxToRemove));
    setNewGalleryPreviewUrls(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const previewImages = useMemo(() => {
    const list = [];
    if (newThumbnailPreviewUrl) {
      list.push(newThumbnailPreviewUrl);
    } else if (existingThumbnail) {
      list.push(existingThumbnail);
    }
    list.push(...existingGallery);
    list.push(...newGalleryPreviewUrls);
    return list;
  }, [existingThumbnail, existingGallery, newThumbnailPreviewUrl, newGalleryPreviewUrls]);

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
    },
    clipboard: {
      matchVisual: false, // Mencegah Quill menambahkan spasi kosong ekstra dari Word
    }
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    // Validasi minimal 1 foto utama
    if (!existingThumbnail && !newThumbnailFile) {
      setError('Harap pilih Foto Utama / Thumbnail (Wajib untuk Share WA).');
      setProcessing(false);
      return;
    }

    try {
      let finalThumbnailUrl = existingThumbnail;

      // 1. Upload new thumbnail if selected with compression
      if (newThumbnailFile) {
        const options = {
          maxSizeMB: 0.2, // Kompres agresif agar selalu di bawah limit WA
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: 'image/jpeg', // KONVERSI KE JPEG
          initialQuality: 0.8
        };
        
        try {
          const compressedFile = await imageCompression(newThumbnailFile, options);
          
          const fileExt = 'jpg';
          const fileName = `${Date.now()}_thumb_${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `berita/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, compressedFile, { contentType: 'image/jpeg' });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          finalThumbnailUrl = publicUrl;
        } catch (err) {
          alert('Gambar tidak bisa diproses, coba gambar lain: ' + err.message);
          setProcessing(false);
          return;
        }
      }

      if (!finalThumbnailUrl) {
        alert('Gambar tidak bisa diproses, coba gambar lain.');
        setProcessing(false);
        return;
      }

      let finalGalleryUrls = [...existingGallery];

      // 2. Upload new gallery files if any
      if (newGalleryFiles.length > 0) {
        for (const file of newGalleryFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `berita/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

          if (uploadError) throw new Error('Gagal mengunggah gambar pendukung baru: ' + uploadError.message);

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          finalGalleryUrls.push(publicUrl);
        }
      }

      const combinedImages = [finalThumbnailUrl, ...finalGalleryUrls];

      // 3. Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now();

      // 4. Update 'berita' table
      const { error: updateError } = await supabase
        .from('berita')
        .update({
          title,
          slug,
          category,
          content,
          images: combinedImages, // Simpan sebagai array jsonb
          gambar_utama: finalThumbnailUrl, // Simpan URL publik Foto Utama di kolom baru
          is_headline: isHeadline,
          author: author.trim() || 'Redaksi PojokTV',
          status
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/redaksi-portal/berita');
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
        <Link href="/redaksi-portal/berita" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg border border-gray-300 font-bold text-base transition-colors shadow-sm">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul Utama */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-1.5">Judul Utama Berita <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Tulis judul berita di sini..."
              className="w-full text-2xl font-bold p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 font-serif"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Link Tautan Berita: <span className="font-mono text-gray-400">otomatis dibuat setelah disimpan</span></p>
          </div>

          {/* Penulis / Jurnalis */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Siapa Penulis Berita ini? <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Tulis nama Anda di sini..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 font-medium text-base"
              required
            />
          </div>

          {/* Kategori Rubrik */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Berita ini masuk kategori apa? <span className="text-red-500">*</span></label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 font-medium bg-white"
              required
            >
              <option value="">-- Silakan Pilih Rubrik --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Foto Utama / Thumbnail */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1.5">Foto Utama / Thumbnail (Wajib untuk Share WA) <span className="text-red-500">*</span></label>
            
            {/* Existing Thumbnail */}
            {existingThumbnail && (
              <div className="mb-4 max-w-xs">
                <p className="text-xs text-gray-500 mb-2 font-bold">Foto Utama Saat Ini:</p>
                <div className="relative border rounded p-1 bg-gray-50 flex flex-col justify-between">
                  <img src={existingThumbnail} alt="Existing Thumbnail" className="w-full h-40 object-cover rounded" />
                  <button
                    type="button"
                    onClick={handleRemoveExistingThumbnail}
                    className="mt-1.5 bg-red-50 text-red-750 hover:bg-red-100 text-xs py-1 rounded border border-red-200 transition font-bold cursor-pointer"
                  >
                    Hapus Foto Utama
                  </button>
                </div>
              </div>
            )}

            {/* New Thumbnail Preview */}
            {newThumbnailPreviewUrl && (
              <div className="mb-4 max-w-xs">
                <p className="text-xs text-slate-500 mb-2 font-bold">Pratinjau Foto Utama Baru:</p>
                <div className="relative border rounded p-1 bg-gray-50 flex flex-col justify-between">
                  <img src={newThumbnailPreviewUrl} alt="New Thumbnail Preview" className="w-full h-40 object-cover rounded" />
                  <button
                    type="button"
                    onClick={handleRemoveNewThumbnail}
                    className="mt-1.5 bg-red-50 text-red-750 hover:bg-red-100 text-xs py-1 rounded border border-red-200 transition font-bold cursor-pointer"
                  >
                    Batal Pilih Baru
                  </button>
                </div>
              </div>
            )}

            {!existingThumbnail && !newThumbnailPreviewUrl && (
              <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-6 bg-gray-50 text-center transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <i className="fa-solid fa-image text-3xl text-gray-400 mb-2"></i>
                <p className="text-sm font-bold text-gray-700">Pilih Foto Utama Baru (Thumbnail)</p>
                <p className="text-xs text-gray-500 mt-1">Gambar ini akan digunakan sebagai cover berita dan preview link WhatsApp.</p>
              </div>
            )}
          </div>

          {/* Foto Pendukung / Galeri */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1.5">Foto Pendukung / Galeri (Opsional)</label>
            
            {/* Existing Gallery Images */}
            {existingGallery.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-bold">Foto Pendukung Saat Ini ({existingGallery.length}):</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {existingGallery.map((url, idx) => (
                    <div key={idx} className="relative border rounded p-1 bg-gray-50 flex flex-col justify-between">
                      <img src={url} alt={`Foto Pendukung ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGalleryItem(idx)}
                        className="mt-1.5 bg-red-50 text-red-750 hover:bg-red-100 text-xs py-1 rounded border border-red-200 transition font-bold cursor-pointer"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Gallery Previews */}
            {newGalleryPreviewUrls.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2 font-bold">Pratinjau Foto Pendukung Baru ({newGalleryPreviewUrls.length}):</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {newGalleryPreviewUrls.map((url, idx) => (
                    <div key={idx} className="relative border rounded p-1 bg-gray-50 flex flex-col justify-between">
                      <img src={url} alt={`Foto Pendukung Baru ${idx + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGalleryItem(idx)}
                        className="mt-1.5 bg-red-50 text-red-750 hover:bg-red-100 text-xs py-1 rounded border border-red-200 transition font-bold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-6 bg-gray-50 text-center transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <i className="fa-solid fa-images text-3xl text-gray-400 mb-2"></i>
              <p className="text-sm font-bold text-gray-700">Klik atau Ketuk di sini untuk memilih Foto Pendukung</p>
              <p className="text-xs text-gray-500 mt-1">Bisa pilih beberapa foto sekaligus untuk ditambahkan ke galeri slide.</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Pilih Status Berita</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950 font-medium bg-white"
            >
              <option value="Published">🟢 LANGSUNG TAYANG (Publikasikan)</option>
              <option value="Draft">🟡 SIMPAN DULU (Draft)</option>
            </select>
          </div>

          {/* Isi Berita */}
          <div>
            <label className="block text-base font-bold text-gray-800 mb-1">Ketik atau Tempel (Paste) Isi Berita di Sini 👇</label>
            <div className="bg-white text-gray-950 rounded-lg border border-gray-300 overflow-hidden prose prose-slate max-w-none font-sans text-base leading-relaxed">
              <ReactQuill 
                forwardedRef={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Ketik isi berita lengkap di sini..."
                theme="snow"
                style={{ minHeight: '400px' }}
                className="text-base"
              />
            </div>
            <p className="text-xs text-red-650 mt-2 font-bold flex items-center gap-1.5 bg-red-50 border border-red-200 p-2.5 rounded-lg">
              <i className="fa-solid fa-circle-info text-red-600 text-sm"></i>
              <span>Tips: Tekan Ctrl + Shift + V (di Windows) atau Cmd + Shift + V (di Mac) saat menempelkan teks agar spasi dan paragraf rapi sesuai bawaan Word/WhatsApp.</span>
            </p>
          </div>

          {/* Penempatan Berita di Halaman Depan */}
          <div className="mb-6 p-4 border rounded bg-gray-50">
            <label className="block text-gray-700 font-bold mb-2">Penempatan Berita di Halaman Depan *</label>
            <p className="text-sm text-gray-500 mb-4">Pilih di mana berita ini akan ditampilkan saat pembaca membuka website.</p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50 bg-white">
                <input type="radio" name="posisi" className="w-5 h-5 mr-3" checked={isHeadline === true} onChange={() => setIsHeadline(true)} />
                <div>
                  <span className="block font-bold text-blue-700">🌟 JADIKAN BERITA UTAMA (HEADLINE)</span>
                  <span className="text-sm text-gray-600">Gambar ukuran besar, teks judul menimpa gambar.</span>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50 bg-white">
                <input type="radio" name="posisi" className="w-5 h-5 mr-3" checked={isHeadline === false} onChange={() => setIsHeadline(false)} />
                <div>
                  <span className="block font-bold text-gray-700">📰 BERITA BIASA / FEED</span>
                  <span className="text-sm text-gray-600">Gambar ukuran standar, masuk ke daftar berita terbaru di bawah/samping.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Tombol Aksi Lalu Lintas */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={processing}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg disabled:opacity-50 cursor-pointer transition-colors"
            >
              {processing ? 'Menyimpan Perubahan...' : 'Simpan & Tayangkan'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="w-full md:w-auto px-6 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-100 shadow-sm transition-all cursor-pointer"
            >
              👀 Lihat Pratinjau
            </button>

            <Link
              href="/redaksi-portal/berita"
              className="w-full md:w-auto px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-lg shadow-sm transition-colors text-center inline-block"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>

      {/* Modal Pratinjau (Preview Modal) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 overflow-y-auto backdrop-blur-sm p-4 sm:p-6 md:p-8 flex justify-center">
          <div className="bg-gray-50 w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
            
            {/* Top Control Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Mode Pratinjau Berita (Simulasi Halaman Publik)</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Toggle Device Preview */}
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <i className="fa-solid fa-desktop mr-1.5"></i>Tampilan PC
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <i className="fa-solid fa-mobile-screen-button mr-1.5"></i>Tampilan HP
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>

            {/* Simulated Public Article Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className={
                previewDevice === 'mobile'
                  ? "w-[375px] h-[700px] border-[14px] border-gray-900 rounded-[3rem] mx-auto overflow-hidden relative shadow-2xl bg-white mt-4"
                  : "w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
              }>
                {/* Scroll Isolation wrapper inside phone frame */}
                <div className={previewDevice === 'mobile' ? "overflow-y-auto h-full p-4" : ""}>
                  
                  {/* Branding Simulation */}
                  <div className="bg-white py-4 border-b border-gray-200 rounded-t-xl px-4 flex justify-between items-center">
                    <span className="text-2xl font-black tracking-tighter text-slate-900">
                      Pojok<span className="text-red-600">TV.com</span>
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">SIMULASI</span>
                  </div>

                  <div className={
                    previewDevice === 'mobile'
                      ? "flex flex-col px-2 py-4"
                      : "grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6"
                  }>
                    
                    {/* Left Column: Article */}
                    <div className={previewDevice === 'mobile' ? "w-full" : "w-full min-w-0 lg:col-span-2"}>
                      <article className={
                        previewDevice === 'mobile'
                          ? "w-full bg-white min-w-0 overflow-hidden py-4 px-2"
                          : "max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden py-8 px-4 sm:px-6 lg:px-8"
                      }>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="bg-red-50 text-red-650 text-xs font-extrabold px-3 py-1 rounded border border-red-200 uppercase">
                            {category || 'Kategori'}
                          </span>
                          <span className="text-gray-300 text-sm">/</span>
                          <span className="text-gray-400 text-xs font-semibold">Detail Berita</span>
                        </div>

                        <h1 className={
                          previewDevice === 'mobile'
                            ? "text-lg font-serif font-black text-slate-900 leading-tight mb-3 break-words"
                            : "text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight mb-4"
                        }>
                          {title || 'Judul Berita Belum Diisi'}
                        </h1>

                        {/* Render combined images from state using NewsGallery */}
                        <NewsGallery images={previewImages} />

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-500 border-b border-gray-200 pb-4 mb-6">
                          <div className="flex items-center gap-1.5">
                            <i className="fa-regular fa-user text-red-600"></i>
                            <span>Oleh: <strong className="text-slate-800 font-semibold">{post?.author || 'Redaksi'}</strong></span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <i className="fa-regular fa-calendar text-red-600"></i>
                            <span>{post?.created_at ? new Date(post.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Senin, 13 Juli 2026'}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div 
                          className={
                            previewDevice === 'mobile'
                              ? "article-content berita-content prose prose-sm max-w-none font-sans text-gray-800 leading-relaxed break-words whitespace-pre-wrap w-full overflow-hidden [&_p]:mb-4"
                              : "article-content berita-content prose prose-lg max-w-none font-sans text-gray-800 leading-relaxed prose-serif-title w-full max-w-full overflow-hidden break-words whitespace-pre-wrap [&_p]:mb-6"
                          }
                          dangerouslySetInnerHTML={{ __html: content ? content.replace(/&nbsp;/g, ' ') : '<p class="text-gray-400 italic">Isi berita kosong. Silakan tulis di editor.</p>' }}
                        />
                      </article>
                    </div>

                    {/* Right Column: Sidebar (desktop only) */}
                    {previewDevice === 'desktop' && (
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
                    )}

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

