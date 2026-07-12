import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdSlot from '@/components/AdSlot';
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
    <div className="w-full">
      <Head>
        <title>{activeCategory ? `Rubrik ${activeCategory.name} - PojokTV.com` : 'Rubrik Kategori - PojokTV.com'}</title>
        <meta name="description" content={activeCategory ? `Kumpulan berita terkini seputar rubrik ${activeCategory.name} hanya di PojokTV.com.` : 'PojokTV.com'} />
      </Head>

      {/* 1. Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <div className="top-bar-item" id="realtime-date-clock">
              <i className="fa-regular fa-clock text-crimson"></i>
              <span>{currentDate} | {currentTime}</span>
            </div>
          </div>

          <div className="top-bar-right">
            <div className="trending-tags">
              <span className="trending-label">🔴 TRENDING:</span>
              <div className="trending-list">
                {categories.slice(0, 4).map(cat => (
                  <Link key={cat.id} href={`/kategori/${cat.slug}`}>
                    #{cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="social-icons flex items-center">
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              <Link href="/admin/login" className="ml-3 text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded transition-all">
                LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-main-bar flex items-center justify-between">
            <Link href="/" className="logo flex-shrink-0" id="main-logo">
              Pojok<span>TV.com</span>
            </Link>

            <div className="hidden lg:block w-[468px] h-[60px] mx-4 flex-shrink">
              <AdSlot size="468x60" className="h-full py-1 text-[9px]" ad={headerAd} />
            </div>

            <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`} id="main-navigation">
              <ul className="nav-list">
                <li><Link href="/" className="nav-link">Berita Utama</Link></li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/kategori/${cat.slug}`} className={`nav-link ${cat.slug === slug ? 'active' : ''}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="header-actions">
              <form onSubmit={handleSearch} className="search-box">
                <input
                  type="text"
                  className="search-input"
                  id="search-bar"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn" aria-label="Cari">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </form>

              <button className="live-tv-btn" id="live-tv-trigger" onClick={handleLiveTv}>
                <span className="live-dot"></span>
                <span>🔴 LIVE TV</span>
              </button>

              <div
                className="mobile-toggle"
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker Bar */}
        <div className="ticker-bar">
          <div className="ticker-label">⚠️ BREAKING NEWS</div>
          <div className="ticker-content">
            <div className="ticker-track" id="breaking-ticker">
              {latestBerita.length > 0 ? (
                latestBerita.map((post) => (
                  <div key={post.id} className="ticker-item">
                    <span className="ticker-bullet">•</span> {post.title}
                  </div>
                ))
              ) : (
                <div className="ticker-item">Belum ada berita</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Wrapper */}
      <main className="main-wrapper my-8">
        <div className="container">
          <div className="section-header border-b pb-2 mb-6">
            <h1 className="text-3xl font-black text-slate-900 uppercase">
              Rubrik: <span className="text-crimson">{activeCategory ? activeCategory.name : 'Memuat...'}</span>
            </h1>
          </div>

          <div className="content-grid gap-6">
            {/* Grid Berita (Kiri - 70%) */}
            <div className="content-left">
              {loading ? (
                <div className="text-center py-20 text-gray-400 font-bold">
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat artikel rubrik...
                </div>
              ) : berita.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500 font-bold text-lg">
                  Belum ada berita di rubrik ini
                </div>
              ) : (
                <div className="ekonomi-grid gap-6">
                  {berita.map((post) => (
                    <article key={post.id} className="ekonomi-item">
                      <div className="ekonomi-img-wrapper">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="ekonomi-img" />
                        ) : (
                          <div className="ekonomi-img bg-slate-900 flex items-center justify-center text-slate-650 font-bold text-sm">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="ekonomi-content">
                        <div>
                          <h3 className="ekonomi-title text-lg font-bold hover:text-red-600 transition-colors">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="ekonomi-snippet text-slate-600 text-sm mt-2 line-clamp-3">
                            {post.content?.slice(0, 180)}...
                          </p>
                        </div>
                        <div className="ekonomi-meta text-xs text-slate-400 mt-4">
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
                <div className="w-full h-[250px]">
                  <AdSlot size="300x250" className="w-full h-full" ad={sidebarTopAd} />
                </div>

                {/* Slot Iklan 3 */}
                <div className="w-full h-[500px]">
                  <AdSlot size="300x600" className="w-full h-full" ad={sidebarBottomAd} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full max-w-[970px] h-[200px]" ad={footerAd} />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col md:col-span-2">
              <div className="footer-about-logo">
                PojokTV<span>.com</span>
              </div>
              <p className="footer-about-text">
                PojokTV.com adalah bagian dari jaringan televisi berita digital nasional terkemuka yang berdedikasi menghadirkan jurnalisme berwibawa, independen, tajam, dan tercepat dari seluruh penjuru nusantara.
              </p>
              <div className="social-icons" style={{ marginTop: '0.5rem' }}>
                <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
                <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Kategori</h4>
              <div className="footer-links">
                <Link href="/">Berita Utama</Link>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/kategori/${cat.slug}`}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="footer-col md:col-span-1">
              <h4 className="footer-col-title">Hubungi Kami</h4>
              <div className="footer-links text-slate-400 space-y-2">
                <div className="footer-contact-item">
                  <i className="fa-solid fa-user text-crimson mt-0.5"></i>
                  <span>Nama: Mujianto Primadi</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-location-dot text-crimson mt-0.5"></i>
                  <span>Alamat: Perum Citra Oma Pesona Blok E3/25 RT 37 RW 07, Desa Sidokepung, Kecamatan Buduran, Sidoarjo, Jatim</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-brands fa-whatsapp text-crimson mt-0.5"></i>
                  <span>WhatsApp: <a href="https://wa.me/6281331160799" target="_blank" rel="noreferrer" className="hover:text-white underline">+62 813-3116-0799</a></span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-envelope text-crimson mt-0.5"></i>
                  <span>Email: <a href="mailto:redaksi@pojoktv.com" className="hover:text-white underline">redaksi@pojoktv.com</a></span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; 2026 pojoktv.com. Jaringan Berita Nasional Terpercaya. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="footer-bottom-links flex items-center gap-4">
              <Link href="/tentang-kami">Tentang Kami</Link>
              <Link href="/pedoman-media">Pedoman Media Siber</Link>
              <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
              <Link href="/ketentuan-layanan">Ketentuan Layanan</Link>
              <Link href="/admin/login" className="text-red-500 hover:text-red-400 font-bold ml-2">Login Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
