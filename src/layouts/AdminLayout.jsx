import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = router;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/redaksi-portal/login');
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/redaksi-portal/login');
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/redaksi-portal/login');
  };

  const getBreadcrumbs = () => {
    if (pathname.includes('dashboard')) return 'Panel Admin / Dashboard';
    if (pathname.includes('berita')) {
      if (pathname.includes('create')) return 'Panel Admin / Kelola Berita / Tulis Berita Baru';
      if (pathname.includes('edit')) return 'Panel Admin / Kelola Berita / Ubah Berita';
      return 'Panel Admin / Kelola Berita';
    }
    if (pathname.includes('rubrik')) return 'Panel Admin / Kelola Rubrik';
    if (pathname.includes('iklan')) return 'Panel Admin / Kelola Iklan';
    if (pathname.includes('videos')) return 'Panel Admin / Kelola Video';
    return 'Panel Admin';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-spinner animate-spin text-3xl text-red-600"></i>
          <p className="text-sm font-medium">Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden relative">
      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex flex-col items-center justify-center border-b border-gray-800 bg-gray-950 shrink-0 px-4 relative">
          <span className="text-4xl font-black tracking-tighter leading-none">
            <span className="text-white">Pojok</span><span className="text-red-600">TV</span>
          </span>
          <span className="text-xs text-gray-300 font-bold uppercase tracking-[0.2em] mt-2">Panel Admin Redaksi</span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-3 right-3 text-gray-400 hover:text-white p-1.5">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/redaksi-portal/dashboard" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
            <i className="fa-solid fa-gauge w-5"></i> Dashboard
          </Link>
          <Link href="/redaksi-portal/berita" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
            <i className="fa-solid fa-newspaper w-5"></i> Kelola Berita
          </Link>
          <Link href="/redaksi-portal/rubrik" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
            <i className="fa-solid fa-folder w-5"></i> Kelola Rubrik
          </Link>
          <Link href="/redaksi-portal/iklan" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
            <i className="fa-solid fa-bullhorn w-5"></i> Kelola Iklan
          </Link>
          <Link href="/redaksi-portal/videos" className="flex items-center gap-3 text-gray-200 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors">
            <i className="fa-brands fa-youtube w-5"></i> Kelola Video
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-16 bg-white shadow-sm flex justify-between items-center w-full px-4 sm:px-6 shrink-0 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-800 p-2 rounded-md hover:bg-gray-200 border border-gray-300 mr-2 flex items-center justify-center bg-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div className="text-base font-bold text-gray-900 hidden sm:block">{getBreadcrumbs()}</div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-base font-bold text-gray-800 truncate max-w-[120px] sm:max-w-none">
              Halo, {user?.email?.split('@')[0]}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-5 py-2.5 rounded-md text-base transition-colors border border-red-200"
            >
              Keluar / Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 text-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
