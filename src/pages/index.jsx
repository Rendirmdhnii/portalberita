import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import EmptyState from '@/components/EmptyState';
import BreakingNews from '@/components/BreakingNews';
import Footer from '@/components/Footer';
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
      setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
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
        supabase.from('videos').select('*').order('id', { ascending: false })
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
    <div className="w-full bg-gray-50 min-h-screen text-slate-800 font-sans overflow-x-hidden">
      <Head>
        <title>PojokTV - Jaringan Berita Nasional Terpercaya</title>
        <meta name="description" content="Portal berita terkini, tajam, dan independen. Menghadirkan informasi dan jurnalisme terpercaya dari seluruh penjuru nusantara setiap hari." />
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
            Pojok<span className="text-red-605">TV.com</span>
          </Link>
        </div>
      </div>

      {/* Baris 3: Navigation, Search, & Live TV */}
      <div className="bg-white border-b border-gray-250 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 py-2">
          {/* Left: Scrollable Rubrik Menu */}
          <nav className="overflow-x-auto whitespace-nowrap scrollbar-none flex-1 max-w-full">
            <ul className="flex items-center gap-6 text-sm font-bold text-slate-700 uppercase py-1">
              <li>
                <Link href="/" className="hover:text-red-650 transition-colors pb-1 border-b-2 border-red-600 text-red-600">
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

      {/* Pindahkan Slot Iklan Utama ke sini (Di bawah Breaking News dan di atas Hero) */}
      {headerAd && headerAd.image && (
        <div className="w-full max-w-7xl mx-auto my-4 px-2 md:px-4 flex justify-center">
          <AdSlot 
            size="970x90" 
            className="w-full" 
            ad={headerAd} 
          />
        </div>
      )}

      {/* Main Wrapper */}
      <main className="main-wrapper my-8 gap-8 flex flex-col pt-0">
        <div className="container">
          {/* 3. Hero Section */}
          <section className="hero-section mb-8">
            {berita.length === 0 ? (
              <EmptyState
                icon="fa-solid fa-newspaper"
                title="Belum ada berita yang dipublikasikan"
                message="Berita terbaru akan muncul di sini setelah redaksi mempublikasikannya."
              />
            ) : (
              <div className="hero-grid">
                {/* Berita Sorotan Utama (Kiri, 65%) */}
                <div className="hero-main bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150">
                  <div className="hero-card flex flex-col md:relative md:h-full">
                    {getThumbnail(berita[0]) ? (
                      <div className="w-full h-56 md:h-full md:absolute md:inset-0">
                        <img src={getThumbnail(berita[0])} alt={berita[0].title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-56 md:h-full md:absolute md:inset-0 bg-slate-900 flex items-center justify-center text-slate-600 font-bold">
                        No Image
                      </div>
                    )}
                    
                    {/* Text Container: Overlay on desktop, stacked below on mobile */}
                    <div className="w-full md:absolute md:bottom-0 md:left-0 md:right-0 md:h-[75%] bg-gradient-to-t md:from-black/95 md:via-black/70 md:to-transparent flex flex-col justify-end p-4 md:p-6 text-slate-900 md:text-white bg-white md:bg-transparent">
                      <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded w-fit mb-2 uppercase">{berita[0]?.category}</span>
                      <h1 className="text-lg md:text-2xl lg:text-3xl font-serif font-black text-slate-900 md:text-white hover:text-red-600 md:hover:text-red-200 leading-tight line-clamp-2">
                        <Link href={`/berita/${berita[0]?.slug}`}>
                          {berita[0]?.title}
                        </Link>
                      </h1>
                      <div className="text-[10px] text-slate-500 md:text-slate-300 mt-2 flex items-center gap-3">
                        <span><i className="fa-regular fa-user text-red-600 md:text-inherit"></i> {berita[0]?.author || 'Redaksi'}</span>
                        <span>•</span>
                        <span><i className="fa-regular fa-clock text-red-600 md:text-inherit"></i> {formatTimeAgo(berita[0]?.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Berita Pendamping (Kanan, 35% - 4 Stacked Cards) */}
                <div className="hero-side flex flex-col gap-3">
                  {berita.slice(1, 5).length > 0 ? (
                    berita.slice(1, 5).map((post) => (
                      <div key={post.id} className="hero-side-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 flex" style={{ height: '120px' }}>
                        <div className="side-img-wrapper w-28 shrink-0 relative">
                          {getThumbnail(post) ? (
                            <img src={getThumbnail(post)} alt={post.title} className="side-img w-full h-full object-cover" />
                          ) : (
                            <div className="side-img bg-slate-900 flex items-center justify-center text-slate-600 text-xs w-full h-full">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="side-content flex-1 p-3 flex flex-col justify-between overflow-hidden">
                          <div>
                            <div className="category-row">
                              <span className="side-category text-red-605 text-[10px] font-extrabold uppercase">{post.category}</span>
                            </div>
                            <h2 className="side-title text-sm font-bold text-slate-900 hover:text-red-606 line-clamp-2 mt-0.5 leading-snug">
                              <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                            </h2>
                          </div>
                          <div className="side-meta text-[10px] text-slate-400">
                            <span>{formatTimeAgo(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState compact icon="fa-solid fa-layer-group" title="Belum ada berita lainnya" />
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Seksi 1: Kriminal Hari Ini (Grid 4 Kartu) */}
          <section className="kriminal-section mb-8" id="kriminal-section">
            <div className="section-header border-b border-gray-250 pb-2 mb-4 flex justify-between items-center">
              <h2 className="section-title text-xl font-black text-slate-900 uppercase tracking-tight">
                <span className="border-b-4 border-red-650 pb-2">Kriminal Hari Ini</span>
              </h2>
              <Link href="/kategori/kriminal" className="text-xs font-bold text-red-600 hover:text-red-750 flex items-center gap-1">
                Indeks Kriminal <i className="fa-solid fa-chevron-right"></i>
              </Link>
            </div>

            <div className="kriminal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kriminalNews.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState icon="fa-solid fa-shield-halved" title="Belum ada berita kriminal" message="Belum ada berita dalam kategori ini." />
                </div>
              ) : (
                kriminalNews.slice(0, 4).map((post) => (
                  <article key={post.id} className="politik-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 hover:shadow-md transition-shadow">
                    <div className="politik-img-wrapper h-40 relative">
                      {getThumbnail(post) ? (
                        <img src={getThumbnail(post)} alt={post.title} className="politik-img w-full h-full object-cover" />
                      ) : (
                        <div className="politik-img bg-slate-900 flex items-center justify-center text-slate-600 w-full h-full">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="politik-content p-4">
                      <span className="crimson-tag text-red-650 text-[10px] font-extrabold uppercase">KRIMINAL</span>
                      <h3 className="politik-title text-sm font-bold text-slate-900 hover:text-red-600 line-clamp-2 mt-1 leading-snug">
                        <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <div className="politik-meta text-[10px] text-slate-400 mt-2">
                        <span>{formatTimeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Slot Iklan 4: Tengah-tengah daftar berita */}
          <div className="w-full my-8 flex justify-center">
            <AdSlot size="728x90" className="w-full" ad={middleAd} />
          </div>
        </div>

        {/* Seksi 2: Pojok Video (Carousel Slider Horizontal - Mode Gelap) */}
        <section className="video-section py-10 bg-slate-950 text-white" id="video-section">
          <div className="container">
            <div className="section-header border-b border-slate-800 pb-2 mb-6 flex justify-between items-center">
              <h2 className="section-title text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <i className="fa-solid fa-circle-play text-red-600"></i> Pojok Video
              </h2>
              {/* Carousel Arrows */}
              <div className="editor-controls flex gap-2">
                <button className="carousel-arrow bg-slate-800 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors" id="video-prev" aria-label="Sebelumnya" onClick={handlePrevVideo}>
                  <i className="fa-solid fa-chevron-left text-sm"></i>
                </button>
                <button className="carousel-arrow bg-slate-800 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors" id="video-next" aria-label="Selanjutnya" onClick={handleNextVideo}>
                  <i className="fa-solid fa-chevron-right text-sm"></i>
                </button>
              </div>
            </div>

            <div className="video-carousel-wrapper overflow-hidden">
              {videos.length === 0 ? (
                <div className="w-full">
                  <EmptyState dark icon="fa-brands fa-youtube" title="Belum ada video tayang" message="Tambahkan video dari panel admin untuk ditampilkan di sini." />
                </div>
              ) : (
                <div
                  className="video-carousel-inner flex gap-5 transition-transform duration-300 ease-out"
                  id="video-carousel-track"
                  style={{
                    transform: `translateX(-${videoIndex * 240}px)`
                  }}
                >
                  {videos.map((video) => (
                    <div key={video.id} className="video-carousel-card w-[220px] shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 cursor-pointer hover:border-red-600 transition" onClick={() => handlePlayVideo(video.judul)}>
                      <div className="video-thumb-container h-32 relative">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                          alt={video.judul}
                          className="video-thumb-img-new w-full h-full object-cover"
                        />
                        <div className="video-play-center-btn absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all">
                          <i className="fa-solid fa-play text-xl bg-red-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"></i>
                        </div>
                      </div>
                      <div className="video-carousel-info p-3">
                        <h4 className="video-carousel-title text-xs font-bold text-slate-100 line-clamp-2 leading-snug">{video.judul}</h4>
                        <span className="video-carousel-meta text-[10px] text-slate-405 mt-2 block"><i className="fa-brands fa-youtube text-red-600"></i> YouTube</span>
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
          <div className="content-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri: Ekonomi & Bisnis (70% / 2 columns) */}
            <div className="content-left lg:col-span-2" id="ekonomi-section">
              <div className="section-header border-b border-gray-250 pb-2 mb-4 flex justify-between items-center">
                <h2 className="section-title text-xl font-black text-slate-900 uppercase tracking-tight">
                  <span className="border-b-4 border-red-650 pb-2">Ekonomi & Bisnis</span>
                </h2>
                <Link href="/kategori/ekonomi" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  Indeks Ekonomi <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="ekonomi-grid flex flex-col gap-4">
                {ekonomiNews.length === 0 ? (
                  <EmptyState icon="fa-solid fa-chart-line" title="Belum ada berita ekonomi & bisnis" message="Belum ada berita dalam kategori ini." />
                ) : (
                  ekonomiNews.slice(0, 4).map((post) => (
                    <article key={post.id} className="ekonomi-item bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition">
                      <div className="ekonomi-img-wrapper w-full h-48 sm:w-36 sm:h-24 shrink-0 relative rounded-lg overflow-hidden">
                        {getThumbnail(post) ? (
                          <img src={getThumbnail(post)} alt={post.title} className="ekonomi-img w-full h-full object-cover" />
                        ) : (
                          <div className="ekonomi-img bg-slate-900 flex items-center justify-center text-slate-655 w-full h-full">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="ekonomi-content flex-1 flex flex-col justify-between overflow-hidden p-1 sm:p-0">
                        <div>
                          <h3 className="ekonomi-title text-base font-bold text-slate-900 hover:text-red-655 line-clamp-2">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="ekonomi-snippet text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">{post.content?.replace(/<[^>]*>/g, '')?.slice(0, 160)}...</p>
                        </div>
                        <div className="ekonomi-meta text-[10px] text-slate-400 mt-2">
                          <span>{formatTimeAgo(post.created_at)} | {post.category}</span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Kolom Kanan: Sidebar (30% / 1 column) */}
            <aside className="sidebar-wrapper">
              <div className="sidebar-sticky flex flex-col gap-6">
                {/* Terpopuler */}
                <div className="sidebar-widget bg-white rounded-xl shadow-sm border border-gray-155 p-4" id="popular-widget">
                  <div className="section-header border-b border-gray-200 pb-2 mb-4">
                    <h3 className="section-title text-base font-black text-slate-900 uppercase">Terpopuler</h3>
                  </div>
                  <ul className="popular-list flex flex-col gap-4">
                    {popularNews.length === 0 ? (
                      <li><EmptyState compact icon="fa-solid fa-fire" title="Belum ada berita terpopuler" /></li>
                    ) : (
                      popularNews.slice(0, 5).map((post, idx) => (
                        <li key={post.id} className="flex gap-4 items-start">
                          <span className="text-gray-200 font-black text-4xl leading-none shrink-0">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="popular-content flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                              <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {formatTimeAgo(post.created_at)} &bull; {post.category}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Slot Iklan 2: Sidebar Kanan Atas */}
                <div className="w-full">
                  <AdSlot size="300x250" className="w-full" ad={sidebarTopAd} />
                </div>

                {/* Slot Iklan 3: Sidebar Kanan Bawah */}
                <div className="w-full">
                  <AdSlot size="300x600" className="w-full" ad={sidebarBottomAd} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Slot Iklan 5: Bagian Atas Footer */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full" ad={footerAd} />
      </div>

      <Footer categories={categories} />
    </div>
  );
}
