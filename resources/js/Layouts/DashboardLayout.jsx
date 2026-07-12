import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function DashboardLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = user?.role || 'guest';
    
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Helper boolean untuk otorisasi
    const isSuperAdmin = role === 'super_admin';
    const isAdmin = role === 'admin';
    const isAuthor = role === 'author';
    const canManageContent = isSuperAdmin || isAdmin;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 border-b border-gray-800">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <ApplicationLogo className="text-2xl" />
                    </Link>
                </div>

                <div className="overflow-y-auto h-full pb-20">
                    <nav className="px-4 py-6 space-y-1">
                        
                        {/* UMUM */}
                        <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Umum</p>
                        <Link 
                            href={route('dashboard.index')} 
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${route().current('dashboard.index') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        >
                            Dashboard
                        </Link>
                        
                        <Link 
                            href={route('dashboard.posts.index')} 
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${route().current('dashboard.posts.*') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                        >
                            {isAuthor ? 'Berita Saya' : 'Manajemen Berita'}
                        </Link>

                        {/* ADMIN & SUPER ADMIN */}
                        {canManageContent && (
                            <>
                                <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Master Data</p>
                                <Link 
                                    href={route('dashboard.categories.index')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    Manajemen Kategori
                                </Link>
                                <Link 
                                    href={route('dashboard.tags.index')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    Manajemen Tag
                                </Link>
                            </>
                        )}

                        {/* SUPER ADMIN ONLY */}
                        {isSuperAdmin && (
                            <>
                                <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Sistem</p>
                                <Link 
                                    href={route('dashboard.ads.index')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    Pengaturan Iklan
                                </Link>
                                <Link 
                                    href="#" 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    Manajemen Pengguna
                                </Link>
                                <Link 
                                    href={route('dashboard.settings.index')} 
                                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    Pengaturan Web
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 focus:outline-none lg:hidden"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center ml-auto">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                                <p className="text-xs text-gray-500 uppercase">{role.replace('_', ' ')}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
