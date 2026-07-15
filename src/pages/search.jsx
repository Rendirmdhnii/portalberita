import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdSlot from '@/components/AdSlot';
import BreakingNews from '@/components/BreakingNews';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
const stripHtmlAndEntities = (htmlString) => {
  if (!htmlString) return '';
  // Hapus tag HTML dan ubah &nbsp; menjadi spasi
  return htmlString.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
};

export default function SearchPage() {
  const router = useRouter();
  const q = router.query.q || '';

  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic States from Supabase
  const [categories, setCategories] = useState([]);
  const [berita, setBerita] = useState([]);
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

      // 3. Fetch berita matching the search query q
      const currentQuery = router.query.q;
      if (currentQuery && currentQuery.trim() !== '') {
        const { data: beritaData } = await supabase
          .from('berita')
          .select('*')
          .eq('status', 'Published')
          .or(`title.ilike.%${currentQuery}%,content.ilike.%${currentQuery}%`)
          .order('created_at', { ascending: false });
        
        setBerita(beritaData || []);
      } else {
        setBerita([]);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
      if (router.query.q) {
        setSearchQuery(router.query.q);
      }
    }
  }, [router.isReady, router.query.q]);

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
    alert("Menghubungkan ke Siaran Live Streaming PojokTV... (Siaran Berjalan Lancar)");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push({ pathname: '/search', query: { q: searchQuery } });
    }
  };

  const headerAd = ads?.find(a => a.position === 'Header' || a.position === 'header');
  const sidebarTopAd = ads?.find(a => a.position === 'Sidebar Atas' || a.position === 'sidebar');
  const sidebarBottomAd = ads?.find(a => a.position === 'Sidebar Bawah');
  const footerAd = ads?.find(a => a.position === 'Footer');

  return (
    <div className="w-full bg-gray-50 min-h-screen text-slate-800 font-sans overflow-x-hidden">
      <Head>
        <title>{q ? `Hasil Pencarian: "${q}" - PojokTV.com` : 'Pencarian Berita - PojokTV.com'}</title>
        <meta name="description" content="Hasil pencarian berita terkini dan terpercaya di PojokTV.com." />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>

      {/* 1. Header & Navigasi */}
      <Header />
      <BreakingNews />

      {/* Header Ad */}
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
        <div className="container mx-auto px-4">
          {/* Breadcrumb + Search Header */}
          <div className="mb-6">
            <nav className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Link href="/" className="hover:text-red-600 transition-colors">Beranda</Link>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
              <span className="text-slate-500">Pencarian</span>
              {q && (
                <>
                  <i className="fa-solid fa-chevron-right text-[9px]"></i>
                  <span className="text-red-600 font-semibold">"{q}"</span>
                </>
              )}
            </nav>
            <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight leading-none">
              {q ? `Hasil Pencarian: "${q}"` : 'Pencarian Berita'}
            </h1>
            <div className="border-b-4 border-red-600 w-16 mt-2 mb-0"></div>
          </div>

          <div className="content-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grid Berita (Kiri - 70%) */}
            <div className="content-left lg:col-span-2">
              {loading ? (
                <div className="text-center py-20 text-gray-400 font-bold">
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>Memuat hasil pencarian...
                </div>
              ) : berita.length === 0 ? (
                /* Empty State UI */
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-150 p-6 md:p-12">
                  {/* Ikon Kaca Pembesar */}
                  <svg className="w-20 h-20 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  
                  {/* Judul */}
                  <h2 className="text-2xl font-bold text-slate-800 mt-4 text-center">Pencarian Tidak Ditemukan</h2>
                  
                  {/* Deskripsi */}
                  <p className="text-slate-500 mt-2 text-center max-w-md">
                    Maaf, kami tidak menemukan berita yang cocok dengan kata kunci <strong>"{q}"</strong>.
                  </p>

                  {/* Solusi & Saran */}
                  <div className="mt-6 text-left max-w-sm w-full bg-slate-50 p-5 rounded-xl border border-slate-150">
                    <span className="font-semibold text-slate-700 text-sm">Saran pencarian:</span>
                    <ul className="list-disc text-slate-500 text-sm mt-3 ml-4 space-y-1">
                      <li>Pastikan ejaan kata kunci sudah benar.</li>
                      <li>Coba gunakan kata kunci yang lebih umum.</li>
                      <li>Cari berdasarkan kategori berita di menu atas.</li>
                    </ul>
                  </div>

                  {/* Tombol Aksi */}
                  <Link href="/" className="mt-8 bg-[#E30A17] text-white px-6 py-2.5 rounded-md hover:bg-red-700 transition-colors font-bold shadow-sm">
                    Kembali ke Beranda
                  </Link>
                </div>
              ) : (
                /* Search Results List */
                <div className="flex flex-col gap-4">
                  {berita.map((post) => (
                    <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-150 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition duration-200">
                      <div className="w-full h-48 sm:w-36 sm:h-24 shrink-0 relative rounded-lg overflow-hidden bg-slate-900">
                        {getThumbnail(post) ? (
                          <img src={getThumbnail(post)} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center text-slate-655 font-bold text-sm w-full h-full">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between overflow-hidden p-1 sm:p-0">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 hover:text-[#E30A17] line-clamp-2">
                            <Link href={`/berita/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                            {stripHtmlAndEntities(post.content).slice(0, 120)}...
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-2">
                          <span>{formatTimeAgo(post.created_at)}</span>
                          <span>•</span>
                          <span className="font-semibold text-red-600">{post.category}</span>
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
                {sidebarTopAd && sidebarTopAd.image && (
                  <div className="w-full">
                    <AdSlot size="300x250" className="w-full" ad={sidebarTopAd} />
                  </div>
                )}

                {/* Slot Iklan 3 */}
                {sidebarBottomAd && sidebarBottomAd.image && (
                  <div className="w-full">
                    <AdSlot size="300x600" className="w-full" ad={sidebarBottomAd} />
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer Ad */}
      {footerAd && footerAd.image && (
        <div className="max-w-7xl mx-auto px-4 my-8 w-full flex justify-center">
          <AdSlot size="970x250" className="w-full" ad={footerAd} />
        </div>
      )}

      <Footer categories={categories} />
    </div>
  );
}
