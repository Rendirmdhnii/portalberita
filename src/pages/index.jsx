import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';

// Dummy data for Berita, Video, etc. from index.html/style.css markup
const DUMMY_CATEGORIES = [
  { id: 1, name: 'Berita Utama', slug: 'utama' },
  { id: 2, name: 'Kriminal', slug: 'kriminal' },
  { id: 3, name: 'Politik', slug: 'politik' },
  { id: 4, name: 'Dunia', slug: 'dunia' },
  { id: 5, name: 'Otomotif', slug: 'otomotif' },
  { id: 6, name: 'Olahraga', slug: 'olahraga' },
  { id: 7, name: 'Hiburan', slug: 'hiburan' },
  { id: 8, name: 'Pojok Video', slug: 'video' }
];

const DUMMY_BREAKING_NEWS = [
  { id: 1, title: 'Gunung Merapi Kembali Muntahkan Awan Panas Guguran Sejauh 1,5 Kilometer ke Arah Barat Daya. Masyarakat Diminta Waspada.' },
  { id: 2, title: 'KPK Gelar Operasi Tangkap Tangan di Wilayah Jabodetabek, Lima Orang Pejabat Daerah Resmi Diamankan.' },
  { id: 3, title: 'Nilai Tukar Rupiah Terus Menguat Terhadap Dolar AS Pagi Ini Menembus Rp15.200 per Dolar.' },
  { id: 4, title: 'Persiapan Laga Semifinal Piala Asia U-23: Timnas Indonesia Bersiap Hadapi Arab Saudi Malam Ini.' }
];

const DUMMY_POSTS = [
  {
    id: 1,
    title: 'Rizza Ali Faizin Pimpin DPC PKB Sidoarjo Periode 2026-2031, Targetkan 18 Kursi di Pileg 2029',
    slug: 'rizza-ali-faizin-pimpin-dpc-pkb-sidoarjo-periode-2026-2031',
    category: 'Politik',
    image: 'gusrizal.jpeg',
    author: 'Redaksi PojokTV',
    time: '10 Menit yang Lalu',
    views: 1240
  },
  {
    id: 2,
    title: 'Sindikat Curanmor Mewah Lintas Provinsi Diringkus Polisi di Surabaya',
    slug: 'sindikat-curanmor-mewah-lintas-provinsi-diringkus-polisi',
    category: 'Kriminal',
    type: 'svg_car',
    time: '35 Menit Lalu',
    views: 890
  },
  {
    id: 3,
    title: 'KTT Perubahan Iklim PBB Resmi Dibuka, 120 Negara Bahas Emisi',
    slug: 'ktt-perubahan-iklim-pbb-resmi-dibuka-120-negara-bahas-emisi',
    category: 'Dunia',
    type: 'svg_earth',
    time: '1 Jam Lalu',
    views: 760
  },
  {
    id: 4,
    title: 'Review Lengkap SUV Listrik Nasional Dengan Jarak Tempuh Ekstra Jauh',
    slug: 'review-lengkap-suv-listrik-nasional-jarak-tempuh-ekstra-jauh',
    category: 'Otomotif',
    type: 'svg_auto',
    time: '2 Jam Lalu',
    views: 450
  },
  {
    id: 5,
    title: 'Pemerintah Resmikan Proyek Infrastruktur Tol Baru Penghubung Jatim-Jateng',
    slug: 'pemerintah-resmikan-proyek-infrastruktur-tol-baru-penghubung',
    category: 'Nasional',
    type: 'svg_highway',
    time: '3 Jam Lalu',
    views: 610
  }
];

const DUMMY_KRIMINAL_NEWS = [
  {
    id: 1,
    title: 'Polda Jatim Ringkus Bandar Judi Online Terbesar Lintas Negara di Surabaya',
    slug: 'polda-jatim-ringkus-bandar-judi-online-terbesar-lintas-negara',
    category: 'Kriminal',
    type: 'svg_crime_1',
    time: '1 Jam Lalu'
  },
  {
    id: 2,
    title: 'Polisi Telusuri Aliran Dana Korban Penipuan Berkedok Investasi Emas',
    slug: 'polisi-telusuri-aliran-dana-korban-penipuan-berkedok-investasi-emas',
    category: 'Kriminal',
    type: 'svg_crime_2',
    time: '3 Jam Lalu'
  },
  {
    id: 3,
    title: 'Aksi Curanmor Bersenjata Tajam di Waru Berhasil Digagalkan Warga',
    slug: 'aksi-curanmor-bersenjata-tajam-di-waru-berhasil-digagalkan-warga',
    category: 'Kriminal',
    type: 'svg_crime_3',
    time: '5 Jam Lalu'
  },
  {
    id: 4,
    title: 'Kejaksaan Negeri Sidoarjo Tahan Tersangka Penggelapan Aset Daerah',
    slug: 'kejaksaan-negeri-sidoarjo-tahan-tersangka-penggelapan-aset-daerah',
    category: 'Kriminal',
    type: 'svg_crime_4',
    time: '8 Jam Lalu'
  }
];

const DUMMY_VIDEOS = [
  { id: 1, judul: 'LIVE: Detik-detik Pengesahan Pengurus Baru DPC PKB Sidoarjo', type: 'svg_vid_1', isLive: true },
  { id: 2, judul: 'Eksklusif: Wawancara Khusus Gus Rizza Terkait Porsi Milenial', type: 'svg_vid_2', duration: 'Durasi 12:45' },
  { id: 3, judul: 'Kilas Balik Sejarah Politik PKB di Kabupaten Sidoarjo', type: 'svg_vid_3', duration: 'Durasi 08:30' },
  { id: 4, judul: 'Tanggapan Masyarakat Mengenai Kepemimpinan Baru PKB', type: 'svg_vid_4', duration: 'Durasi 05:15' },
  { id: 5, judul: 'Analisis Politik Sidoarjo Menjelang Kontestasi Pilkada 2026', type: 'svg_vid_5', duration: 'Durasi 10:20' }
];

const DUMMY_EKONOMI = [
  {
    id: 1,
    title: 'Nilai Tukar Rupiah Terus Menguat Terhadap Dolar AS Sentuh Rp15.200',
    slug: 'nilai-tukar-rupiah-terus-menguat-terhadap-dolar-as',
    excerpt: 'Penguatan nilai tukar rupiah didorong oleh masuknya aliran modal asing ke pasar keuangan domestik serta sentimen positif pelaku pasar terhadap stabilitas makroekonomi nasional.',
    category: 'Ekonomi Makro',
    type: 'svg_ekonomi_1',
    time: '2 Jam Lalu'
  },
  {
    id: 2,
    title: 'Sektor UMKM Sidoarjo Mengalami Kenaikan Omzet Signifikan Pasca Kemudahan Izin Usaha',
    slug: 'sektor-umkm-sidoarjo-mengalami-kenaikan-omzet-signifikan',
    excerpt: 'Dinas Koperasi dan UMKM Kabupaten Sidoarjo mencatat pertumbuhan produktivitas usaha mikro mencapai 15 persen berkat penyederhanaan izin usaha dan insentif modal kerja.',
    category: 'UMKM',
    type: 'svg_ekonomi_2',
    time: '5 Jam Lalu'
  },
  {
    id: 3,
    title: 'Pemkab Sidoarjo Gelar Pameran Produk Kreatif Unggulan Ekspor',
    slug: 'pemkab-sidoarjo-gelar-pameran-produk-kreatif-unggulan-ekspor',
    excerpt: 'Pameran ini bertujuan untuk memperkenalkan produk-produk kerajinan lokal ke pasar internasional. Beberapa perwakilan negara sahabat turut diundang dalam acara pembukaan.',
    category: 'Perdagangan',
    type: 'svg_ekonomi_3',
    time: '8 Jam Lalu'
  },
  {
    id: 4,
    title: 'Suku Bunga KPR Naik, Begini Strategi Developer Menarik Minat Konsumen',
    slug: 'suku-bunga-kpr-naik-begini-strategi-developer-menarik',
    excerpt: 'Menghadapi tren kenaikan suku bunga perbankan, sejumlah pengembang properti menawarkan program angsuran langsung ke developer serta subsidi bunga untuk tahun pertama.',
    category: 'Properti',
    type: 'svg_ekonomi_4',
    time: '12 Jam Lalu'
  }
];

const DUMMY_POPULAR = [
  { id: 1, title: 'Viral! Detik-detik Aksi Polantas Selamatkan Balita Hanyut Saat Banjir Bandang' },
  { id: 2, title: 'Harga Logam Mulia Meroket Tajam Tembus Rekor Tertinggi Sepanjang Sejarah' },
  { id: 3, title: 'Jadwal Lengkap Putaran Final Kualifikasi Piala Dunia Zona Asia Minggu Ini' },
  { id: 4, title: 'Panduan Kesehatan: Mengatasi Gejala Varian Flu Singapura Pada Anak' },
  { id: 5, title: 'Berburu Kuliner Legendaris Khas Keraton Yogyakarta yang Wajib Dicoba' }
];

export default function Home() {
  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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
    setVideoIndex((prev) => (prev > 0 ? prev - 1 : DUMMY_VIDEOS.length - 1));
  };

  const handleNextVideo = () => {
    setVideoIndex((prev) => (prev < DUMMY_VIDEOS.length - 1 ? prev + 1 : 0));
  };

  const handlePlayVideo = (title) => {
    alert(`Memutar Video: "${title}" (Simulasi Video Player Overlay)`);
  };

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
              <AdSlot size="468x60" className="h-full py-1 text-[9px]" />
            </div>

            {/* Menu Navigasi Utama */}
            <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`} id="main-navigation">
              <ul className="nav-list">
                <li><Link href="/" className="nav-link active">Berita Utama</Link></li>
                <li><a href="#kriminal-section" className="nav-link">Kriminal</a></li>
                <li><a href="#" className="nav-link">Politik</a></li>
                <li><a href="#" className="nav-link">Dunia</a></li>
                <li><a href="#" className="nav-link">Otomotif</a></li>
                <li><a href="#" className="nav-link">Olahraga</a></li>
                <li><a href="#" className="nav-link">Hiburan</a></li>
                <li><a href="#video-section" className="nav-link">Pojok Video</a></li>
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
              {DUMMY_BREAKING_NEWS.map((news) => (
                <div key={news.id} className="ticker-item">
                  <span className="ticker-bullet">•</span> {news.title}
                </div>
              ))}
              {/* Repeat for marquee loop */}
              {DUMMY_BREAKING_NEWS.map((news) => (
                <div key={`dup-${news.id}`} className="ticker-item">
                  <span className="ticker-bullet">•</span> {news.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Wrapper */}
      <main className="main-wrapper">
        <div className="container">
          {/* 3. Hero Section (Grid Berita Utama Asimetris) */}
          <section className="hero-section">
            <div className="hero-grid">
              {/* Berita Sorotan Utama (Kiri, 65%) */}
              <div className="hero-main">
                <div className="hero-card">
                  <img src="gusrizal.jpeg" alt="Rizza Ali Faizin Pimpin DPC PKB Sidoarjo" className="hero-img" />
                  <div className="gradient-overlay">
                    <span className="tag-badge">Politik</span>
                    <h1 className="hero-title-main">
                      <Link href={`/berita/${DUMMY_POSTS[0].slug}`}>
                        {DUMMY_POSTS[0].title}
                      </Link>
                    </h1>
                    <div className="hero-meta">
                      <span><i className="fa-regular fa-user"></i> {DUMMY_POSTS[0].author}</span>
                      <span>•</span>
                      <span><i className="fa-regular fa-clock"></i> {DUMMY_POSTS[0].time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Berita Pendamping (Kanan, 35% - 4 Stacked Cards) */}
              <div className="hero-side" style={{ gap: '0.75rem' }}>
                {DUMMY_POSTS.slice(1, 5).map((post) => (
                  <div key={post.id} className="hero-side-card" style={{ height: '120px' }}>
                    <div className="side-img-wrapper">
                      {post.type === 'svg_car' && (
                        <svg className="side-img" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="200" fill="#1E293B" />
                          <rect x="10" y="10" width="40" height="15" fill="#D32F2F" />
                          <rect x="250" y="10" width="40" height="15" fill="#3B82F6" />
                          <circle cx="150" cy="100" r="30" fill="none" stroke="#D32F2F" stroke-dasharray="5 5" stroke-width="2" />
                        </svg>
                      )}
                      {post.type === 'svg_earth' && (
                        <svg className="side-img" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="200" fill="#0F172A" />
                          <circle cx="150" cy="100" r="50" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2" />
                        </svg>
                      )}
                      {post.type === 'svg_auto' && (
                        <svg className="side-img" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="200" fill="#334155" />
                          <circle cx="90" cy="140" r="20" fill="#0F172A" />
                          <circle cx="210" cy="140" r="20" fill="#0F172A" />
                        </svg>
                      )}
                      {post.type === 'svg_highway' && (
                        <svg className="side-img" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="200" fill="#1e1b4b" />
                          <polygon points="150,50 200,150 100,150" fill="rgba(255,255,255,0.05)" stroke="#38BDF8" stroke-width="2" />
                        </svg>
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
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Seksi 1: Kriminal Hari Ini (Grid 4 Kartu) */}
          <section className="kriminal-section" id="kriminal-section" style={{ marginBottom: '3rem' }}>
            <div className="section-header">
              <h2 className="section-title crimson-title">Kriminal Hari Ini</h2>
              <a href="#" className="section-link">Indeks Kriminal <i className="fa-solid fa-chevron-right"></i></a>
            </div>

            <div className="kriminal-grid">
              {DUMMY_KRIMINAL_NEWS.map((post) => (
                <article key={post.id} className="politik-card">
                  <div className="politik-img-wrapper">
                    {post.type === 'svg_crime_1' && (
                      <svg className="politik-img" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                        <rect width="300" height="160" fill="#0F172A" />
                        <path d="M 0 110 L 300 140 L 300 150 L 0 120 Z" fill="#EAB308" />
                        <circle cx="120" cy="80" r="20" fill="none" stroke="#64748B" stroke-width="3" />
                        <circle cx="180" cy="80" r="20" fill="none" stroke="#64748B" stroke-width="3" />
                      </svg>
                    )}
                    {post.type === 'svg_crime_2' && (
                      <svg className="politik-img" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                        <rect width="300" height="160" fill="#1E293B" />
                        <rect x="50" y="40" width="200" height="10" rx="3" fill="#D32F2F" opacity="0.6" />
                        <rect x="50" y="60" width="200" height="10" rx="3" fill="#475569" />
                        <rect x="50" y="80" width="140" height="10" rx="3" fill="#475569" />
                      </svg>
                    )}
                    {post.type === 'svg_crime_3' && (
                      <svg className="politik-img" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                        <rect width="300" height="160" fill="#334155" />
                        <circle cx="150" cy="80" r="30" fill="none" stroke="#EF4444" stroke-width="3" />
                        <path d="M 150 65 L 150 95 M 135 80 L 165 80" stroke="#EF4444" stroke-width="3" />
                      </svg>
                    )}
                    {post.type === 'svg_crime_4' && (
                      <svg className="politik-img" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                        <rect width="300" height="160" fill="#1e1b4b" />
                        <rect x="80" y="30" width="140" height="90" rx="4" fill="#312E81" stroke="#4338CA" stroke-width="2" />
                        <text x="150" y="80" fill="#EF4444" fontWeight="bold" fontSize="24" textAnchor="middle">!</text>
                      </svg>
                    )}
                  </div>
                  <div className="politik-content">
                    <span className="crimson-tag" style={{ marginBottom: '0.5rem', display: 'block' }}>KRIMINAL</span>
                    <h3 className="politik-title" style={{ fontSize: '1.05rem', lineHeight: '1.35' }}>
                      <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <div className="politik-meta">
                      <span>{post.time}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Slot Iklan 4: Tengah-tengah daftar berita */}
          <div className="w-full my-8">
            <AdSlot size="728x90" className="h-[90px]" />
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
              <div
                className="video-carousel-inner"
                id="video-carousel-track"
                style={{
                  transform: `translateX(-${videoIndex * 220}px)`,
                  transition: 'transform 0.4s ease'
                }}
              >
                {DUMMY_VIDEOS.map((video) => (
                  <div key={video.id} className="video-carousel-card" onClick={() => handlePlayVideo(video.judul)}>
                    <div className="video-thumb-container">
                      {video.type === 'svg_vid_1' && (
                        <svg className="video-thumb-img-new" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="120" fill="#020617" />
                          <text x="100" y="65" fill="#EF4444" fontFamily="Oswald" fontSize="14" textAnchor="middle" fontWeight="bold">STUDIO 1 LIVE</text>
                        </svg>
                      )}
                      {video.type === 'svg_vid_2' && (
                        <svg className="video-thumb-img-new" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="120" fill="#0b132b" />
                          <circle cx="100" cy="60" r="20" fill="#1e293b" />
                        </svg>
                      )}
                      {video.type === 'svg_vid_3' && (
                        <svg className="video-thumb-img-new" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="120" fill="#1F1A3A" />
                          <rect x="50" y="30" width="100" height="60" fill="#2D2A4A" />
                        </svg>
                      )}
                      {video.type === 'svg_vid_4' && (
                        <svg className="video-thumb-img-new" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="120" fill="#122620" />
                          <ellipse cx="100" cy="60" rx="30" ry="15" fill="#1e3a2b" />
                        </svg>
                      )}
                      {video.type === 'svg_vid_5' && (
                        <svg className="video-thumb-img-new" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="120" fill="#2d0b22" />
                          <polygon points="100,20 130,90 70,90" fill="#4a153b" />
                        </svg>
                      )}
                      <div className="video-play-center-btn">
                        <i className="fa-solid fa-play"></i>
                      </div>
                    </div>
                    <div className="video-carousel-info">
                      <h4 className="video-carousel-title">{video.judul}</h4>
                      {video.isLive ? (
                        <span className="video-carousel-meta"><i className="fa-solid fa-tower-broadcast text-crimson"></i> LIVE TV</span>
                      ) : (
                        <span className="video-carousel-meta"><i className="fa-regular fa-clock"></i> {video.duration}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                {DUMMY_EKONOMI.map((post) => (
                  <article key={post.id} className="ekonomi-item">
                    <div className="ekonomi-img-wrapper">
                      {post.type === 'svg_ekonomi_1' && (
                        <svg className="ekonomi-img" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="120" fill="#0F172A" />
                          <line x1="20" y1="100" x2="60" y2="70" stroke="#10B981" stroke-width="3" />
                          <line x1="60" y1="70" x2="100" y2="80" stroke="#10B981" stroke-width="3" />
                          <line x1="100" y1="80" x2="160" y2="30" stroke="#10B981" stroke-width="4" />
                          <circle cx="160" cy="30" r="5" fill="#10B981" />
                        </svg>
                      )}
                      {post.type === 'svg_ekonomi_2' && (
                        <svg className="ekonomi-img" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="120" fill="#1E293B" />
                          <rect x="40" y="30" width="100" height="60" rx="3" fill="#D32F2F" opacity="0.3" />
                          <circle cx="90" cy="60" r="15" fill="#EF4444" />
                        </svg>
                      )}
                      {post.type === 'svg_ekonomi_3' && (
                        <svg className="ekonomi-img" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="120" fill="#334155" />
                          <polygon points="90,20 140,100 40,100" fill="#EAB308" opacity="0.8" />
                        </svg>
                      )}
                      {post.type === 'svg_ekonomi_4' && (
                        <svg className="ekonomi-img" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="120" fill="#1e1b4b" />
                          <line x1="30" y1="30" x2="150" y2="90" stroke="#EF4444" stroke-width="4" />
                          <line x1="30" y1="90" x2="150" y2="30" stroke="#EF4444" stroke-width="4" />
                        </svg>
                      )}
                    </div>
                    <div className="ekonomi-content">
                      <div>
                        <h3 className="ekonomi-title">
                          <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="ekonomi-snippet">{post.excerpt}</p>
                      </div>
                      <div className="ekonomi-meta">
                        <span>{post.time} | {post.category}</span>
                      </div>
                    </div>
                  </article>
                ))}
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
                    {DUMMY_POPULAR.map((post, idx) => (
                      <li key={idx} className="popular-item">
                        <span className="popular-number">{String(idx + 1).padStart(2, '0')}</span>
                        <div className="popular-content">
                          <h4 className="popular-title">
                            <a href="#">{post.title}</a>
                          </h4>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slot Iklan 2: Sidebar Kanan Atas */}
                <AdSlot size="300x250" className="w-full h-[250px]" />

                {/* Slot Iklan 3: Sidebar Kanan Bawah */}
                <AdSlot size="300x600" className="w-full h-[500px]" />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Slot Iklan 5: Bagian Atas Footer */}
      <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
        <AdSlot size="970x250" className="w-full max-w-[970px] h-[200px]" />
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
                <a href="#kriminal-section">Kriminal</a>
                <a href="#">Politik</a>
                <a href="#">Dunia</a>
                <a href="#">Otomotif</a>
                <a href="#video-section">Pojok Video</a>
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
              <Link href="/admin/login" className="text-red-500 hover:text-red-400 font-bold ml-2">Login Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
