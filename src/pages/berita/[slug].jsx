import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import EmptyState from '@/components/EmptyState';
import NewsGallery from '@/components/NewsGallery';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
const stripHtmlAndEntities = (htmlString) => {
  if (!htmlString) return '';
  // Hapus tag HTML dan ubah &nbsp; menjadi spasi
  return htmlString.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
};

export default function DetailBerita({ berita, categories = [], ads = [], latestBerita = [], popularBerita = [] }) {
  const router = useRouter();
  const { slug } = router.query;

  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const images = (() => {
    if (!berita) return [];
    const imgs = berita.images || berita.image || berita.gambar || berita.gambar_utama_url;
    if (!imgs) return [];
    if (Array.isArray(imgs)) return imgs;
    if (typeof imgs === 'string') {
      try {
        if (imgs.startsWith('[')) {
          return JSON.parse(imgs);
        }
        return [imgs];
      } catch (e) {
        return [imgs];
      }
    }
    return [imgs];
  })();

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
      router.push({ pathname: '/search', query: { q: searchQuery } });
    }
  };

  const headerAd = ads?.find(a => a.position === 'Header' || a.position === 'header');
  const sidebarTopAd = ads?.find(a => a.position === 'Sidebar Atas' || a.position === 'sidebar');
  const sidebarBottomAd = ads?.find(a => a.position === 'Sidebar Bawah');
  const footerAd = ads?.find(a => a.position === 'Footer');

  const cleanHTML = berita && (berita.content || berita.isi)
    ? (berita.content || berita.isi).replace(/&nbsp;/g, ' ')
    : '';

  const ogImgUrl = (() => {
    // Prioritaskan kolom string gambar_utama, baru fallback ke images[0]
    const rawImg = berita?.gambar_utama || images[0];
    if (!rawImg) return 'https://pojoktv.com/logo-pojoktv.png';
    if (rawImg.startsWith('http')) return rawImg;
    
    // Pastikan path relatif memiliki /storage/v1/object/public/
    let path = rawImg;
    if (!path.startsWith('/storage/v1/object/public/') && !path.startsWith('storage/v1/object/public/')) {
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      path = `/storage/v1/object/public/${cleanPath}`;
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhtwymloyulvyctztktd.supabase.co';
    const cleanSupabaseUrl = supabaseUrl.endsWith('/') ? supabaseUrl.slice(0, -1) : supabaseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${cleanSupabaseUrl}${cleanPath}`;
  })();

  if (!berita) {
    return (
      <Layout>
        <Head>
          <title>Berita Tidak Ditemukan - PojokTV</title>
          <link rel="icon" href="/logo-pojoktv.png" />
          <link rel="shortcut icon" href="/logo-pojoktv.png" />
        </Head>
        
        {/* Empty State Tampilan Utama */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center my-12 bg-white max-w-4xl mx-auto p-8 rounded-xl border border-gray-150 shadow-sm">
          <div className="text-gray-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Berita Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Tautan berita ini mungkin telah dipindahkan, dihapus, atau sedang dalam peninjauan redaksi.</p>
          <Link href="/" className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeCategoryName={berita?.category}>
      <Head>
        <title>{(berita.title || berita.judul)} - PojokTV</title>
        <meta name="description" content={berita.ringkasan || stripHtmlAndEntities(berita.isi || berita.content || berita.title || berita.judul).slice(0, 160) || "Berita terbaru dari PojokTV"} />
        <meta name="keywords" content={`${berita.category}, berita ${berita.category}, ${berita.title || berita.judul}, PojokTV`} />
        <link rel="icon" href="/logo-pojoktv.png" />
        <link rel="shortcut icon" href="/logo-pojoktv.png" />
        
        {/* OPEN GRAPH WAJIB UNTUK WHATSAPP */}
        <meta property="og:title" content={berita.title || berita.judul} />
        <meta property="og:description" content={berita.ringkasan || stripHtmlAndEntities(berita.isi || berita.content || berita.title || berita.judul).slice(0, 160) || "Baca selengkapnya di PojokTV"} />
        <meta property="og:image" content={ogImgUrl} />
        <meta property="og:url" content={`https://pojoktv.com/berita/${berita.slug}`} />
        
        {/* TAG ESENSIAL WHATSAPP */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

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
              {berita && (
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
                  <h1 className="text-2xl md:text-3xl font-bold break-words whitespace-normal text-slate-900 leading-tight mb-4">
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
                  <div 
                    className="w-full text-base md:text-lg leading-relaxed text-gray-800 text-left whitespace-pre-wrap break-words [&>p]:mb-5 [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-3 [&>ul]:mb-5 [&>ul]:ml-5 [&>ul]:list-disc [&>ol]:mb-5 [&>ol]:ml-5 [&>ol]:list-decimal"
                    dangerouslySetInnerHTML={{ __html: cleanHTML }} 
                  />

                  {/* Share / Tags section */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <Link href="/" className="text-xs font-bold uppercase text-slate-500 hover:text-red-600 transition duration-200 flex items-center gap-1 flex-shrink-0">
                      &larr; Kembali ke Beranda
                    </Link>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full my-2 flex-nowrap">
                      <span className="text-xs font-bold text-slate-400 uppercase mr-1 flex-shrink-0 hidden lg:inline">Bagikan:</span>
                      
                      {/* Facebook */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank" rel="noreferrer"
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#3b5998] text-white"
                        aria-label="Share Facebook"
                      >
                        <i className="fa-brands fa-facebook-f w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* Twitter / X */}
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent((berita.title || berita.judul))}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank" rel="noreferrer"
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#1da1f2] text-white"
                        aria-label="Share Twitter"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>

                      {/* LinkedIn */}
                      <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(berita.title || berita.judul)}`}
                        target="_blank" rel="noreferrer"
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#0077b5] text-white"
                        aria-label="Share LinkedIn"
                      >
                        <i className="fa-brands fa-linkedin-in w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent((berita.title || berita.judul) + " | Baca selengkapnya di: " + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                        target="_blank" rel="noreferrer"
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#25d366] text-white"
                        aria-label="Share WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:?subject=${encodeURIComponent(berita.title || berita.judul)}&body=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#f26522] text-white"
                        aria-label="Share Email"
                      >
                        <i className="fa-regular fa-envelope w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* Copy Link */}
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Tautan berita berhasil disalin ke clipboard!');
                          }
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-slate-600 text-white cursor-pointer"
                        aria-label="Salin Tautan"
                      >
                        <i className="fa-regular fa-copy w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
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
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  console.log("Mencari parameter:", params.slug);
  const slugParam = String(params.slug || '');

  try {
    // 1. Coba ambil data berdasarkan kolom 'slug' murni
    let { data: mainBerita, error } = await supabase
      .from('berita')
      .select('*')
      .eq('slug', slugParam)
      .single();

    // FALLBACK 1: Jika tidak ketemu, coba cari partial match (ilike) untuk mencocokkan slug tanpa timestamp
    if (!mainBerita || error) {
      try {
        const { data: partialBerita } = await supabase
          .from('berita')
          .select('*')
          .ilike('slug', `${slugParam}%`)
          .limit(1)
          .maybeSingle();
        if (partialBerita) {
          mainBerita = partialBerita;
          error = null;
        }
      } catch (e) {
        console.warn("Partial slug matching failed:", e.message);
      }
    }

    // FALLBACK 2: Jika tidak ketemu, coba ekstrak ID di akhir string slug (jika formatnya judul-berita-12345)
    if (!mainBerita || error) {
      const slugParts = slugParam.split('-');
      const possibleId = slugParts[slugParts.length - 1];
      
      if (possibleId && !isNaN(possibleId) && parseInt(possibleId) < 2147483647) {
        try {
          const { data: fallbackBerita } = await supabase
            .from('berita')
            .select('*')
            .eq('id', parseInt(possibleId))
            .single();
            
          if (fallbackBerita) {
            mainBerita = fallbackBerita;
          }
        } catch (e) {
          console.warn("Fallback ID query failed:", e.message);
        }
      }
    }

    if (mainBerita) {
      // Increment views
      await supabase
        .from('berita')
        .update({ views: (mainBerita.views || 0) + 1 })
        .eq('id', mainBerita.id);
    }

    // 2. Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'Aktif')
      .order('name');

    // 3. Fetch ads
    const { data: ads } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true);

    // 4. Fetch latest news for ticker
    const { data: latestBerita } = await supabase
      .from('berita')
      .select('*')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(5);

    // 5. Fetch popular news for sidebar
    const { data: popularBerita } = await supabase
      .from('berita')
      .select('*')
      .eq('status', 'Published')
      .order('views', { ascending: false })
      .limit(5);

    return {
      props: {
        berita: mainBerita || null,
        categories: categories || [],
        ads: ads || [],
        latestBerita: latestBerita || [],
        popularBerita: popularBerita || [],
      },
    };
  } catch (err) {
    console.error('Error in getServerSideProps:', err);
    return {
      props: {
        berita: null,
        categories: [],
        ads: [],
        latestBerita: [],
        popularBerita: [],
      },
    };
  }
}
