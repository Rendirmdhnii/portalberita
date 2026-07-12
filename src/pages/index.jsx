import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// DUMMY DATA FOR FALLBACK
const DUMMY_CATEGORIES = [
  { id: 1, name: 'Pemerintahan', slug: 'pemerintahan', status: 'Aktif' },
  { id: 2, name: 'Politik', slug: 'politik', status: 'Aktif' },
  { id: 3, name: 'Hukum', slug: 'hukum', status: 'Aktif' },
  { id: 4, name: 'Sosial Budaya', slug: 'sosial-budaya', status: 'Aktif' },
  { id: 5, name: 'Pendidikan', slug: 'pendidikan', status: 'Aktif' },
  { id: 6, name: 'Ekonomi', slug: 'ekonomi', status: 'Aktif' },
  { id: 7, name: 'Olah Raga', slug: 'olah-raga', status: 'Aktif' },
  { id: 8, name: 'Kesehatan', slug: 'kesehatan', status: 'Aktif' }
];

const DUMMY_BREAKING_NEWS = [
  { id: 1, title: 'Sidang Paripurna DPR RI Membahas Rancangan Undang-Undang APBN 2027.' },
  { id: 2, title: 'Kenaikan Harga Sembako di Pasar Tradisional Menjelang Hari Raya Keagamaan.' },
  { id: 3, title: 'Tim Nasional Indonesia Bersiap Menghadapi Laga Krusial Kualifikasi Piala Dunia.' },
  { id: 4, title: 'Inovasi Teknologi AI Terbaru Siap Diluncurkan Oleh Startup Anak Bangsa Bulan Depan.' }
];

const DUMMY_POSTS = [
  {
    id: 1,
    title: 'Gubernur Resmikan Proyek Infrastruktur Jalan Baru Sepanjang 50 KM di Jawa Timur',
    slug: 'gubernur-resmikan-proyek-infrastruktur-jalan-baru',
    category: 'Pemerintahan',
    content: 'Surabaya - Gubernur Jawa Timur hari ini meresmikan proyek jalan tol baru yang menghubungkan beberapa kabupaten kunci guna mempercepat pertumbuhan ekonomi regional dan mengurangi kemacetan jalur darat.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    author: 'Admin Redaksi',
    views: 1250,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Analisis Peta Koalisi Partai Politik Menjelang Pilkada Serentak Tahun Depan',
    slug: 'analisis-peta-koalisi-partai-politik-menjelang-pilkada',
    category: 'Politik',
    content: 'Jakarta - Pengamat politik memprediksi adanya pergeseran peta koalisi partai besar seiring munculnya nama-nama baru dalam bursa calon pemimpin daerah potensial.',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
    author: 'Tim Redaksi',
    views: 980,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Sidang Kasus Sengketa Lahan Masuki Babak Akhir di Pengadilan Negeri Sidoarjo',
    slug: 'sidang-kasus-sengketa-lahan-masuki-babak-akhir',
    category: 'Hukum',
    content: 'Sidoarjo - Majelis hakim dijadwalkan membacakan putusan sengketa lahan pemukiman warga seluas 10 hektar pada pekan depan setelah memeriksa puluhan saksi ahli.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    author: 'Tim Hukum',
    views: 740,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Pesta Kesenian Rakyat Menampilkan Keindahan Budaya Nusantara Tradisional',
    slug: 'pesta-kesenian-rakyat-menampilkan-keindahan-budaya',
    category: 'Sosial Budaya',
    content: 'Yogyakarta - Ribuan seniman dari berbagai provinsi berkumpul memamerkan tarian adat, alat musik tradisional, dan kuliner khas daerah dalam festival budaya tahunan.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
    author: 'Yogyakarta Info',
    views: 650,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Peluncuran Kurikulum Baru untuk Meningkatkan Kemampuan Literasi Digital Siswa',
    slug: 'peluncuran-kurikulum-baru-meningkatkan-literasi-digital',
    category: 'Pendidikan',
    content: 'Jakarta - Kementerian Pendidikan resmi menguji coba program pembelajaran berbasis digital terintegrasi untuk sekolah menengah di seluruh Indonesia.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    author: 'Admin Redaksi',
    views: 520,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: 'Perkembangan Ekonomi Kreatif Semakin Menjanjikan Bagi Wirausaha Muda',
    slug: 'perkembangan-ekonomi-kreatif-semakin-menjanjikan',
    category: 'Ekonomi',
    content: 'Pertumbuhan UMKM berbasis digital dilaporkan melesat hingga 20% dalam kuartal terakhir, didorong oleh platform e-commerce dan inovasi pemasaran konten.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    author: 'Redaksi Ekonomi',
    views: 890,
    created_at: new Date().toISOString()
  }
];

const DUMMY_VIDEOS = [
  { id: 1, judul: 'Liputan Khusus: Pembangunan Infrastruktur Jawa Timur', youtube_id: 'dQw4w9WgXcQ' },
  { id: 2, judul: 'Wawancara Eksklusif Bersama Tokoh Politik Nasional', youtube_id: 'dQw4w9WgXcQ' },
  { id: 3, judul: 'Dokumenter: Keindahan Seni Tradisional Indonesia', youtube_id: 'dQw4w9WgXcQ' },
  { id: 4, judul: 'Tips Menjaga Kesehatan Tubuh di Era Digital', youtube_id: 'dQw4w9WgXcQ' }
];

export default function Home({
  posts = DUMMY_POSTS,
  videos = DUMMY_VIDEOS,
  headlines = [],
  categories = DUMMY_CATEGORIES,
  ads = [],
  breakingNews = DUMMY_BREAKING_NEWS
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayPosts = posts && posts.length > 0 ? posts : DUMMY_POSTS;
  const displayVideos = videos && videos.length > 0 ? videos : DUMMY_VIDEOS;
  const displayCategories = categories && categories.length > 0 ? categories : DUMMY_CATEGORIES;
  const displayBreakingNews = breakingNews && breakingNews.length > 0 ? breakingNews : DUMMY_BREAKING_NEWS;
  const actualHeadlines = headlines && headlines.length > 0 ? headlines : displayPosts.slice(0, 5);

  const sidebarAdAtas = ads?.find(ad => ad.position === 'Sidebar Atas' || ad.position === 'Sidebar (300x250)' || ad.position === 'sidebar');
  const sidebarAdBawah = ads?.find(ad => ad.position === 'Sidebar Bawah');
  const tengahKontenAd = ads?.find(ad => ad.position === 'Tengah Konten');
  const headerAd = ads?.find(ad => ad.position === 'Header' || ad.position === 'Header (728x90)' || ad.position === 'header');
  const footerAd = ads?.find(ad => ad.position === 'Footer' || ad.position === 'Footer (970x250)' || ad.position === 'footer');

  useEffect(() => {
    if (actualHeadlines && actualHeadlines.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === actualHeadlines.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [actualHeadlines]);

  useEffect(() => {
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

  const authorDisplay = (author) =>
    author === 'Superadmin' || author === 'superadmin' ? 'Tim Redaksi PojokTV' : (author || 'Tim Redaksi PojokTV');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
      <Head>
        <title>Berita Terkini & Terpercaya - PojokTV.com</title>
        <meta name="description" content="PojokTV.com - Portal berita terkini, terpercaya, dan independen. Berita nasional, politik, ekonomi, dan lebih banyak lagi." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* 1. NAVBAR */}
      <div className="w-full font-sans">
        {/* Top Bar Hitam */}
        <div className="bg-gray-900 text-gray-300 text-[10px] sm:text-xs py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 relative z-[9000]">
          <div className="flex gap-2 sm:gap-4 flex-wrap justify-center font-bold">
            <span>{currentDate} | {currentTime}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-red-500 font-bold hidden sm:inline">TRENDING:</span>
            {displayCategories.slice(0, 3).map(cat => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="text-gray-300 hover:text-white font-bold tracking-widest hidden sm:inline text-[10px] sm:text-xs cursor-pointer"
              >
                #{cat.name.replace(/\s+/g, '')}
              </Link>
            ))}
            <div className="flex gap-3 items-center md:border-l border-gray-700 md:pl-4">
              <i className="fa-brands fa-facebook hover:text-white cursor-pointer hidden sm:block"></i>
              <i className="fa-brands fa-instagram hover:text-white cursor-pointer hidden sm:block"></i>
              <i className="fa-brands fa-youtube hover:text-white cursor-pointer hidden sm:block"></i>
              <i className="fa-brands fa-tiktok hover:text-white cursor-pointer hidden sm:block"></i>
              <Link
                href="/login"
                className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-[11px] uppercase font-bold transition-colors shadow-sm relative z-50 inline-flex items-center gap-1"
              >
                LOGIN
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header & Navigation */}
        <header className="main-header relative">
          {/* Baris 1: Logo & Utility */}
          <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
            <Link href="/" className="logo w-48 flex-shrink-0">
              Pojok<span>TV.com</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:block search-box relative">
                <input
                  type="text"
                  placeholder="Cari berita..."
                  className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-xs w-[180px] focus:outline-none focus:border-red-500"
                  id="search-bar"
                />
              </div>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-700"
                onClick={() => alert('Menghubungkan ke Siaran Live Streaming PojokTV...')}
              >
                LIVE TV
              </button>
              {/* Hamburger mobile */}
              <button
                className="md:hidden text-gray-800 p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Baris 2: Navigasi Rubrik */}
          <nav className="flex overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-gray-200 bg-white py-3 px-2 w-full items-center gap-2">
            <Link href="/" className="px-4 text-xs font-black uppercase text-red-600 hover:text-red-700 transition-colors">
              Utama
            </Link>
            {displayCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/kategori/${cat.slug}`}
                className="px-4 text-xs font-black uppercase text-gray-800 hover:text-red-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
              {displayCategories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/kategori/${cat.slug}`}
                  className="block py-2 text-sm font-bold uppercase text-gray-800 hover:text-red-600 border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Breaking News Ticker */}
          <div className="ticker-bar">
            <div className="ticker-label bg-red-600 text-white font-bold uppercase text-xs px-3">
              BREAKING NEWS
            </div>
            <div className="ticker-content">
              <div className="ticker-track" id="breaking-ticker">
                {displayBreakingNews.map((news) => (
                  <div key={news.id} className="ticker-item">
                    <span className="ticker-bullet">•</span> {news.title}
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {displayBreakingNews.map((news) => (
                  <div key={`dup-${news.id}`} className="ticker-item">
                    <span className="ticker-bullet">•</span> {news.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Header Ad Placement */}
      <div className="w-full px-4 sm:px-0 my-6 flex justify-center">
        {headerAd ? (
          <a
            href={headerAd.link && headerAd.link !== '-' ? headerAd.link : '#'}
            target="_blank"
            rel="noreferrer"
            className="block w-full max-w-[728px] aspect-[8/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200"
          >
            <img src={headerAd.image} alt={headerAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
          </a>
        ) : (
          <div className="bg-gray-100 text-center py-6 text-gray-400 text-xs w-full max-w-[728px] aspect-[8/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            [ Slot Iklan Header (Banner) 728x90 ]
          </div>
        )}
      </div>

      {/* Headline Slider */}
      {actualHeadlines && actualHeadlines.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-4">
          <div className="relative w-full h-[250px] md:h-[450px] rounded-xl overflow-hidden shadow-lg group">
            {actualHeadlines.map((post, index) => (
              <Link
                href={`/berita/${post.slug}`}
                key={post.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img
                  src={post.image ? (post.image.startsWith('http') ? post.image : `/storage/${post.image}`) : '/placeholder-news.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                  <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase mb-3">
                    {post.category || 'Berita Utama'}
                  </span>
                  <h2 className="text-white text-xl md:text-4xl font-bold leading-tight hover:text-red-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 text-xs md:text-sm mt-2 flex items-center gap-2">
                    <span>Diterbitkan: {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{(post.views || 0).toLocaleString('id-ID')} Kali Dibaca</span>
                  </p>
                </div>
              </Link>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              {actualHeadlines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${index === currentSlide ? 'bg-red-600 w-6' : 'bg-white/50 hover:bg-white w-2.5'}`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <main className="main-wrapper">
        <div className="container">

          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-grid">
              {/* Berita Utama Kiri */}
              <div className="hero-main">
                <div className="hero-card">
                  {displayPosts[0].image ? (
                    <img
                      src={displayPosts[0].image.startsWith('http') ? displayPosts[0].image : `/storage/${displayPosts[0].image}`}
                      alt={displayPosts[0].title}
                      className="hero-img"
                    />
                  ) : (
                    <div className="hero-img bg-slate-800 flex items-center justify-center">
                      <i className="fa-solid fa-newspaper text-white/10 text-6xl"></i>
                    </div>
                  )}
                  <div className="gradient-overlay">
                    <span className="tag-badge">{displayPosts[0].category}</span>
                    <h1 className="hero-title-main">
                      <Link href={`/berita/${displayPosts[0].slug}`}>{displayPosts[0].title}</Link>
                    </h1>
                    <div className="hero-meta">
                      <span>{authorDisplay(displayPosts[0].author)}</span>
                      <span>•</span>
                      <span>Baru Saja</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Berita Pendamping Kanan */}
              {displayPosts.length > 1 && (
                <div className="hero-side" style={{ gap: '0.75rem' }}>
                  {displayPosts.slice(1, 5).map((post) => (
                    <div key={post.id} className="hero-side-card" style={{ height: '120px' }}>
                      <div className="side-img-wrapper">
                        {post.image ? (
                          <img
                            src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                            alt={post.title}
                            className="side-img"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        ) : (
                          <div className="side-img bg-slate-800 w-full h-full flex items-center justify-center">
                            <span className="text-[10px] text-white/20 font-bold">POJOKTV</span>
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
                          <span>{authorDisplay(post.author)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Berita Terbaru Grid */}
          <section className="kriminal-section" id="kriminal-section" style={{ marginBottom: '3rem' }}>
            <div className="section-header">
              <h2 className="section-title crimson-title">Berita Terbaru</h2>
              <Link href="#" className="section-link">Lihat Semua <i className="fa-solid fa-chevron-right"></i></Link>
            </div>
            <div className="kriminal-grid">
              {displayPosts.slice(1, 5).map((post) => (
                <article key={post.id} className="politik-card">
                  <div className="politik-img-wrapper">
                    {post.image ? (
                      <img
                        src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                        alt={post.title}
                        className="politik-img"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="politik-img bg-slate-800 w-full h-full flex items-center justify-center">
                        <span className="text-white/10 text-xs">POJOKTV</span>
                      </div>
                    )}
                  </div>
                  <div className="politik-content">
                    <span className="crimson-tag" style={{ marginBottom: '0.5rem', display: 'block' }}>{post.category?.toUpperCase()}</span>
                    <h3 className="politik-title" style={{ fontSize: '1.05rem', lineHeight: '1.35' }}>
                      <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <div className="politik-meta">
                      <span>{authorDisplay(post.author)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Tengah Konten Ad */}
          <div className="w-full px-4 sm:px-0 my-6 flex justify-center">
            {tengahKontenAd ? (
              <a href={tengahKontenAd.link && tengahKontenAd.link !== '-' ? tengahKontenAd.link : '#'} target="_blank" rel="noreferrer"
                className="block w-full max-w-[728px] aspect-[8/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <img src={tengahKontenAd.image} alt={tengahKontenAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
              </a>
            ) : (
              <div className="bg-gray-100 text-center py-6 text-gray-400 text-xs w-full max-w-[728px] aspect-[8/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                [ Slot Iklan Tengah Konten (Banner) 728x90 ]
              </div>
            )}
          </div>

        </div>

        {/* Video Section */}
        {displayVideos && displayVideos.length > 0 && (
          <section className="video-section py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white rounded-lg my-8" id="video-section">
            <div className="max-w-7xl mx-auto">
              <div className="section-header border-b border-gray-800 pb-3 mb-6">
                <h2 className="section-title text-xl font-bold flex items-center gap-2">
                  <i className="fa-solid fa-circle-play text-red-600"></i> Pojok Video
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {displayVideos.map((video) => (
                  <div key={video.id} className="video-card">
                    <div className="aspect-video w-full rounded overflow-hidden shadow-lg bg-black">
                      <iframe
                        className="w-full h-[180px]"
                        src={`https://www.youtube.com/embed/${video.youtube_id}`}
                        title={video.judul}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <h3 className="text-white font-bold text-sm mt-3 leading-tight">{video.judul}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Berita Lainnya + Sidebar */}
        <div className="container">
          <div className="content-grid">

            {/* Kolom Kiri */}
            <div className="content-left" id="ekonomi-section">
              <div className="section-header">
                <h2 className="section-title">Berita Lainnya</h2>
                <Link href="#" className="section-link">Lihat Semua <i className="fa-solid fa-chevron-right"></i></Link>
              </div>
              <div className="ekonomi-grid">
                {displayPosts.slice(2, 6).map((post) => (
                  <article key={post.id} className="ekonomi-item">
                    <div className="ekonomi-img-wrapper">
                      {post.image ? (
                        <img
                          src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                          alt={post.title}
                          className="ekonomi-img"
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      ) : (
                        <div className="ekonomi-img bg-slate-800 w-full h-full flex items-center justify-center">
                          <span className="text-white/10 text-xs">POJOKTV</span>
                        </div>
                      )}
                    </div>
                    <div className="ekonomi-content">
                      <div>
                        <h3 className="ekonomi-title">
                          <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="ekonomi-snippet">
                          {post.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                      </div>
                      <div className="ekonomi-meta">
                        <span>{authorDisplay(post.author)} | {post.category}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar Kanan */}
            <aside className="sidebar-wrapper">
              <div className="sidebar-sticky">

                {/* Sidebar Atas Ad */}
                <div className="w-full my-6 flex justify-center">
                  {sidebarAdAtas ? (
                    <a href={sidebarAdAtas.link && sidebarAdAtas.link !== '-' ? sidebarAdAtas.link : '#'} target="_blank" rel="noreferrer"
                      className="block w-full max-w-[300px] aspect-[6/5] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                      <img src={sidebarAdAtas.image} alt={sidebarAdAtas.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                    </a>
                  ) : (
                    <div className="bg-[#1a202c] text-center flex flex-col justify-center w-full max-w-[300px] aspect-[6/5] rounded-lg text-white p-4">
                      <p className="text-[10px] text-gray-400 mb-2">ADVERTISEMENT</p>
                      <p className="font-bold">POJOKTV AD NETWORK</p>
                      <p className="text-xs text-gray-400">Sidebar Atas 300 x 250</p>
                    </div>
                  )}
                </div>

                {/* Terpopuler */}
                <div className="sidebar-widget" id="popular-widget">
                  <div className="section-header">
                    <h2 className="section-title">Terpopuler</h2>
                  </div>
                  <ul className="popular-list">
                    {[...displayPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((post, index) => (
                      <li key={post.id} className="popular-item">
                        <span className="popular-number">{String(index + 1).padStart(2, '0')}</span>
                        <div className="popular-content">
                          <h4 className="popular-title">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h4>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sidebar Bawah Ad */}
                <div className="w-full my-6 flex justify-center">
                  {sidebarAdBawah ? (
                    <a href={sidebarAdBawah.link && sidebarAdBawah.link !== '-' ? sidebarAdBawah.link : '#'} target="_blank" rel="noreferrer"
                      className="block w-full max-w-[300px] aspect-[1/2] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                      <img src={sidebarAdBawah.image} alt={sidebarAdBawah.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                    </a>
                  ) : (
                    <div className="bg-[#1a202c] text-center flex flex-col justify-center w-full max-w-[300px] aspect-[1/2] rounded-lg text-white p-4">
                      <p className="text-[10px] text-gray-400 mb-2">ADVERTISEMENT</p>
                      <p className="font-bold">POJOKTV AD NETWORK</p>
                      <p className="text-xs text-gray-400">Sidebar Bawah 300 x 600</p>
                    </div>
                  )}
                </div>

              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer Ad Placement */}
      <div className="w-full px-4 sm:px-0 my-8 flex justify-center border-t border-gray-100 pt-8">
        {footerAd ? (
          <a
            href={footerAd.link && footerAd.link !== '-' ? footerAd.link : '#'}
            target="_blank"
            rel="noreferrer"
            className="block w-full max-w-[970px] aspect-[4/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200"
          >
            <img src={footerAd.image} alt={footerAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
          </a>
        ) : (
          <div className="bg-gray-100 text-center py-12 text-gray-400 text-xs w-full max-w-[970px] aspect-[4/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            [ Slot Iklan Footer (Banner) 970x250 ]
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
            {/* Kolom 1: Logo & Tentang */}
            <div className="footer-col">
              <div className="footer-about-logo">
                PojokTV<span>.com</span>
              </div>
              <p className="footer-about-text">
                PojokTV.com adalah portal berita digital yang berdedikasi menghadirkan jurnalisme berwibawa, independen, dan terpercaya. <em>&quot;Tajam, Terpercaya, Terkini.&quot;</em>
              </p>
              <div className="social-icons" style={{ marginTop: '0.5rem' }}>
                <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
                <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
              </div>
            </div>

            {/* Kolom 2: Kategori */}
            <div className="footer-col">
              <h4 className="footer-col-title">Kategori</h4>
              <div className="footer-links">
                <Link href="/kategori/pemerintahan">Pemerintahan</Link>
                <Link href="/kategori/politik">Politik</Link>
                <Link href="/kategori/hukum">Hukum</Link>
                <Link href="/kategori/sosial-budaya">Sosial Budaya</Link>
                <Link href="/kategori/pendidikan">Pendidikan</Link>
                <Link href="/kategori/ekonomi">Ekonomi</Link>
                <Link href="/kategori/olah-raga">Olah Raga</Link>
                <Link href="/kategori/kesehatan">Kesehatan</Link>
              </div>
            </div>

            {/* Kolom 3: Redaksi & Kontak */}
            <div className="footer-col">
              <h4 className="footer-col-title">Hubungi Kami</h4>
              <div className="footer-links">
                <div className="footer-contact-item">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Perum Citra Oma Pesona Blok E3/25, RT 37/RW 07, Desa Sidokepung, Kecamatan Buduran, Sidoarjo, Jawa Timur.</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-brands fa-whatsapp"></i>
                  <a href="https://wa.me/6281331160799" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>0813-3116-0799</a>
                </div>
                <div className="footer-contact-item">
                  <i className="fa-solid fa-envelope"></i>
                  <a href="mailto:redaksi@pojoktv.com" style={{ color: 'inherit' }}>redaksi@pojoktv.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} pojoktv.com. Jaringan Berita Nasional Terpercaya. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="footer-bottom-links">
              <Link href="/tentang-kami">Tentang Kami</Link>
              <Link href="/pedoman-media">Pedoman Media Siber</Link>
              <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
              <Link href="/ketentuan-layanan">Ketentuan Layanan</Link>
              <Link href="/struktur-redaksi">Struktur Redaksi</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Server-side data fetching helper (Supports Supabase API connection)
export async function getServerSideProps() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
      return { props: { posts: DUMMY_POSTS, videos: DUMMY_VIDEOS, headlines: DUMMY_POSTS.slice(0, 5), categories: DUMMY_CATEGORIES, ads: [], breakingNews: DUMMY_BREAKING_NEWS } };
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const [
      { data: posts },
      { data: videos },
      { data: categories },
      { data: ads },
    ] = await Promise.all([
      supabase.from('posts').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(20),
      supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(8),
      supabase.from('categories').select('*').eq('status', 'Aktif').order('name'),
      supabase.from('ads').select('*').eq('is_active', true),
    ]);

    const headlines = (posts || []).slice(0, 5);
    const breakingNews = (posts || []).slice(0, 5);

    return {
      props: {
        posts: posts && posts.length > 0 ? posts : DUMMY_POSTS,
        videos: videos && videos.length > 0 ? videos : DUMMY_VIDEOS,
        headlines: headlines && headlines.length > 0 ? headlines : DUMMY_POSTS.slice(0, 5),
        categories: categories && categories.length > 0 ? categories : DUMMY_CATEGORIES,
        ads: ads || [],
        breakingNews: breakingNews && breakingNews.length > 0 ? breakingNews : DUMMY_BREAKING_NEWS,
      },
    };
  } catch (error) {
    console.error('Supabase fetch error, fallback to dummy:', error);
    return {
      props: {
        posts: DUMMY_POSTS,
        videos: DUMMY_VIDEOS,
        headlines: DUMMY_POSTS.slice(0, 5),
        categories: DUMMY_CATEGORIES,
        ads: [],
        breakingNews: DUMMY_BREAKING_NEWS,
      }
    };
  }
}
