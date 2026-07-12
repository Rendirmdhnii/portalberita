import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export default function Navbar() {
    const { auth, global_ads, breaking_news, global_categories } = usePage().props;
    const headerAd = global_ads?.find(ad => ad.position === 'header');
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
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

    return (
        <div className="w-full font-sans">
            {/* Top Bar Hitam */}
            <div className="bg-gray-900 text-gray-300 text-[10px] sm:text-xs py-2 px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 relative z-[9000]">
                <div className="flex gap-2 sm:gap-4 flex-wrap justify-center font-bold">
                    <span>{currentDate} | {currentTime}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="text-red-500 font-bold hidden sm:inline">TRENDING:</span>
                    {global_categories && global_categories.slice(0, 3).map(cat => (
                        <Link
                            key={cat.id}
                            href={`/kategori/${cat.slug}`}
                            className="text-gray-300 hover:text-white font-bold tracking-widest hidden sm:inline text-[10px] sm:text-xs cursor-pointer"
                        >
                            #{cat.name.replace(/\s+/g, '')}
                        </Link>
                    ))}
                    {(!global_categories || global_categories.length === 0) && (
                        <span className="font-bold text-white tracking-widest hidden sm:inline">—</span>
                    )}
                    <div className="flex gap-3 items-center md:border-l border-gray-700 md:pl-4">
                        {/* Sosmed Icons */}
                        <i className="fa-brands fa-facebook hover:text-white cursor-pointer hidden sm:block"></i>
                        <i className="fa-brands fa-instagram hover:text-white cursor-pointer hidden sm:block"></i>
                        <i className="fa-brands fa-youtube hover:text-white cursor-pointer hidden sm:block"></i>
                        <i className="fa-brands fa-tiktok hover:text-white cursor-pointer hidden sm:block"></i>
                        {/* Pintu Masuk Admin */}
                        <a 
                            href="/login" 
                            className="ml-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-[11px] uppercase font-bold transition-colors shadow-sm relative z-50 inline-flex items-center gap-1"
                        >
                            LOGIN
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. Main Header & Navigation (Sticky) */}
            <header className="main-header relative">
                {/* Baris 1: Logo & Utility */}
                <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                    {/* Logo */}
                    <a href="/" className="logo w-48 flex-shrink-0" id="main-logo" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
                        Pojok<span>TV.com</span>
                    </a>
                    
                    {/* Utility (Search & Live TV) */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block search-box relative">
                            <input type="text" placeholder="Cari berita..." className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-xs w-[180px] focus:outline-none focus:border-red-500" id="search-bar" />
                        </div>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-red-700" id="live-tv-trigger" onClick={() => alert("Menghubungkan ke Siaran Live Streaming PojokTV...")}>
                            LIVE TV
                        </button>
                    </div>
                </div>

                {/* Baris 2: Navigasi Rubrik Tunggal */}
                <nav className="flex overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-gray-200 bg-white py-3 px-2 w-full items-center gap-2">
                    <Link 
                        href="/" 
                        className="px-4 text-xs font-black uppercase text-red-600 hover:text-red-700 transition-colors"
                    >
                        Utama
                    </Link>
                    {global_categories && global_categories.map(cat => (
                        <Link 
                            key={cat.id} 
                            href={`/kategori/${cat.slug}`} 
                            className="px-4 text-xs font-black uppercase text-gray-800 hover:text-red-600 transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* Breaking News Ticker (Tepat di bawah navigasi rubrik) */}
                <div className="ticker-bar">
                    <div className="ticker-label bg-red-600 text-white font-bold uppercase text-xs px-3">
                        BREAKING NEWS
                    </div>
                    <div className="ticker-content">
                        <div className="ticker-track" id="breaking-ticker">
                            {breaking_news && breaking_news.length > 0 ? (
                                breaking_news.map((news) => (
                                    <div key={news.id} className="ticker-item">
                                        <span className="ticker-bullet">•</span> {news.title}
                                    </div>
                                ))
                            ) : (
                                <div className="ticker-item">
                                    <span className="ticker-bullet">•</span> Belum ada informasi terbaru saat ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
