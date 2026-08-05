import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import EmptyState from '@/components/EmptyState';
import NewsGallery from '@/components/NewsGallery';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { imageKitLoader, transformHtmlImageUrls } from '@/lib/imageKitLoader';
const stripHtmlAndEntities = (htmlString) => {
  if (!htmlString) return '';
  // Ganti tag HTML dengan spasi agar kata antar paragraf tidak menempel
  return htmlString
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};


/**
 * Helper to generate clean, branded meta description starting with 'PojokTV.com - '
 */
export function getNewsDescription(berita) {
  const prefix = 'PojokTV.com - ';
  let rawDesc = '';

  if (berita?.description && berita.description.trim()) {
    rawDesc = stripHtmlAndEntities(berita.description);
  } else {
    rawDesc = stripHtmlAndEntities(berita?.content || berita?.isi || '');
  }

  if (rawDesc) {
    if (rawDesc.startsWith(prefix)) {
      rawDesc = rawDesc.substring(prefix.length).trim();
    }
    const truncated = rawDesc.length > 145 ? rawDesc.substring(0, 145).trim() + '...' : rawDesc;
    return `${prefix}${truncated}`;
  }

  return `${prefix}Baca berita selengkapnya di portal berita nasional PojokTV.com`;
}

/**
 * Helper to ensure image URLs are complete absolute URLs (starting with https://)
 * for Open Graph metadata (WhatsApp, Facebook, Twitter, etc).
 * Automatically applies transformation to force JPG format & resize to 800x418 (80% quality)
 * for ImageKit images so WhatsApp Android parses previews reliably without WebP/size issues.
 */
export function getAbsoluteImageUrl(rawImg, options = {}) {
  const { isOg = true, width = 800, height = 418, quality = 80, format = 'jpg' } = options;
  const fallbackUrl = 'https://pojoktv.com/logo-pojoktv.png';
  if (!rawImg) return fallbackUrl;

  let imgStr = '';
  if (typeof rawImg === 'string') {
    imgStr = rawImg.trim();
  } else if (Array.isArray(rawImg) && rawImg.length > 0) {
    imgStr = typeof rawImg[0] === 'string' ? rawImg[0].trim() : '';
  } else if (typeof rawImg === 'object' && rawImg !== null) {
    imgStr = rawImg.url || rawImg.src || '';
  }

  if (!imgStr) return fallbackUrl;

  // Handle stringified JSON array e.g. "[\"path/to/image.jpg\"]"
  if (imgStr.startsWith('[')) {
    try {
      const parsed = JSON.parse(imgStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imgStr = String(parsed[0]).trim();
      }
    } catch (e) {
      // Ignore JSON parse error
    }
  }

  let formatted = imageKitLoader(imgStr);
  if (!formatted) formatted = imgStr;

  if (formatted.startsWith('http://')) {
    formatted = formatted.replace('http://', 'https://');
  } else if (formatted.startsWith('//')) {
    formatted = `https:${formatted}`;
  } else if (formatted.startsWith('/')) {
    formatted = `https://pojoktv.com${formatted}`;
  } else if (!formatted.startsWith('https://')) {
    formatted = `https://pojoktv.com/${formatted}`;
  }

  // Force JPG format, dimension w-800, h-418, q-80 for OG social previews (WhatsApp Android compatibility)
  if (isOg && formatted.includes('ik.imagekit.io')) {
    formatted = formatted.replace(/[?&]tr=[^&]*/g, '');
    const joiner = formatted.includes('?') ? '&' : '?';
    formatted = `${formatted}${joiner}tr=f-${format},w-${width},h-${height},q-${quality}`;
  }

  return formatted;
}

/**
 * Dynamic SEO & Open Graph (OG) metadata generator function.
 * Follows standard Next.js generateMetadata signature.
 *
 * @param {Object|string} paramsInput - Page params object, slug, or berita object
 * @returns {Promise<Object>} Next.js Metadata object
 */
export async function generateMetadata(paramsInput) {
  let berita = null;
  let slug = '';

  if (paramsInput && typeof paramsInput === 'object') {
    if (paramsInput.berita) {
      berita = paramsInput.berita;
      slug = berita.slug;
    } else if (paramsInput.slug) {
      slug = paramsInput.slug;
    } else if (paramsInput.params) {
      const resolved = typeof paramsInput.params.then === 'function'
        ? await paramsInput.params
        : paramsInput.params;
      slug = resolved?.slug;
    }
  } else if (typeof paramsInput === 'string') {
    slug = paramsInput;
  }

  if (!berita && slug) {
    try {
      const { data } = await supabase
        .from('berita')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .single();
      berita = data;
    } catch (e) {
      console.error('Error fetching berita in generateMetadata:', e);
    }
  }

  const siteDomain = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pojoktv.com').replace(/\/$/, '');
  const metadataBase = new URL(siteDomain);

  if (!berita) {
    const fallbackTitle = 'Berita Tidak Ditemukan - PojokTV';
    const fallbackDesc = 'PojokTV.com - Halaman berita yang Anda cari tidak ditemukan di PojokTV.com';
    const fallbackUrl = slug ? `${siteDomain}/berita/${slug}` : siteDomain;
    const fallbackImage = `${siteDomain}/logo-pojoktv.png`;

    return {
      metadataBase,
      title: fallbackTitle,
      description: fallbackDesc,
      openGraph: {
        type: 'article',
        title: fallbackTitle,
        description: fallbackDesc,
        url: fallbackUrl,
        images: [
          {
            url: fallbackImage,
            width: 800,
            height: 418,
            type: 'image/jpeg',
            alt: fallbackTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDesc,
        images: [fallbackImage],
      },
    };
  }

  const title = berita.title || berita.judul || 'PojokTV';
  const description = getNewsDescription(berita);
  const pageUrl = `${siteDomain}/berita/${berita.slug}`;
  const absoluteImageUrl = getAbsoluteImageUrl(berita.gambar_utama || berita.images || berita.image || berita.gambar, { isOg: true });

  return {
    metadataBase,
    title: title,
    description: description,
    openGraph: {
      type: 'article',
      title: title,
      description: description,
      url: pageUrl,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 418,
          type: 'image/jpeg',
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [absoluteImageUrl],
    },
  };
}


export default function DetailBerita({ berita, categories = [], ads = [], latestBerita = [], popularBerita = [], fixImageUrl }) {
  const router = useRouter();
  const { slug } = router.query;

  const [realTimeViews, setRealTimeViews] = useState(berita?.views || 0);
  const [currentDate, setCurrentDate] = useState('Kamis, 9 Juli 2026');
  const [currentTime, setCurrentTime] = useState('22:40:11 WIB');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adsList, setAdsList] = useState(ads || []);

  useEffect(() => {
    if (!berita?.slug) return;
    
    fetch('/api/increment-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: berita.slug }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.views) setRealTimeViews(data.views);
      })
      .catch((err) => console.error('Gagal update views:', err));
  }, [berita?.slug]);

  useEffect(() => {
    // Client-side fetch data iklan aktif dari Supabase (sama seperti Beranda dan Kategori)
    const fetchAds = async () => {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('is_active', true);
        if (!error && data) {
          setAdsList(data);
        }
      } catch (err) {
        console.error('Gagal fetch data iklan di DetailBerita:', err);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads && ads.length > 0) {
      setAdsList(ads);
    }
  }, [ads]);

  const images = (() => {
    if (!berita) return [];
    const imgs = berita.images || berita.image || berita.gambar || berita.gambar_utama_url;
    if (!imgs) return [];
    let list = [];
    if (Array.isArray(imgs)) {
      list = imgs;
    } else if (typeof imgs === 'string') {
      try {
        if (imgs.startsWith('[')) {
          list = JSON.parse(imgs);
        } else {
          list = [imgs];
        }
      } catch (e) {
        list = [imgs];
      }
    } else {
      list = [imgs];
    }
    return list.map((item) => imageKitLoader(item));
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
    alert("Menghubungkan ke Siaran Live Streaming PojokTV... (Siaran Berjalan Lancar)");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push({ pathname: '/search', query: { q: searchQuery } });
    }
  };

  const findAdByPosition = (adsArray, targetPosition) => {
    if (!adsArray || !Array.isArray(adsArray)) return null;

    return adsArray.find(a => {
      if (!a || a.is_active === false) return false;
      const pos = String(a.position || '').trim().toLowerCase();

      switch (targetPosition) {
        case 'header':
          return pos === 'header' || pos === 'spanduk paling atas (di bawah logo)' || pos.includes('header') || pos.includes('spanduk paling atas');
        case 'sidebarTop':
          return pos === 'sidebar atas' || pos === 'sidebar' || pos === 'samping kanan (bentuk kotak)' || pos.includes('sidebar atas') || pos.includes('bentuk kotak');
        case 'sidebarBottom':
          return pos === 'sidebar bawah' || pos === 'samping kanan (memanjang ke bawah)' || pos.includes('sidebar bawah') || pos.includes('memanjang');
        case 'middle':
          return pos === 'tengah konten' || pos === 'menyelip di tengah' || pos === 'menyelip di tengah daftar berita' || pos.includes('tengah');
        case 'footer':
          return pos === 'footer' || pos === 'spanduk paling bawah website' || pos.includes('footer') || pos.includes('spanduk paling bawah');
        default:
          return false;
      }
    });
  };

  const headerAd = findAdByPosition(adsList, 'header');
  const sidebarTopAd = findAdByPosition(adsList, 'sidebarTop');
  const sidebarBottomAd = findAdByPosition(adsList, 'sidebarBottom');
  const middleAd = findAdByPosition(adsList, 'middle');
  const footerAd = findAdByPosition(adsList, 'footer');

  const cleanHTML = berita && (berita.content || berita.isi)
    ? transformHtmlImageUrls((berita.content || berita.isi).replace(/&nbsp;/g, ' '))
    : '';

  // Logika menyelipkan iklan di tengah-tengah paragraf artikel
  const { firstHalf, secondHalf } = (() => {
    if (!cleanHTML) return { firstHalf: '', secondHalf: '' };
    if (!middleAd) return { firstHalf: cleanHTML, secondHalf: '' };

    const pMatches = [...cleanHTML.matchAll(/<\/p>/gi)];
    if (pMatches.length >= 2) {
      const midIndex = Math.floor(pMatches.length / 2);
      const splitPos = pMatches[midIndex - 1].index + 4;
      return {
        firstHalf: cleanHTML.slice(0, splitPos),
        secondHalf: cleanHTML.slice(splitPos),
      };
    }
    return { firstHalf: cleanHTML, secondHalf: '' };
  })();

  if (!berita) {
    return (
      <Layout>
        <Head>
          <title>Berita Tidak Ditemukan - PojokTV</title>

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

  const rawTitle = berita?.title || berita?.judul || 'Berita';
  const metaDescription = getNewsDescription(berita);
  const keywords = `${berita?.category || ''}, berita ${berita?.category || ''}, ${rawTitle}, PojokTV, berita terkini, berita nasional`;
  const siteDomain = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pojoktv.com').replace(/\/$/, '');
  const canonicalUrl = `${siteDomain}/berita/${berita?.slug}`;
  const publishedTime = berita?.created_at ? new Date(berita.created_at).toISOString() : '';
  const modifiedTime = (berita?.updated_at || berita?.created_at) ? new Date(berita.updated_at || berita.created_at).toISOString() : '';
  const authorName = berita?.author || 'Redaksi PojokTV';
  const categorySlug = berita?.category ? berita.category.toLowerCase().replace(/\s+/g, '-') : '';

  // Guaranteed absolute URL (starts with https://) for social media link preview (WhatsApp, Facebook, Twitter)
  const absoluteOgImage = getAbsoluteImageUrl(fixImageUrl || berita?.gambar_utama || berita?.images || berita?.image, { isOg: true });

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": rawTitle,
    "image": images && images.length > 0 ? images : [absoluteOgImage],
    "datePublished": publishedTime,
    "dateModified": modifiedTime,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": "https://pojoktv.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PojokTV",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pojoktv.com/logo-pojoktv.png"
      }
    },
    "description": metaDescription
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://pojoktv.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": berita?.category || "Berita",
        "item": `https://pojoktv.com/kategori/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": rawTitle,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <Layout activeCategoryName={berita?.category}>
      <Head>
        <title>{berita?.title || berita?.judul ? `${rawTitle} | PojokTV.com - Jaringan Berita Nasional` : 'Berita - PojokTV.com'}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={rawTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="PojokTV" />
        <meta property="og:image" content={absoluteOgImage} />
        <meta property="og:image:secure_url" content={absoluteOgImage} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="418" />
        <meta property="og:image:type" content="image/jpeg" />

        {/* Article Specific Metadata */}
        <meta property="article:published_time" content={publishedTime} />
        <meta property="article:modified_time" content={modifiedTime} />
        <meta property="article:author" content={authorName} />
        <meta property="article:section" content={berita?.category || 'News'} />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={rawTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={absoluteOgImage} />
        <meta name="twitter:site" content="@PojokTV" />
        <meta name="twitter:creator" content="@PojokTV" />



        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      {/* Header Ad Slot */}
      {headerAd && (
        <div className="w-full max-w-7xl mx-auto mt-4 mb-2 px-2 md:px-4 flex justify-center">
          <AdSlot 
            size="970x90" 
            className="w-full" 
            ad={headerAd} 
          />
        </div>
      )}

      {/* Content Wrapper */}
      <main className="w-full mb-6 md:mb-8 mt-2 md:mt-2">
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
                  <NewsGallery images={images} caption={berita.image_caption} />

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 border-b border-gray-200 pb-4 mb-6">
                    <span>Oleh: <strong className="text-gray-700 font-semibold">{berita.author || 'Redaksi PojokTV'}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>{formatDate(berita.created_at)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{realTimeViews} kali dibaca</span>
                  </div>

                  {/* ===== ISI ARTIKEL ===== */}
                  <div 
                    className="w-full text-base md:text-lg leading-relaxed text-gray-800 text-left break-normal whitespace-normal [&>p]:mb-5 [&>p]:break-normal [&>p]:whitespace-normal [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-3 [&>ul]:mb-5 [&>ul]:ml-5 [&>ul]:list-disc [&>ol]:mb-5 [&>ol]:ml-5 [&>ol]:list-decimal"
                    style={{ wordBreak: 'normal', overflowWrap: 'break-word', wordWrap: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: firstHalf }} 
                  />

                  {/* Iklan Menyelip di Tengah Konten (Tampil jika ada) */}
                  {middleAd && (
                    <div className="my-6 w-full flex justify-center">
                      <AdSlot size="728x90" className="w-full h-auto" ad={middleAd} />
                    </div>
                  )}

                  {secondHalf && (
                    <div 
                      className="w-full text-base md:text-lg leading-relaxed text-gray-800 text-left break-normal whitespace-normal [&>p]:mb-5 [&>p]:break-normal [&>p]:whitespace-normal [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-3 [&>ul]:mb-5 [&>ul]:ml-5 [&>ul]:list-disc [&>ol]:mb-5 [&>ol]:ml-5 [&>ol]:list-decimal"
                      style={{ wordBreak: 'normal', overflowWrap: 'break-word', wordWrap: 'break-word' }}
                      dangerouslySetInnerHTML={{ __html: secondHalf }} 
                    />
                  )}

                  {/* Share / Tags section */}
                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <Link href="/" className="text-xs font-bold uppercase text-slate-500 hover:text-red-600 transition duration-200 flex items-center gap-1 flex-shrink-0">
                      &larr; Kembali ke Beranda
                    </Link>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 w-full my-2 flex-nowrap">
                      <span className="text-xs font-bold text-slate-400 uppercase mr-1 flex-shrink-0 hidden lg:inline">Bagikan:</span>
                      
                      {/* Facebook */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const cleanUrl = `https://pojoktv.com/berita/${berita?.slug}`;
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`, '_blank');
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#3b5998] text-white cursor-pointer"
                        aria-label="Share Facebook"
                      >
                        <i className="fa-brands fa-facebook-f w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* Twitter / X */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const cleanUrl = `https://pojoktv.com/berita/${berita?.slug}`;
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(berita?.title || '')}&url=${encodeURIComponent(cleanUrl)}`, '_blank');
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#1da1f2] text-white cursor-pointer"
                        aria-label="Share Twitter"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>

                      {/* LinkedIn */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const cleanUrl = `https://pojoktv.com/berita/${berita?.slug}`;
                          window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(cleanUrl)}&title=${encodeURIComponent(berita?.title || '')}`, '_blank');
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#0077b5] text-white cursor-pointer"
                        aria-label="Share LinkedIn"
                      >
                        <i className="fa-brands fa-linkedin-in w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* WhatsApp */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const cleanUrl = `https://pojoktv.com/berita/${berita?.slug}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(cleanUrl)}`, '_blank');
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#25d366] text-white cursor-pointer"
                        aria-label="Share WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* Email */}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const cleanUrl = `https://pojoktv.com/berita/${berita?.slug}`;
                          window.location.href = `mailto:?subject=${encodeURIComponent(berita?.title || '')}&body=${encodeURIComponent(cleanUrl)}`;
                        }}
                        className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 bg-[#f26522] text-white cursor-pointer"
                        aria-label="Share Email"
                      >
                        <i className="fa-regular fa-envelope w-5 h-5 flex items-center justify-center text-sm sm:text-base"></i>
                      </a>

                      {/* Copy Link */}
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            const cleanUrl = `https://pojoktv.com/berita/${berita?.slug}`;
                            navigator.clipboard.writeText(cleanUrl);
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

                {/* Iklan Samping Kanan (Bentuk Kotak) - Berada tepat di bawah Berita Populer */}
                {sidebarTopAd && (
                  <div className="w-full">
                    <AdSlot size="300x250" className="w-full" ad={sidebarTopAd} />
                  </div>
                )}

                {/* Iklan Samping Kanan (Memanjang ke Bawah) - Berada tepat di bawah Berita Populer / Iklan Kotak */}
                {sidebarBottomAd && (
                  <div className="w-full">
                    <AdSlot size="300x600" className="w-full" ad={sidebarBottomAd} />
                  </div>
                )}

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

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
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

    // Incremented client-side via api/increment-view

    // Parallelisasi 4 query independen — 4x lebih cepat dari sequential await
    const [categoriesRes, adsRes, latestRes, popularRes] = await Promise.all([
      supabase
        .from('categories')
        .select('id, name, slug, sort_order, status')
        .eq('status', 'Aktif')
        .order('sort_order', { ascending: true }),
      supabase
        .from('ads')
        .select('*')
        .eq('is_active', true),
      supabase
        .from('berita')
        .select('id, title, slug, created_at, category')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('berita')
        .select('id, title, slug, views, category')
        .eq('status', 'Published')
        .order('views', { ascending: false })
        .limit(5),
    ]);

    const categories = categoriesRes.data || [];
    const ads = adsRes.data || [];
    const latestBerita = latestRes.data || [];
    const popularBerita = popularRes.data || [];

    // Logika mengekstrak gambar absolut untuk Open Graph share WhatsApp & Media Sosial
    let fixImageUrl = 'https://pojoktv.com/logo-pojoktv.png'; // Fallback aman
    if (mainBerita) {
      fixImageUrl = getAbsoluteImageUrl(mainBerita.gambar_utama || mainBerita.images || mainBerita.image || mainBerita.gambar);
      mainBerita.gambar_utama = fixImageUrl;
    }

    return {
      props: {
        berita: mainBerita || null,
        categories,
        ads,
        latestBerita,
        popularBerita,
        fixImageUrl,
      },
      revalidate: 60,
    };
  } catch (err) {
    console.error('Error in getStaticProps:', err);
    return {
      props: {
        berita: null,
        categories: [],
        ads: [],
        latestBerita: [],
        popularBerita: [],
        fixImageUrl: 'https://pojoktv.com/logo-pojoktv.png',
      },
      revalidate: 60,
    };
  }
}

