import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic States from Supabase
  const [categories, setCategories] = useState([]);
  const [berita, setBerita] = useState([]);
  const [ads, setAds] = useState([]);
  const [videos, setVideos] = useState([]);
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
      setCurrentDate(`${days[now.getDay()]} , ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };
    const timer = setInterval(updateDateTime, 1000);
    updateDateTime();
    return () => clearInterval(timer);
  }, []);

  // Fetch data on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        { data: catData },
        { data: beritaData },
        { data: adsData },
        { data: videosData }
      ] = await Promise.all([
        supabase.from('categories').select('*').eq('status', 'Aktif').order('name'),
        supabase.from('berita').select('*').eq('status', 'Published').order('created_at', { ascending: false }),
        supabase.from('ads').select('*').eq('is_active', true),
        supabase.from('videos').select('*').order('created_at', { ascending: false })
      ]);

      setCategories(catData || []);
      setBerita(beritaData || []);
      setAds(adsData || []);
      setVideos(videosData || []);
    } catch (err) {
      console.error('Error fetching public data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handlePrevVideo = () => {
    if (videos.length === 0) return;
    setVideoIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleNextVideo = () => {
    if (videos.length === 0) return;
    setVideoIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  const handlePlayVideo = (title) => {
    alert(`Memutar Video: "${title}" (Simulasi Video Player Overlay)`);
  };

  // Find Ads by Position
  const headerAd = ads?.find(a => a.position === 'Header' || a.position === 'header');
  const sidebarTopAd = ads?.find(a => a.position === 'Sidebar Atas' || a.position === 'sidebar');
  const sidebarBottomAd = ads?.find(a => a.position === 'Sidebar Bawah');
  const middleAd = ads?.find(a => a.position === 'Tengah Konten');
  const footerAd = ads?.find(a => a.position === 'Footer');

  // Filter Categories
  const kriminalNews = berita?.filter(b => b.category?.toLowerCase() === 'kriminal') || [];
  const ekonomiNews = berita?.filter(b => b.category?.toLowerCase() === 'ekonomi' || b.category?.toLowerCase() === 'ekonomi & bisnis') || [];
  
  // Sorted by views
  const popularNews = berita ? [...berita].sort((a, b) => (b.views || 0) - (a.views || 0)) : [];

  return (
    <div className="w-full">
      <Head>
        <title>PojokTV.com - Portal Berita Nasional Terpercaya & Tercepat</title>
        <meta name="description" content="PojokTV.com menyajikan berita terkini, kriminal, politik, dunia, otomotif, olahraga, hiburan, dan video berita eksklusif nasional terpercaya secara cepat dan akurat." />
      </Head>

      {/* 1. Top Bar (Header Utilitas) */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <div className="top-bar-item" id="realtime-date">
              <i className="fa-regular fa-calendar-days text-crimson"></i>
              <span>{currentDate}</span>
            </div>
            <div className="top-bar-item" id="realtime-clock">
              <i className="fa-regular fa-clock text-crimson"></i>
              <span>{currentTime}</span>
            </div>
            <div className="top-bar-item" id="weather-info">
              <i className="fa-solid fa-cloud-sun text-crimson"></i>
              <span>Surabaya, 30°C (Cerah)</span>
            </div>
          </div>

          <div className="top-bar-right">
            <div className="trending-tags">
              <span className="trending-label">🔴 TRENDING:</span>
              <div className="trending-list">
                <a href="#">#Pemilu2026</a>
                <a href="#">#KriminalHariIni</a>
                <a href="#">#RupiahMenguat</a>
                <a href="#">#TimnasDay</a>
              </div>
            </div>

            <div className="social-icons flex items-center">
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              {/* Button Login Admin di Top Bar */}
              <Link href="/admin/login" className="ml-3 text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded transition-all">
                LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header & Navigation (Sticky) */}
      <header className="main-header">
        <div className="container">
          <div className="header-main-bar flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="logo flex-shrink-0" id="main-logo">
              Pojok<span>TV.com</span>
            </Link>

            {/* Slot Iklan 1: Header (Sebelah kanan logo) */}
            <div className="hidden lg:block w-[468px] h-[60px] mx-4 flex-shrink">
              <AdSlot size="468x60" className="h-full py-1 text-[9px]" ad={headerAd} />
            </div>

            {/* Menu Navigasi Utama */}
            <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`} id="main-navigation">
              <ul className="nav-list">
                <li><Link href="/" className="nav-link active">Berita Utama</Link></li>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/kategori/${cat.slug}`} className="nav-link">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="nav-link text-slate-400 text-xs px-4">Belum ada rubrik</li>
                )}
              </ul>
            </nav>

            {/* Sisi Kanan: Search & Live TV */}
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

              {/* Hamburger Menu for Mobile */}
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

        {/* Breaking News Ticker */}
        <div className="ticker-bar">
          <div className="ticker-label">⚠️ BREAKING NEWS</div>
          <div className="ticker-content">
            <div className="ticker-track" id="breaking-ticker">
              {berita.slice(0, 4).length > 0 ? (
                berita.slice(0, 4).map((post) => (
                  <div key={post.id} className="ticker-item">
                    <span className="ticker-bullet">•</span> {post.title}
                  </div>
                ))
              ) : (
                <div className="ticker-item">Selamat Datang di PojokTV.com - Portal Berita Terpercaya</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Wrapper */}
      <main className="main-wrapper">
        <div className="container">
          {/* 3. Hero Section (Grid Berita Utama Asimetris) */}
          <section className="hero-section">
            {berita.length === 0 ? (
              <div className="w-full text-center py-20 bg-white border border-gray-250 rounded-xl shadow-sm text-gray-500 font-bold text-lg">
                Belum ada berita yang dipublikasikan
              </div>
            ) : (
              <div className="hero-grid">
                {/* Berita Sorotan Utama (Kiri, 65%) */}
                <div className="hero-main">
                  <div className="hero-card">
                    {berita[0]?.image ? (
                      <img src={berita[0].image} alt={berita[0].title} className="hero-img" />
                    ) : (
                      <div className="hero-img bg-slate-900 flex items-center justify-center text-slate-600 font-bold">
                        No Image
                      </div>
                    )}
                    <div className="gradient-overlay">
                      <span className="tag-badge">{berita[0]?.category}</span>
                      <h1 className="hero-title-main">
                        <Link href={`/berita/${berita[0]?.slug}`}>
                          {berita[0]?.title}
                        </Link>
                      </h1>
                      <div className="hero-meta">
                        <span><i className="fa-regular fa-user"></i> {berita[0]?.author || 'Redaksi'}</span>
                        <span>•</span>
                        <span><i className="fa-regular fa-clock"></i> {formatTimeAgo(berita[0]?.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Berita Pendamping (Kanan, 35% - 4 Stacked Cards) */}
                <div className="hero-side" style={{ gap: '0.75rem' }}>
                  {berita.slice(1, 5).length > 0 ? (
                    berita.slice(1, 5).map((post) => (
                      <div key={post.id} className="hero-side-card" style={{ height: '120px' }}>
                        <div className="side-img-wrapper">
                          {post.image ? (
                            <img src={post.image} alt={post.title} className="side-img" />
                          ) : (
                            <div className="side-img bg-slate-900 flex items-center justify-center text-slate-600 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="side-content" style={{ padding: '0.5rem 0.75rem' }}>
                          <div>
                            <div className="category-row">
                              <span className="side-category">{post.category}</span>
                            </div>
                            <h2 className="side-title" style={{ fontSize: '0.95rem', WebkitLineClamp: 2, lineClamp: 2 }}>
                              <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                            </h2>
                          </div>
                          <div className="side-meta">
                            <span>{formatTimeAgo(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-lg py-12">
                      Belum ada berita lainnya
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Seksi 1: Kriminal Hari Ini (Grid 4 Kartu) */}
          <section className="kriminal-section" id="kriminal-section" style={{ marginBottom: '3rem' }}>
            <div className="section-header">
              <h2 className="section-title crimson-title">Kriminal Hari Ini</h2>
              <a href="#" className="section-link">Indeks Kriminal <i className="fa-solid fa-chevron-right"></i></a>
            </div>

            <div className="kriminal-grid">
              {kriminalNews.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white border border-gray-200 rounded-lg text-gray-500 font-bold">
                  Belum ada berita kriminal
                </div>
              ) : (
                kriminalNews.slice(0, 4).map((post) => (
                  <article key={post.id} className="politik-card">
                    <div className="politik-img-wrapper">
                      {post.image ? (
                        <img src={post.image} alt={post.title} className="politik-img" />
                      ) : (
                        <div className="politik-img bg-slate-900 flex items-center justify-center text-slate-600">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="politik-content">
                      <span className="crimson-tag" style={{ marginBottom: '0.5rem', display: 'block' }}>KRIMINAL</span>
                      <h3 className="politik-title" style={{ fontSize: '1.05rem', lineHeight: '1.35' }}>
                        <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <div className="politik-meta">
                        <span>{formatTimeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Slot Iklan 4: Tengah-tengah daftar berita */}
          <div className="w-full my-8">
            <AdSlot size="728x90" className="h-[90px]" ad={middleAd} />
          </div>
        </div>

        {/* Seksi 2: Pojok Video (Carousel Slider Horizontal - Mode Gelap) */}
        <section className="video-section" id="video-section" style={{ marginBottom: '3rem' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title"><i className="fa-solid fa-circle-play text-crimson"></i> Pojok Video</h2>
              {/* Carousel Arrows */}
              <div className="editor-controls" style={{ marginTop: '0' }}>
                <button className="carousel-arrow" id="video-prev" aria-label="Sebelumnya" onClick={handlePrevVideo}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="carousel-arrow" id="video-next" aria-label="Selanjutnya" onClick={handleNextVideo}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="video-carousel-wrapper">
              {videos.length === 0 ? (
                <div className="w-full text-center py-12 text-gray-500 font-bold">
                  Belum ada video tayang
                </div>
              ) : (
                <div
                  className="video-carousel-inner"
                  id="video-carousel-track"
                  style={{
                    transform: `translateX(-${videoIndex * 220}px)`,
                    transition: 'transform 0.4s ease'
                  }}
                >
                  {videos.map((video) => (
                    <div key={video.id} className="video-carousel-card" onClick={() => handlePlayVideo(video.judul)}>
                      <div className="video-thumb-container">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                          alt={video.judul}
                          className="video-thumb-img-new object-cover"
                        />
                        <div className="video-play-center-btn">
                          <i className="fa-solid fa-play"></i>
                        </div>
                      </div>
                      <div className="video-carousel-info">
                        <h4 className="video-carousel-title">{video.judul}</h4>
                        <span className="video-carousel-meta"><i className="fa-brands fa-youtube text-red-650"></i> YouTube</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Seksi Ekonomi & Bisnis + Sidebar */}
        <div className="container">
          <div className="content-grid">
            {/* Kolom Kiri: Ekonomi & Bisnis (70%) */}
            <div className="content-left" id="ekonomi-section">
              <div className="section-header">
                <h2 className="section-title">Ekonomi & Bisnis</h2>
                <a href="#" className="section-link">Indeks Ekonomi <i className="fa-solid fa-chevron-right"></i></a>
              </div>

              <div className="ekonomi-grid">
                {ekonomiNews.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-gray-200 rounded-lg text-gray-500 font-bold">
                    Belum ada berita ekonomi & bisnis
                  </div>
                ) : (
                  ekonomiNews.slice(0, 4).map((post) => (
                    <article key={post.id} className="ekonomi-item">
                      <div className="ekonomi-img-wrapper">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="ekonomi-img" />
                        ) : (
                          <div className="ekonomi-img bg-slate-900 flex items-center justify-center text-slate-600">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="ekonomi-content">
                        <div>
                          <h3 className="ekonomi-title">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="ekonomi-snippet">{post.content?.slice(0, 160)}...</p>
                        </div>
                        <div className="ekonomi-meta">
                          <span>{formatTimeAgo(post.created_at)} | {post.category}</span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Kolom Kanan: Sidebar (30%) */}
            <aside className="sidebar-wrapper">
              <div className="sidebar-sticky">
                {/* Terpopuler */}
                <div className="sidebar-widget" id="popular-widget">
                  <div className="section-header">
                    <h2 className="section-title">Terpopuler</h2>
                  </div>
                  <ul className="popular-list">
                    {popularNews.length === 0 ? (
                      <li className="py-6 text-center text-gray-500 font-bold">Belum ada berita terpopuler</li>
                    ) : (
                      popularNews.slice(0, 5).map((post, idx) => (
                        <li key={post.id} className="popular-item">
                          <span className="popular-number">{String(idx + 1).padStart(2, '0')}</span>
                          <div className="popular-content">
                            <h4 className="popular-title">
                              <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                            </h4>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Slot Iklan 2: Sidebar Kanan Atas */}
                <div className="w-full h-[250px] mb-4">
                  <AdSlot size="300x250" className="w-full h-full" ad={sidebarTopAd} />
                </div>

                {/* Slot Iklan 3: Sidebar Kanan Bawah */}
                <div className="w-full h-[500px]">
                  <AdSlot size="300x600" className="w-full h-full" ad={sidebarBottomAd} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Slot Iklan 5: Bagian Atas Footer */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full max-w-[970px] h-[200px]" ad={footerAd} />
      </div>

      {/* 6. Footer (Gelap) */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Kolom 1: Logo & Tentang */}
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

            {/* Kolom 2: Peta Situs/Kategori */}
            <div className="footer-col">
              <h4 className="footer-col-title">Kategori</h4>
              <div className="footer-links">
                <Link href="/">Berita Utama</Link>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link key={cat.id} href={`/kategori/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs">Belum ada rubrik</span>
                )}
              </div>
            </div>

            {/* Kolom 3: Redaksi & Kontak */}
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

          {/* Footer Paling Bawah */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; 2026 pojoktv.com. Jaringan Berita Nasional Terpercaya. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="footer-bottom-links flex items-center gap-4">
              <Link href="/tentang-kami">Tentang Kami</Link>
              <Link href="/pedoman-media">Pedoman Media Siber</Link>
              <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
              <Link href="/ketentuan-layanan">Ketentuan Layanan</Link>
              {/* Login link di Footer bottom */}
              <Link href="/admin/login" className="text-red-505 hover:text-red-400 font-bold ml-2">Login Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
