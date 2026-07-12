import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getBreadcrumbs = () => {
        const paths = url.split('/').filter(Boolean);
        if (paths.includes('dashboard')) {
            return 'Panel Admin / Dashboard';
        }
        if (paths.includes('posts')) {
            if (paths.includes('create')) {
                return 'Panel Admin / Kelola Berita / Tulis Berita Baru';
            }
            if (paths.includes('edit')) {
                return 'Panel Admin / Kelola Berita / Ubah Berita';
            }
            return 'Panel Admin / Kelola Berita';
        }
        if (paths.includes('categories')) {
            return 'Panel Admin / Kelola Rubrik';
        }
        if (paths.includes('ads')) {
            return 'Panel Admin / Kelola Iklan';
        }
        if (paths.includes('videos')) {
            return 'Panel Admin / Kelola Video';
        }
        return 'Panel Admin';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden relative">
            
            {/* OVERLAY GELAP UNTUK MOBILE (Klik di luar sidebar untuk tutup) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR (Responsive: Fixed & Slide di Mobile, Relative di Desktop) */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-24 flex flex-col items-center justify-center border-b border-gray-800 bg-gray-950 shrink-0 px-4">
                    <span className="text-4xl font-black tracking-tighter leading-none">
                        <span className="text-white">Pojok</span><span className="text-red-600">TV</span>
                    </span>
                    <span className="text-xs text-gray-300 font-bold uppercase tracking-[0.2em] mt-2">
                        Panel Admin Redaksi
                    </span>
                    {/* Tombol Tutup Sidebar (Hanya Mobile) */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-3 right-3 text-gray-400 hover:text-white p-1.5" aria-label="Tutup Menu">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/posts" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
                        Kelola Berita
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
                        Kelola Rubrik
                    </Link>
                    <Link href="/admin/ads" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
                        Kelola Iklan
                    </Link>
                    <Link href="/admin/videos" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
                        Kelola Video
                    </Link>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
                
                {/* HEADER */}
                <header className="h-16 bg-white shadow-sm flex justify-between items-center w-full px-4 sm:px-6 shrink-0 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        {/* Tombol Hamburger Menu (Hanya Mobile) */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="md:hidden text-gray-800 p-2 rounded-md hover:bg-gray-200 border border-gray-300 mr-2 flex items-center justify-center bg-white"
                            aria-label="Buka Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <div className="text-base font-bold text-gray-900 hidden sm:block">
                            {getBreadcrumbs()}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-base font-bold text-gray-800 truncate max-w-[120px] sm:max-w-none">
                            Halo, {auth?.user?.name}
                        </span>
                        <Link href="/logout" method="post" as="button" className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-5 py-2.5 rounded-md text-base transition-colors border border-red-200">
                            Keluar / Logout
                        </Link>
                    </div>
                </header>

                {/* KONTEN HALAMAN */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 text-gray-900">
                    {children}
                </main>

            </div>
        </div>
    );
}
