import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdSlot from '@/components/AdSlot';
import EmptyState from '@/components/EmptyState';
import BreakingNews from '@/components/BreakingNews';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function KategoriPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic States from Supabase
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [berita, setBerita] = useState([]);
  const [latestBerita, setLatestBerita] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Find active category
      const active = catData?.find(c => c.slug === slug);
      setActiveCategory(active || null);

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

      // 4. Fetch berita under this category
      if (active) {
        const { data: beritaData } = await supabase
          .from('berita')
          .select('*')
          .eq('category', active.name)
          .eq('status', 'Published')
          .order('created_at', { ascending: false });
        
        setBerita(beritaData || []);
      } else {
        setBerita([]);
      }
    } catch (err) {
      console.error('Error fetching category data:', err);
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

  const getThumbnail = (post) => {
    if (!post) return '';
    const imagesData = post.images || post.image;
    if (!imagesData) return '';
    if (Array.isArray(imagesData)) {
      return imagesData[0] || '';
    }
    if (typeof imagesData === 'string') {
      try {
        if (imagesData.startsWith('[')) {
          const parsed = JSON.parse(imagesData);
          return parsed[0] || '';
        }
      } catch (e) {
        // ignore
      }
      return imagesData;
    }
    return '';
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
        <title>{activeCategory ? `Rubrik ${activeCategory.name} - PojokTV.com` : 'Rubrik Kategori - PojokTV.com'}</title>
        <meta name="description" content={activeCategory ? `Kumpulan berita terkini seputar rubrik ${activeCategory.name} hanya di PojokTV.com.` : 'PojokTV.com'} />
      </Head>

      {/* Baris 1: Top Bar */}
      <div className="top-bar bg-slate-950 text-slate-300 py-2 border-b border-slate-800">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          {/* Left: Clock & Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <i className="fa-regular fa-clock text-red-500"></i>
            <span>{currentDate} | {currentTime}</span>
          </div>

          {/* Right: Trending & Socials (Hapus Tombol Login) */}
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

      {/* Baris 2: Main Branding (Logo di kiri Desktop, tengah HP. Hapus iklan di sini) */}
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
                <Link href="/" className="hover:text-red-600 transition-colors pb-1">
                  Berita Utama
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/kategori/${cat.slug}`} className={`hover:text-red-600 transition-colors pb-1 ${cat.slug === slug ? 'border-b-2 border-red-600 text-red-650' : ''}`}>
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

      {/* Pindahkan Slot Iklan Utama ke sini (Di bawah Breaking News dan di atas Kategori) */}
      {headerAd && headerAd.image && (
        <div className="w-full max-w-7xl mx-auto my-4 px-2 md:px-4 flex justify-center">
          <AdSlot 
            size="970x90" 
            className="w-full" 
            ad={headerAd} 
          />
        </div>
      )}

      {/* Content Wrapper */}
      <main className="main-wrapper my-8 pt-0">
        <div className="container">
          {/* Breadcrumb + Kategori Header */}
          <div className="mb-6">
            <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Link href="/" className="hover:text-red-600 transition-colors">Beranda</Link>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
              <span className="text-slate-500">Kategori</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
              <span className="text-red-600 font-semibold">{activeCategory ? activeCategory.name : '...'}</span>
            </nav>
            <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight leading-none">
              {activeCategory ? activeCategory.name : 'Memuat...'}
            </h1>
            <div className="border-b-4 border-red-600 w-16 mt-2 mb-0"></div>
          </div>

          <div className="content-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grid Berita (Kiri - 70%) */}
            <div className="content-left lg:col-span-2">
              {loading ? (
                <div className="text-center py-20 text-gray-400 font-bold">
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat artikel rubrik...
                </div>
              ) : berita.length === 0 ? (
                <EmptyState
                  icon="fa-solid fa-folder-open"
                  title="Belum ada berita di rubrik ini"
                  message="Redaksi belum mempublikasikan artikel di kategori ini."
                />
              ) : (
                <div className="ekonomi-grid flex flex-col gap-4">
                  {berita.map((post) => (
                    <article key={post.id} className="ekonomi-item bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition">
                      <div className="ekonomi-img-wrapper w-full h-48 sm:w-36 sm:h-24 shrink-0 relative rounded-lg overflow-hidden">
                        {getThumbnail(post) ? (
                          <img src={getThumbnail(post)} alt={post.title} className="ekonomi-img w-full h-full object-cover" />
                        ) : (
                          <div className="ekonomi-img bg-slate-900 flex items-center justify-center text-slate-655 font-bold text-sm w-full h-full">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="ekonomi-content flex-1 flex flex-col justify-between overflow-hidden p-1 sm:p-0">
                        <div>
                          <h3 className="ekonomi-title text-base font-bold text-slate-900 hover:text-red-655 line-clamp-2">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="ekonomi-snippet text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                            {post.content?.replace(/<[^>]*>/g, '')?.slice(0, 180)}...
                          </p>
                        </div>
                        <div className="ekonomi-meta text-[10px] text-slate-400 mt-2">
                          <span>{formatTimeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar (Kanan - 30%) */}
            <aside className="sidebar-wrapper">
              <div className="sidebar-sticky gap-6 flex flex-col">
                {/* Slot Iklan 2 */}
                <div className="w-full">
                  <AdSlot size="300x250" className="w-full" ad={sidebarTopAd} />
                </div>

                {/* Slot Iklan 3 */}
                <div className="w-full">
                  <AdSlot size="300x600" className="w-full" ad={sidebarBottomAd} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full" ad={footerAd} />
      </div>

      <Footer categories={categories} />
    </div>
  );
}
