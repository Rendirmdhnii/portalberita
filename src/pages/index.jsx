import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdSlot from '@/components/AdSlot';
import EmptyState from '@/components/EmptyState';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function Home({
  initialCategories = [],
  initialBerita = [],
  initialAds = [],
  initialVideos = []
}) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic States from Supabase
  const [categories, setCategories] = useState(initialCategories);
  const [berita, setBerita] = useState(initialBerita);
  const [ads, setAds] = useState(initialAds);
  const [videos, setVideos] = useState(initialVideos);
  const [loading, setLoading] = useState(initialBerita.length === 0);

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
    if (initialBerita.length === 0) {
      fetchData();
    }
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

  const cleanExcerpt = (text) => {
    if (!text) return '';
    return text.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').trim();
  };

  const handleLiveTv = () => {
    alert("🔴 Menghubungkan ke Siaran Live Streaming PojokTV... (Siaran Berjalan Lancar)");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push({ pathname: '/search', query: { q: searchQuery } });
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

  // Pisahkan Berita Headline dan Berita Biasa
  const headlineBerita = berita?.find(post => post.is_headline === true) || berita?.[0];
  const feedBerita = headlineBerita 
    ? berita?.filter(post => post.id !== headlineBerita.id) || []
    : berita?.slice(1) || [];

  // Filter Categories
  const kriminalNews = berita?.filter(b => b.category?.toLowerCase() === 'kriminal') || [];
  const ekonomiNews = berita?.filter(b => b.category?.toLowerCase() === 'ekonomi' || b.category?.toLowerCase() === 'ekonomi & bisnis') || [];
  
  // Sorted by views
  const popularNews = berita ? [...berita].sort((a, b) => (b.views || 0) - (a.views || 0)) : [];

  return (
    <Layout>
      <Head>
        <title>PojokTV - Jaringan Berita Nasional Terpercaya</title>
        <meta name="description" content="Portal berita terkini, tajam, dan independen. Menghadirkan informasi dan jurnalisme terpercaya dari seluruh penjuru nusantara setiap hari." />
        <meta name="keywords" content="berita terkini, pojoktv, berita nasional, politik, ekonomi, olahraga, indonesia" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>

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

      <main className="main-wrapper my-8 gap-8 flex flex-col pt-0">
        <div className="container">
          {/* 3. Hero Section */}
          <section className="mb-0">
            {berita.length === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6 mb-10">
                {/* Kolom Kiri */}
                <div className="lg:col-span-8">
                  <div className="w-full aspect-[16/9] bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-400 font-bold">
                    Memuat berita...
                  </div>
                </div>
                {/* Kolom Kanan */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="w-full aspect-video bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-400 font-bold">
                    Memuat berita...
                  </div>
                  <div className="w-full aspect-video bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-400 font-bold">
                    Memuat berita...
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6 mb-10">
                {/* Kolom Kiri (Porsi 8 Kolom / ~65%) */}
                <div className="lg:col-span-8 flex flex-col">
                  {headlineBerita && (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden group shadow-sm bg-slate-900">
                      {getThumbnail(headlineBerita) ? (
                        <img 
                          src={getThumbnail(headlineBerita)} 
                          alt={headlineBerita.title} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">
                          Tidak ada gambar
                        </div>
                      )}
                      
                      {/* Text Container: Overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-4 md:p-8">
                        <span className="bg-[#E30A17] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded w-fit mb-2 uppercase tracking-wider">
                          {headlineBerita.category}
                        </span>
                        <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white hover:text-[#E30A17] transition-colors leading-tight line-clamp-2">
                          <Link href={`/berita/${headlineBerita.slug}`}>
                            {headlineBerita.title}
                          </Link>
                        </h1>
                        <div className="text-xs text-gray-400 mt-3 flex items-center gap-3">
                          <span><i className="fa-regular fa-user text-[#E30A17] mr-1"></i> {headlineBerita.author || headlineBerita.penulis || 'Redaksi'}</span>
                          <span>•</span>
                          <span><i className="fa-regular fa-clock text-[#E30A17] mr-1"></i> {formatTimeAgo(headlineBerita.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kolom Kanan (Porsi 4 Kolom / ~35%) */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {feedBerita.slice(0, 2).map((post) => (
                    <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-155 flex flex-col hover:shadow-md transition-shadow">
                      <div className="aspect-video w-full relative overflow-hidden group">
                        {getThumbnail(post) ? (
                          <img 
                            src={getThumbnail(post)} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                            Tidak ada gambar
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-[#E30A17] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <h2 className="text-sm md:text-base font-bold text-slate-900 hover:text-[#E30A17] line-clamp-2 leading-snug">
                          <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                          <span><i className="fa-regular fa-user text-[#E30A17] mr-1"></i> {post.author || post.penulis || 'Redaksi'}</span>
                          <span>•</span>
                          <span><i className="fa-regular fa-clock text-[#E30A17] mr-1"></i> {formatTimeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Handle case when there is only 1 secondary news */}
                  {feedBerita.slice(0, 2).length === 1 && (
                    <div className="bg-slate-50 rounded-xl border border-dashed border-gray-200 aspect-video flex items-center justify-center text-slate-400 text-xs">
                      Belum ada berita pendamping
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>



          {/* Berita Terbaru & Sidebar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
            {/* Kolom Kiri (Porsi 8 Kolom / 65%) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="section-header border-b border-gray-250 pb-2 flex justify-between items-center">
                <h2 className="section-title text-xl font-black text-slate-900 uppercase tracking-tight">
                  <span className="border-b-4 border-red-650 pb-2">Berita Terbaru</span>
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {feedBerita && feedBerita.slice(2, 9).length > 0 ? (
                  feedBerita.slice(2, 9).map((post) => (
                    <article key={post.id} className="latest-item bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition duration-200">
                      <div className="latest-img-wrapper w-full h-48 sm:w-36 sm:h-24 shrink-0 relative rounded-lg overflow-hidden">
                        {getThumbnail(post) ? (
                          <img src={getThumbnail(post)} alt={post.title} className="latest-img w-full h-full object-cover" />
                        ) : (
                          <div className="latest-img bg-slate-900 flex items-center justify-center text-slate-655 w-full h-full text-xs font-bold">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="latest-content flex-1 flex flex-col justify-between overflow-hidden p-1 sm:p-0">
                        <div>
                          <h3 className="latest-title text-base font-bold text-slate-900 hover:text-[#E30A17] line-clamp-2">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="latest-snippet text-gray-600 text-sm line-clamp-2 mt-1 leading-relaxed">
                            {cleanExcerpt(post.content)}
                          </p>
                        </div>
                        <div className="latest-meta text-xs text-gray-400 mt-2 flex items-center gap-2">
                          <span><i className="fa-regular fa-user text-[#E30A17] mr-1"></i> {post.author || post.penulis || 'Redaksi'}</span>
                          <span>•</span>
                          <span><i className="fa-regular fa-clock text-[#E30A17] mr-1"></i> {formatTimeAgo(post.created_at)} | {post.category}</span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="w-full h-64 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 rounded-xl">
                    Area Daftar Berita Terbaru
                  </div>
                )}
              </div>
            </div>

            {/* Kolom Kanan (Porsi 4 Kolom / 35%) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Terpopuler Widget */}
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
                          <h4 className="text-sm font-bold text-gray-800 hover:text-[#E30A17] line-clamp-2 leading-snug transition-colors">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h4>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {formatTimeAgo(post.created_at)} &bull; {post.category}
                          </span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>



              {/* Slot Iklan 2: Sidebar Kanan Atas */}
              {sidebarTopAd && sidebarTopAd.image && (
                <div className="w-full">
                  <AdSlot size="300x250" className="w-full" ad={sidebarTopAd} />
                </div>
              )}

              {/* Slot Iklan 3: Sidebar Kanan Bawah */}
              {sidebarBottomAd && sidebarBottomAd.image && (
                <div className="w-full">
                  <AdSlot size="300x600" className="w-full" ad={sidebarBottomAd} />
                </div>
              )}
            </div>
          </div>

          {/* Seksi 1: Kriminal Hari Ini (Grid 4 Kartu) */}
          {kriminalNews.length > 0 && (
            <section className="kriminal-section mb-8" id="kriminal-section">
              <div className="section-header border-b border-gray-250 pb-2 mb-4 flex justify-between items-center">
                <h2 className="section-title text-xl font-black text-slate-900 uppercase tracking-tight">
                  <span className="border-b-4 border-red-650 pb-2">Kriminal Hari Ini</span>
                </h2>
                <Link href="/kategori/kriminal" className="text-xs font-bold text-red-600 hover:text-red-750 flex items-center gap-1">
                  Indeks Kriminal <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </div>

              <div className="kriminal-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kriminalNews.slice(0, 4).map((post) => (
                  <article key={post.id} className="politik-card bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                    <div>
                      <div className="politik-img-wrapper aspect-video relative rounded-lg overflow-hidden">
                        {getThumbnail(post) ? (
                          <img src={getThumbnail(post)} alt={post.title} className="politik-img w-full h-full object-cover" />
                        ) : (
                          <div className="politik-img bg-slate-900 flex items-center justify-center text-slate-655 w-full h-full text-xs font-bold">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="politik-content p-4">
                        <span className="crimson-tag text-red-650 text-[10px] font-extrabold uppercase">KRIMINAL</span>
                        <h3 className="politik-title text-sm font-bold text-slate-900 hover:text-red-600 line-clamp-2 mt-1 leading-snug">
                          <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
                          {cleanExcerpt(post.content)}
                        </p>
                      </div>
                    </div>
                    <div className="politik-meta text-xs text-gray-400 px-4 pb-4 pt-2 border-t border-gray-50 mt-2 flex items-center gap-2">
                      <span><i className="fa-regular fa-user text-[#E30A17] mr-1"></i> {post.author || post.penulis || 'Redaksi'}</span>
                      <span>•</span>
                      <span><i className="fa-regular fa-clock text-[#E30A17] mr-1"></i> {formatTimeAgo(post.created_at)}</span>
                    </div>
                  </article>
                ))}
              </div>


            </section>
          )}

          {/* Slot Iklan 4: Tengah-tengah daftar berita */}
          <div className="w-full my-8 flex justify-center">
            <AdSlot size="728x90" className="w-full" ad={middleAd} />
          </div>
        </div>
        {/* Seksi 2: Pojok Video (Carousel Slider Horizontal) */}
        <section className="video-section py-8 !bg-[#0B162C] !text-white" id="video-section">
          <div className="container">
            <div className="section-header border-b border-slate-700 pb-2 mb-6 flex justify-between items-center">
              <h2 className="section-title text-xl font-black !text-white uppercase tracking-tight flex items-center gap-2">
                <i className="fa-solid fa-circle-play text-red-500"></i> Pojok Video
              </h2>
              {/* Carousel Arrows */}
              <div className="editor-controls flex gap-2">
                <button className="carousel-arrow bg-slate-800 hover:bg-red-650 text-slate-300 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm" id="video-prev" aria-label="Sebelumnya" onClick={handlePrevVideo}>
                  <i className="fa-solid fa-chevron-left text-sm"></i>
                </button>
                <button className="carousel-arrow bg-slate-800 hover:bg-red-650 text-slate-300 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm" id="video-next" aria-label="Selanjutnya" onClick={handleNextVideo}>
                  <i className="fa-solid fa-chevron-right text-sm"></i>
                </button>
              </div>
            </div>

            <div className="video-carousel-wrapper overflow-hidden">
              {videos.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-14 px-6 text-center rounded-xl border-2 border-dashed border-slate-700 bg-[#0B162C]/30 gap-3 text-slate-400">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-800 text-red-500">
                    <i className="fa-brands fa-youtube text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-base text-white">Belum ada video tayang</p>
                    <p className="text-sm mt-1 text-slate-400">Tambahkan video dari panel admin untuk ditampilkan di sini.</p>
                  </div>
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
                    <a
                      key={video.id}
                      href={video.link || `https://www.youtube.com/watch?v=${video.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-carousel-card w-[220px] shrink-0 bg-[#0B162C] rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:border-red-500 transition shadow-sm block"
                    >
                      <div className="video-thumb-container h-32 relative">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                          alt={video.judul}
                          className="video-thumb-img-new w-full h-full object-cover"
                        />
                        <div className="video-play-center-btn absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-90 hover:opacity-100 hover:scale-110 transition-all">
                          <i className="fa-solid fa-play text-xl bg-red-650 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"></i>
                        </div>
                      </div>
                      <div className="video-carousel-info p-3">
                        <h4 className="video-carousel-title text-xs font-bold text-white line-clamp-2 leading-snug">{video.judul}</h4>
                        <span className="video-carousel-meta text-[10px] text-slate-400 mt-2 block"><i className="fa-brands fa-youtube text-red-500"></i> YouTube</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Seksi Ekonomi & Bisnis */}
        {ekonomiNews.length > 0 && (
          <div className="container my-8" id="ekonomi-section">
            <div className="section-header border-b border-gray-250 pb-2 mb-4 flex justify-between items-center">
              <h2 className="section-title text-xl font-black text-slate-900 uppercase tracking-tight">
                <span className="border-b-4 border-red-650 pb-2">Ekonomi & Bisnis</span>
              </h2>
              <Link href="/kategori/ekonomi" className="text-xs font-bold text-red-600 hover:text-red-750 flex items-center gap-1">
                Indeks Ekonomi <i className="fa-solid fa-chevron-right"></i>
              </Link>
            </div>

            <div className="ekonomi-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {ekonomiNews.slice(0, 4).map((post) => (
                <article key={post.id} className="ekonomi-item bg-white rounded-xl overflow-hidden shadow-sm border border-gray-155 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition">
                  <div className="ekonomi-img-wrapper w-full h-48 sm:w-36 sm:h-24 shrink-0 relative rounded-lg overflow-hidden">
                    {getThumbnail(post) ? (
                      <img src={getThumbnail(post)} alt={post.title} className="ekonomi-img w-full h-full object-cover" />
                    ) : (
                      <div className="ekonomi-img bg-slate-900 flex items-center justify-center text-slate-655 w-full h-full text-xs font-bold">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="ekonomi-content flex-1 flex flex-col justify-between overflow-hidden p-1 sm:p-0">
                    <div>
                      <h3 className="ekonomi-title text-base font-bold text-slate-900 hover:text-[#E30A17] line-clamp-2">
                        <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="ekonomi-snippet text-gray-600 text-sm line-clamp-2 mt-1 leading-relaxed">{cleanExcerpt(post.content)}</p>
                    </div>
                    <div className="ekonomi-meta text-xs text-gray-400 mt-2 flex items-center gap-2">
                      <span><i className="fa-regular fa-user text-[#E30A17] mr-1"></i> {post.author || post.penulis || 'Redaksi'}</span>
                      <span>•</span>
                      <span><i className="fa-regular fa-clock text-[#E30A17] mr-1"></i> {formatTimeAgo(post.created_at)} | {post.category}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
      {/* Slot Iklan 5: Bagian Atas Footer */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full" ad={footerAd} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
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

    return {
      props: {
        initialCategories: catData || [],
        initialBerita: beritaData || [],
        initialAds: adsData || [],
        initialVideos: videosData || [],
      },
      revalidate: 5,
    };
  } catch (err) {
    console.error('Error in getStaticProps:', err);
    return {
      props: {
        initialCategories: [],
        initialBerita: [],
        initialAds: [],
        initialVideos: [],
      },
      revalidate: 5,
    };
  }
}
