import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';
import { supabase } from '@/lib/supabaseClient';

export default function Home({ posts = [], videos = [], headlines = [], categories = [], ads = [], breakingNews = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sidebarAdAtas = ads?.find(ad => ad.position === 'Sidebar Atas' || ad.position === 'Sidebar (300x250)' || ad.position === 'sidebar');
  const sidebarAdBawah = ads?.find(ad => ad.position === 'Sidebar Bawah');
  const tengahKontenAd = ads?.find(ad => ad.position === 'Tengah Konten');

  useEffect(() => {
    if (headlines && headlines.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === headlines.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [headlines]);

  const authorDisplay = (author) =>
    author === 'Superadmin' || author === 'superadmin' ? 'Tim Redaksi PojokTV' : (author || 'Tim Redaksi PojokTV');

  return (
    <PublicLayout categories={categories} breakingNews={breakingNews} ads={ads}>
      <Head>
        <title>Berita Terkini & Terpercaya - PojokTV.com</title>
        <meta name="description" content="PojokTV.com - Portal berita terkini, terpercaya, dan independen. Berita nasional, politik, ekonomi, dan lebih banyak lagi." />
      </Head>

      {/* Headline Slider */}
      {headlines && headlines.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-4">
          <div className="relative w-full h-[250px] md:h-[450px] rounded-xl overflow-hidden shadow-lg group">
            {headlines.map((post, index) => (
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
              {headlines.map((_, index) => (
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

      <main className="main-wrapper">
        <div className="container">

          {/* Hero Section */}
          <section className="hero-section">
            {posts && posts.length > 0 ? (
              <div className="hero-grid">
                {/* Berita Utama Kiri */}
                <div className="hero-main">
                  <div className="hero-card">
                    {posts[0].image ? (
                      <img
                        src={posts[0].image.startsWith('http') ? posts[0].image : `/storage/${posts[0].image}`}
                        alt={posts[0].title}
                        className="hero-img"
                      />
                    ) : (
                      <div className="hero-img" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-newspaper" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.1)' }}></i>
                      </div>
                    )}
                    <div className="gradient-overlay">
                      <span className="tag-badge">{posts[0].category}</span>
                      <h1 className="hero-title-main">
                        <Link href={`/berita/${posts[0].slug}`}>{posts[0].title}</Link>
                      </h1>
                      <div className="hero-meta">
                        <span>{authorDisplay(posts[0].author)}</span>
                        <span>•</span>
                        <span>Baru Saja</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Berita Pendamping Kanan */}
                {posts.length > 1 && (
                  <div className="hero-side" style={{ gap: '0.75rem' }}>
                    {posts.slice(1, 5).map((post) => (
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
                            <svg className="side-img" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                              <rect width="300" height="200" fill="#1E293B" />
                              <text x="150" y="110" fill="rgba(255,255,255,0.15)" fontFamily="sans-serif" fontSize="20" textAnchor="middle">POJOKTV</text>
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
                            <span>{authorDisplay(post.author)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg" style={{ minHeight: '350px' }}>
                <i className="fa-solid fa-newspaper" style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '1rem' }}></i>
                <p style={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '1.1rem' }}>Belum ada berita yang dipublikasikan.</p>
                <p style={{ color: '#CBD5E1', fontSize: '0.875rem', marginTop: '0.5rem' }}>Silakan tambahkan berita melalui Dashboard Admin.</p>
              </div>
            )}
          </section>

          {/* Berita Terbaru Grid */}
          <section className="kriminal-section" id="kriminal-section" style={{ marginBottom: '3rem' }}>
            <div className="section-header">
              <h2 className="section-title crimson-title">Berita Terbaru</h2>
              <Link href="#" className="section-link">Lihat Semua <i className="fa-solid fa-chevron-right"></i></Link>
            </div>
            <div className="kriminal-grid">
              {posts && posts.length > 5 ? (
                posts.slice(5, 9).map((post) => (
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
                        <svg className="politik-img" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="160" fill="#1E293B" />
                          <text x="150" y="90" fill="rgba(255,255,255,0.1)" fontFamily="sans-serif" fontSize="24" textAnchor="middle">POJOKTV</text>
                        </svg>
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
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0' }}>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Tambahkan lebih banyak berita untuk mengisi bagian ini.</p>
                </div>
              )}
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
        {videos && videos.length > 0 && (
          <section className="video-section py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white rounded-lg my-8" id="video-section">
            <div className="max-w-7xl mx-auto">
              <div className="section-header border-b border-gray-800 pb-3 mb-6">
                <h2 className="section-title text-xl font-bold flex items-center gap-2">
                  <i className="fa-solid fa-circle-play text-red-600"></i> Pojok Video
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="video-card">
                    <div className="aspect-video w-full rounded overflow-hidden shadow-lg bg-black">
                      <iframe
                        className="w-full h-[200px]"
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
                {posts && posts.length > 0 ? (
                  posts.slice(0, 4).map((post) => (
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
                          <svg className="ekonomi-img" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
                            <rect width="180" height="120" fill="#1E293B" />
                            <text x="90" y="70" fill="rgba(255,255,255,0.1)" fontFamily="sans-serif" fontSize="20" textAnchor="middle">POJOKTV</text>
                          </svg>
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
                  ))
                ) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem 0' }}>
                    <i className="fa-solid fa-newspaper" style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '1rem', display: 'block' }}></i>
                    <p style={{ color: '#94A3B8', fontWeight: 'bold' }}>Belum ada berita yang dipublikasikan.</p>
                  </div>
                )}
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
                  {posts && posts.length > 0 ? (
                    <ul className="popular-list">
                      {[...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((post, index) => (
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
                  ) : (
                    <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                      <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Belum ada berita terpopuler.</p>
                    </div>
                  )}
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
    </PublicLayout>
  );
}

// Server-side data fetching from Supabase
export async function getServerSideProps() {
  try {
    const [
      { data: posts },
      { data: videos },
      { data: categories },
      { data: ads },
      { data: breakingNews },
    ] = await Promise.all([
      supabase.from('posts').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(20),
      supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(8),
      supabase.from('categories').select('*').eq('status', 'Aktif').order('name'),
      supabase.from('ads').select('*').eq('is_active', true),
      supabase.from('posts').select('id, title').eq('status', 'Published').order('created_at', { ascending: false }).limit(5),
    ]);

    const headlines = (posts || []).slice(0, 5);

    return {
      props: {
        posts: posts || [],
        videos: videos || [],
        headlines,
        categories: categories || [],
        ads: ads || [],
        breakingNews: breakingNews || [],
      },
    };
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return { props: { posts: [], videos: [], headlines: [], categories: [], ads: [], breakingNews: [] } };
  }
}
