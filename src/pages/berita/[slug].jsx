import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import EmptyState from '@/components/EmptyState';
import NewsGallery from '@/components/NewsGallery';
import BreakingNews from '@/components/BreakingNews';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function DetailBerita() {
  const router = useRouter();
  const { slug } = router.query;

  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic States from Supabase
  const [categories, setCategories] = useState([]);
  const [berita, setBerita] = useState(null);
  const [latestBerita, setLatestBerita] = useState([]);
  const [popularBerita, setPopularBerita] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (berita) {
      const imgs = berita.images || berita.image;
      if (imgs) {
        if (Array.isArray(imgs)) {
          setImages(imgs);
        } else if (typeof imgs === 'string') {
          try {
            if (imgs.startsWith('[')) {
              setImages(JSON.parse(imgs));
            } else {
              setImages([imgs]);
            }
          } catch (e) {
            setImages([imgs]);
          }
        } else {
          setImages([imgs]);
        }
      } else {
        setImages([]);
      }
    } else {
      setImages([]);
    }
  }, [berita]);

  useEffect(() => {
    // Realtime Clock
    const updateDateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} WIB`);

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };
    const timer = setInterval(updateDateTime, 1000);
    updateDateTime();
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    if (!slug) return;
    try {
      setLoading(true);

      // 1. Fetch categories
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'Aktif')
        .order('name');
      setCategories(catData || []);

      // 2. Fetch ads
      const { data: adsData } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true);
      setAds(adsData || []);

      // 3. Fetch latest news for ticker
      const { data: latestNews } = await supabase
        .from('berita')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(5);
      setLatestBerita(latestNews || []);

      // 4. Fetch popular news for sidebar
      const { data: popularNews } = await supabase
        .from('berita')
        .select('*')
        .eq('status', 'Published')
        .order('views', { ascending: false })
        .limit(5);
      setPopularBerita(popularNews || []);

      // 5. Fetch main article by slug (with fallback to ID)
      const { data: mainBerita } = await supabase
        .from('berita')
        .select('*')
        .eq('slug', slug)
        .single();

      if (mainBerita) {
        setBerita(mainBerita);
        // Increment views
        await supabase
          .from('berita')
          .update({ views: (mainBerita.views || 0) + 1 })
          .eq('id', mainBerita.id);
      } else {
        // Fallback: try parsing ID from slug end
        const idVal = parseInt(slug.split('-').pop());
        if (!isNaN(idVal)) {
          const { data: idBerita } = await supabase
            .from('berita')
            .select('*')
            .eq('id', idVal)
            .single();

          if (idBerita) {
            setBerita(idBerita);
            // Increment views
            await supabase
              .from('berita')
              .update({ views: (idBerita.views || 0) + 1 })
              .eq('id', idBerita.id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching berita details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'Baru Saja';
    if (diffMin < 60) return `${diffMin} Menit Lalu`;
    if (diffHrs < 24) return `${diffHrs} Jam Lalu`;
    return `${diffDays} Hari Lalu`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const wib = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ' WIB';
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} | ${wib}`;
  };

  const handleLiveTv = () => {
    alert("🔴 Menghubungkan ke Siaran Live Streaming PojokTV... (Siaran Berjalan Lancar)");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      alert(`Pencarian untuk: "${searchQuery}" (Simulasi Halaman Hasil Pencarian)`);
      setSearchQuery('');
    }
  };

  const headerAd = ads?.find(a => a.position === 'Header' || a.position === 'header');
  const sidebarTopAd = ads?.find(a => a.position === 'Sidebar Atas' || a.position === 'sidebar');
  const sidebarBottomAd = ads?.find(a => a.position === 'Sidebar Bawah');
  const footerAd = ads?.find(a => a.position === 'Footer');

  return (
    <div className="w-full bg-gray-50 min-h-screen text-slate-800 font-sans overflow-x-hidden">
      <Head>
        <title>{berita ? `${berita.title || berita.judul} - PojokTV.com` : 'Memuat Berita... - PojokTV.com'}</title>
        <meta name="description" content={berita ? (berita.content || berita.isi || '').replace(/<[^>]*>/g, '').slice(0, 160) : 'Portal Berita Terpercaya'} />
        <meta name="keywords" content={berita ? `${berita.category}, berita ${berita.category}, ${berita.title || berita.judul}, PojokTV` : 'berita terkini, berita hari ini, pojoktv'} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {/* Baris 1: Top Bar */}
      <div className="top-bar bg-slate-950 text-slate-300 py-2 border-b border-slate-800">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          {/* Left: Clock & Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <i className="fa-regular fa-clock text-red-500"></i>
            <span>{currentDate} | {currentTime}</span>
          </div>

          {/* Right: Trending & Socials */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {categories.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="font-bold text-red-500 uppercase tracking-wider text-[10px]">🔴 Trending:</span>
                <div className="flex items-center gap-2.5 text-slate-400">
                  {categories.slice(0, 4).map(cat => (
                    <Link key={cat.id} href={`/kategori/${cat.slug}`} className="hover:text-red-500 transition-colors">
                      #{cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Baris 2: Main Branding */}
      <div className="bg-white py-5 border-b border-gray-100">
        <div className="container mx-auto px-4 flex justify-center md:justify-start">
          <Link href="/" className="logo text-4xl font-black tracking-tighter leading-none shrink-0">
            Pojok<span className="text-red-600">TV.com</span>
          </Link>
        </div>
      </div>

      {/* Baris 3: Navigation, Search, & Live TV */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 py-2">
          {/* Left: Scrollable Rubrik Menu */}
          <nav className="overflow-x-auto whitespace-nowrap scrollbar-none flex-1 max-w-full">
            <ul className="flex items-center gap-6 text-sm font-bold text-slate-700 uppercase py-1">
              <li>
                <Link href="/" className="hover:text-red-650 transition-colors pb-1">
                  Berita Utama
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/kategori/${cat.slug}`} className="hover:text-red-650 transition-colors pb-1">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <form onSubmit={handleSearch} className="search-box relative hidden sm:flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden px-2.5 py-1">
              <input
                type="text"
                className="bg-transparent text-xs text-slate-800 outline-none w-36 focus:w-48 transition-all"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="text-slate-400 hover:text-red-600 ml-1 text-xs">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            <button 
              className="flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white text-xs font-black rounded-full hover:bg-red-750 transition shadow-sm cursor-pointer" 
              onClick={handleLiveTv}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>LIVE TV</span>
            </button>

            {/* Mobile search toggle */}
            <button 
              className="block sm:hidden text-slate-700 hover:text-red-600 p-1 text-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        {isMobileMenuOpen && (
          <div className="bg-slate-50 border-t border-gray-200 px-4 py-2 block sm:hidden">
            <form onSubmit={handleSearch} className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden px-3 py-1.5">
              <input
                type="text"
                className="bg-transparent text-sm text-slate-800 outline-none w-full"
                placeholder="Ketik kata kunci pencarian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="text-slate-400 hover:text-red-600 ml-1">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        )}
      </div>
      <BreakingNews />

      {/* Header Ad Slot */}
      {headerAd && headerAd.image && (
        <div className="w-full max-w-7xl mx-auto my-4 px-2 md:px-4 flex justify-center overflow-hidden">
          <AdSlot 
            size="970x90" 
            className="w-full" 
            ad={headerAd} 
          />
        </div>
      )}

      {/* Content Wrapper */}
      <main className="w-full my-6 md:my-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          {/* Mobile-first: 1 kolom di HP, 12 kolom di desktop (8 kolom artikel, 4 kolom sidebar) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* === KONTEN UTAMA (Full width di HP, 8/12 di desktop) === */}
            <div className="w-full min-w-0 md:col-span-8">
              {loading ? (
                <div className="text-center py-20 text-gray-400 font-bold">
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat detail berita...
                </div>
              ) : !berita ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex flex-col items-center gap-4">
                    <i className="fa-solid fa-newspaper text-4xl text-gray-300"></i>
                    <p className="text-gray-500 font-bold text-lg">Berita tidak ditemukan</p>
                    <Link href="/" className="bg-red-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-red-700 transition font-bold">
                      Kembali ke Beranda
                    </Link>
                  </div>
                </div>
              ) : (
                <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden py-8 px-4 sm:px-6 lg:px-8">

                  {/* Category Badge & Breadcrumbs */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Link href={`/kategori/${berita.category?.toLowerCase().replace(/\s+/g, '-')}`}>
                      <span className="bg-red-50 text-red-600 text-xs font-extrabold px-3 py-1 rounded border border-red-200 uppercase hover:bg-red-100 transition cursor-pointer">
                        {berita.category}
                      </span>
                    </Link>
                    <span className="text-gray-300 text-sm">/</span>
                    <span className="text-gray-400 text-xs font-semibold truncate">Detail Berita</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight mb-4">
                    {berita.title || berita.judul}
                  </h1>

                  {/* News Gallery Slider (only if images exist) */}
                  <NewsGallery images={images} />

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 border-b border-gray-200 pb-4 mb-6">
                    <span>Oleh: <strong className="text-gray-700 font-semibold">{berita.author || 'Redaksi PojokTV'}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>{formatDate(berita.created_at)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{berita.views || 0} kali dibaca</span>
                  </div>

                  {/* ===== ISI ARTIKEL ===== */}
                  {/* Catatan: prose class dari @tailwindcss/typography bisa diaktifkan jika plugin sudah di-install */}
                  {/* Saat ini menggunakan arbitrary selectors yang sudah dioptimasi untuk mobile */}
                  <div
                    className="
                      article-content berita-content
                      prose prose-lg max-w-none font-sans text-gray-800 leading-relaxed prose-serif-title
                      w-full max-w-full overflow-hidden
                      break-words whitespace-pre-wrap
                      [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-slate-900 [&_h2]:leading-tight [&_h2]:break-words
                      [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-slate-900 [&_h3]:break-words
                      [&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-slate-900
                      [&_p]:mb-6 [&_p]:leading-[1.85] [&_p]:break-words [&_p]:whitespace-pre-wrap [&_p]:max-w-full
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-5 [&_ol]:space-y-1
                      [&_li]:leading-relaxed [&_li]:break-words
                      [&_blockquote]:border-l-4 [&_blockquote]:border-red-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-slate-600 [&_blockquote]:bg-red-50 [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-lg
                      [&_img]:w-full [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-md [&_img]:object-contain [&_img]:block [&_img]:mx-auto
                      [&_strong]:font-bold [&_strong]:text-slate-900
                      [&_a]:text-red-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:break-words
                      [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:overflow-x-auto [&_table]:block
                      [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
                      [&_th]:border [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-50 [&_th]:font-bold [&_th]:text-sm
                    "
                    dangerouslySetInnerHTML={{ __html: berita.content || berita.isi }}
                  />

                  {/* Share / Tags section */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Link href="/" className="text-xs font-bold uppercase text-slate-500 hover:text-red-600 transition duration-200 flex items-center gap-1">
                      &larr; Kembali ke Beranda
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase mr-1">Bagikan:</span>
                      
                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank" rel="noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        aria-label="Share Facebook"
                      >
                        <i className="fa-brands fa-facebook-f text-xs"></i>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent((berita.title || berita.judul) + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                        target="_blank" rel="noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:border-green-600 hover:bg-green-50 hover:text-green-600 transition duration-200"
                        aria-label="Share WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-xs"></i>
                      </a>

                      {/* Twitter / X */}
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((berita.title || berita.judul))}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank" rel="noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:border-slate-800 hover:bg-slate-100 hover:text-slate-900 transition duration-200"
                        aria-label="Share Twitter/X"
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>

                      {/* Copy Link */}
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Tautan berita berhasil disalin ke clipboard!');
                          }
                        }}
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:border-red-650 hover:bg-red-50 hover:text-red-650 transition duration-200 cursor-pointer"
                        aria-label="Salin Tautan"
                      >
                        <i className="fa-regular fa-copy text-xs"></i>
                      </button>
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* === SIDEBAR (Full width di HP — otomatis di bawah konten, 4/12 di desktop) === */}
            <aside className="w-full min-w-0 md:col-span-4">
              <div className="flex flex-col gap-6">

                {/* Iklan Sidebar Atas */}
                <div className="w-full overflow-hidden">
                  <AdSlot size="300x250" className="w-full" ad={sidebarTopAd} />
                </div>

                {/* Widget Berita Populer */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-sm font-black uppercase text-slate-900 border-b border-gray-200 pb-2 mb-4 tracking-wide">
                    <i className="fa-solid fa-fire text-red-500 mr-1.5"></i> Berita Populer
                  </h3>
                  <div className="flex flex-col gap-4">
                    {popularBerita.length > 0 ? (
                      popularBerita.slice(0, 5).map((post, idx) => (
                        <div key={post.id} className="flex gap-4 items-start">
                          <span className="text-gray-200 font-black text-4xl leading-none shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 hover:text-red-600 leading-snug line-clamp-2 transition-colors">
                              <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {formatTimeAgo(post.created_at)} &bull; {post.category}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState compact icon="fa-solid fa-fire" title="Belum ada data" />
                    )}
                  </div>
                </div>

                {/* Iklan Sidebar Bawah */}
                <div className="w-full overflow-hidden">
                  <AdSlot size="300x600" className="w-full" ad={sidebarBottomAd} />
                </div>

              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full" ad={footerAd} />
      </div>

      <Footer categories={categories} />
    </div>
  );
}
