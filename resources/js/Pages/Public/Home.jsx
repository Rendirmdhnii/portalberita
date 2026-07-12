import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Home({ auth, posts = [], videos = [], headlines = [] }) {
    const { global_ads } = usePage().props;
    const sidebarAdAtas = global_ads?.find(ad => ad.position === 'Sidebar Atas' || ad.posisi === 'Sidebar Atas' || ad.position === 'Sidebar (300x250)' || ad.posisi === 'Sidebar (300x250)' || ad.position === 'sidebar');
    const sidebarAdBawah = global_ads?.find(ad => ad.position === 'Sidebar Bawah' || ad.posisi === 'Sidebar Bawah');
    const tengahKontenAd = global_ads?.find(ad => ad.position === 'Tengah Konten' || ad.posisi === 'Tengah Konten');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (headlines && headlines.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev === headlines.length - 1 ? 0 : prev + 1));
            }, 5000); // Ganti slide setiap 5 detik
            return () => clearInterval(timer);
        }
    }, [headlines]);

    useEffect(() => {
        // Video Carousel Logic
        const videoTrack = document.getElementById('video-carousel-track');
        const vPrevBtn = document.getElementById('video-prev');
        const vNextBtn = document.getElementById('video-next');

        if (videoTrack && vPrevBtn && vNextBtn) {
            const cards = Array.from(videoTrack.children);
            let index = 0;

            const updateVideoCarousel = () => {
                if (!videoTrack.children[0]) return;
                const cardWidth = videoTrack.children[0].getBoundingClientRect().width;
                const gap = 20; // 1.25rem = 20px
                videoTrack.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
            };

            const next = () => {
                let visibleItems = 4;
                if (window.innerWidth <= 480) visibleItems = 1;
                else if (window.innerWidth <= 1024) visibleItems = 2;
                
                if (index < cards.length - visibleItems) {
                    index++;
                } else {
                    index = 0; // loop back to start
                }
                updateVideoCarousel();
            };

            const prev = () => {
                let visibleItems = 4;
                if (window.innerWidth <= 480) visibleItems = 1;
                else if (window.innerWidth <= 1024) visibleItems = 2;

                if (index > 0) {
                    index--;
                } else {
                    index = cards.length - visibleItems; // loop to end
                }
                updateVideoCarousel();
            };

            vNextBtn.addEventListener('click', next);
            vPrevBtn.addEventListener('click', prev);

            window.addEventListener('resize', () => {
                index = 0;
                videoTrack.style.transform = `translateX(0)`;
            });

            return () => {
                vNextBtn.removeEventListener('click', next);
                vPrevBtn.removeEventListener('click', prev);
            };
        }
    }, []);

    const simulateVideo = (title) => {
        alert(`Memutar Video: "${title}" (Simulasi Video Player Overlay)`);
    };

    return (
        <PublicLayout user={auth?.user}>
            <Head title="Berita Terkini & Terpercaya">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
                                {/* Gambar Background */}
                                <img 
                                    src={`/storage/${post.image}`} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradasi Hitam */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                {/* Teks Judul dan Kategori */}
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

                        {/* Indikator Titik (Dots) */}
                        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                            {headlines.map((_, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide ? 'bg-red-600 w-6' : 'bg-white/50 hover:bg-white'}`}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="main-wrapper">
                <div className="container">
                
                {/* 3. Hero Section (Grid Berita Utama Asimetris) */}
                <section className="hero-section">
                    {posts && posts.length > 0 ? (
                        <div className="hero-grid">
                        {/* Berita Sorotan Utama (Kiri, 65%) - Post pertama */}
                        <div className="hero-main">
                            <div className="hero-card">
                                {posts[0].image ? (
                                    <img src={`/storage/${posts[0].image}`} alt={posts[0].title} className="hero-img" />
                                ) : (
                                    <div className="hero-img" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fa-solid fa-newspaper" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.1)' }}></i>
                                    </div>
                                )}
                            <div className="gradient-overlay">
                                <span className="tag-badge">{posts[0].category}</span>
                                <h1 className="hero-title-main">
                                <Link href="#">{posts[0].title}</Link>
                                </h1>
                                <div className="hero-meta">
                                <span>{posts[0].author === 'Superadmin' || posts[0].author === 'superadmin' ? 'Tim Redaksi PojokTV' : (posts[0].author || 'Tim Redaksi PojokTV')}</span>
                                <span>•</span>
                                <span>Baru Saja</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        {/* Berita Pendamping (Kanan, 35%) */}
                        {posts.length > 1 && (
                            <div className="hero-side" style={{ gap: '0.75rem' }}>
                                {posts.slice(1, 5).map((post) => (
                                    <div key={post.id} className="hero-side-card" style={{ height: '120px' }}>
                                    <div className="side-img-wrapper">
                                        {post.image ? (
                                            <img src={`/storage/${post.image}`} alt={post.title} className="side-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                        ) : (
                                            <svg className="side-img" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="300" height="200" fill="#1E293B"/>
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
                                            <Link href="#">{post.title}</Link>
                                        </h2>
                                        </div>
                                        <div className="side-meta">
                                        <span>{post.author === 'Superadmin' || post.author === 'superadmin' ? 'Tim Redaksi' : (post.author || 'Tim Redaksi')}</span>
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

                {/* 4. Section Konten (Bawah Hero) */}
                
                {/* Seksi 1: Berita Terbaru (Grid 4 Kartu) */}
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
                                    <img src={`/storage/${post.image}`} alt={post.title} className="politik-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                ) : (
                                    <svg className="politik-img" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="300" height="160" fill="#1E293B"/>
                                    <text x="150" y="90" fill="rgba(255,255,255,0.1)" fontFamily="sans-serif" fontSize="24" textAnchor="middle">POJOKTV</text>
                                    </svg>
                                )}
                                </div>
                                <div className="politik-content">
                                <span className="crimson-tag" style={{ marginBottom: '0.5rem', display: 'block' }}>{post.category?.toUpperCase()}</span>
                                <h3 className="politik-title" style={{ fontSize: '1.05rem', lineHeight: '1.35' }}>
                                    <Link href="#">{post.title}</Link>
                                </h3>
                                <div className="politik-meta">
                                    <span>{post.author === 'Superadmin' || post.author === 'superadmin' ? 'Tim Redaksi' : (post.author || 'Tim Redaksi')}</span>
                                </div>
                                </div>
                            </article>
                        ))
                    ) : posts && posts.length > 0 && posts.length <= 5 ? (
                        <div className="kriminal-grid" style={{ gridColumn: '1/-1' }}>
                            <p style={{ color: '#94A3B8', padding: '2rem 0', textAlign: 'center', fontSize: '0.9rem' }}>
                                Tambahkan lebih banyak berita untuk mengisi bagian ini.
                            </p>
                        </div>
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0' }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Belum ada berita terbaru.</p>
                        </div>
                    )}
                    </div>
                </section>

                {/* Tengah Konten (In-Feed) Ad */}
                <div className="w-full px-4 sm:px-0 my-6 flex justify-center">
                    {tengahKontenAd ? (
                        <a href={tengahKontenAd.link && tengahKontenAd.link !== '-' ? tengahKontenAd.link : '#'} target="_blank" rel="noreferrer" 
                           className="block w-full max-w-[728px] aspect-[8/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                            <img src={`/storage/${tengahKontenAd.image}`} alt={tengahKontenAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                        </a>
                    ) : (
                        <div className="bg-gray-100 text-center py-6 text-gray-400 text-xs w-full max-w-[728px] aspect-[8/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                            [ Slot Iklan Tengah Konten (Banner) 728x90 ]
                        </div>
                    )}
                </div>

                </div>

                {/* Seksi 2: Pojok Video (YouTube Embed - Mode Gelap) */}
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
                                                allowFullScreen>
                                            </iframe>
                                        </div>
                                        <h3 className="text-white font-bold text-sm mt-3 leading-tight">{video.judul}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 5. Seksi Ekonomi & Bisnis + Sidebar */}
                <div className="container">
                <div className="content-grid">
                    
                    {/* Kolom Kiri: Berita Lainnya (70%) */}
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
                                        <img src={`/storage/${post.image}`} alt={post.title} className="ekonomi-img" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                    ) : (
                                        <svg className="ekonomi-img" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="180" height="120" fill="#1E293B"/>
                                        <text x="90" y="70" fill="rgba(255,255,255,0.1)" fontFamily="sans-serif" fontSize="20" textAnchor="middle">POJOKTV</text>
                                        </svg>
                                    )}
                                </div>
                                <div className="ekonomi-content">
                                    <div>
                                    <h3 className="ekonomi-title">
                                        <Link href="#">{post.title}</Link>
                                    </h3>
                                    <p className="ekonomi-snippet">
                                        {post.content?.substring(0, 120)}...
                                    </p>
                                    </div>
                                    <div className="ekonomi-meta">
                                    <span>{post.author === 'Superadmin' || post.author === 'superadmin' ? 'Tim Redaksi' : (post.author || 'Tim Redaksi')} | {post.category}</span>
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

                    {/* Kolom Kanan: Sidebar (30%) */}
                    <aside className="sidebar-wrapper">
                    <div className="sidebar-sticky">
                        
                        {/* Sidebar Atas Ad Space */}
                        <div className="w-full my-6 flex justify-center">
                            {sidebarAdAtas ? (
                                <a href={sidebarAdAtas.link && sidebarAdAtas.link !== '-' ? sidebarAdAtas.link : '#'} target="_blank" rel="noreferrer" 
                                   className="block w-full max-w-[300px] aspect-[6/5] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                                    <img src={`/storage/${sidebarAdAtas.image}`} alt={sidebarAdAtas.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                                </a>
                            ) : (
                                <div className="bg-[#1a202c] text-center flex flex-col justify-center w-full max-w-[300px] aspect-[6/5] rounded-lg text-white p-4">
                                    <p className="text-[10px] text-gray-400 mb-2">ADVERTISEMENT</p>
                                    <p className="font-bold">POJOKTV AD NETWORK</p>
                                    <p className="text-xs text-gray-400">Sidebar Atas 300 x 250</p>
                                </div>
                            )}
                        </div>

                        {/* Terpopuler (Dinamis dari DB) */}
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
                                        <Link href="#">{post.title}</Link>
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

                        {/* Sidebar Bawah Ad Space */}
                        <div className="w-full my-6 flex justify-center">
                            {sidebarAdBawah ? (
                                <a href={sidebarAdBawah.link && sidebarAdBawah.link !== '-' ? sidebarAdBawah.link : '#'} target="_blank" rel="noreferrer" 
                                   className="block w-full max-w-[300px] aspect-[1/2] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                                    <img src={`/storage/${sidebarAdBawah.image}`} alt={sidebarAdBawah.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
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
