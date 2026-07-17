import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function Header({ activeSlug, activeCategoryName }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('status', 'Aktif')
          .order('sort_order', { ascending: true });
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories in Header:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push({ pathname: '/search', query: { q: searchQuery } });
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleLiveTv = () => {
    alert("Menghubungkan ke Siaran Live Streaming PojokTV... (Siaran Berjalan Lancar)");
  };

  // Determine if main menu item is active
  const isHomeActive = activeSlug === 'berita-utama' || (!activeSlug && !activeCategoryName);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      {/* Mobile Header Baris Atas (Menu - Logo - Search) */}
      <div className="flex md:hidden items-center justify-between w-full h-[70px] px-4 sm:px-6 bg-white border-b">
        {/* Sisi Kiri: Hamburger Menu */}
        <div className="w-10 flex justify-start">
          <button 
            className="text-[#001746] hover:text-[#E30A17] text-xl" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* Tengah: Logo */}
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="block flex-shrink-0">
            <img 
              src="/logo-pojoktv.png" 
              alt="PojokTV" 
              className="h-[80px] md:h-[110px] lg:h-[130px] w-auto object-contain" 
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
          </Link>
        </div>

        {/* Sisi Kanan: Search Button */}
        <div className="w-10 flex justify-end">
          <button 
            type="button" 
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
            className="text-[#001746] hover:text-[#E30A17] text-xl flex items-center justify-end" 
            aria-label="Pencarian"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Search Bar */}
      {isMobileSearchOpen && (
        <div className="block md:hidden w-full p-3 bg-white border-b shadow-sm">
          <form onSubmit={handleSearch} className="relative flex items-center bg-slate-100 border border-slate-200 rounded-lg overflow-hidden px-3 py-2">
            <input
              type="text"
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full pr-10"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="absolute right-3 text-slate-400 hover:text-[#E30A17] text-sm">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      )}

      {/* Mobile Header Baris Kategori (Menu Geser) */}
      <nav className="flex md:hidden overflow-x-auto whitespace-nowrap scrollbar-none border-b border-gray-200 py-2 px-4 gap-4 text-sm font-semibold uppercase bg-white">
        <Link 
          href="/" 
          className={`text-[15px] font-bold px-4 py-2 border-b-2 hover:text-[#E30A17] transition-colors ${isHomeActive ? 'text-[#E30A17] border-[#E30A17]' : 'text-[#001746] border-transparent'}`}
        >
          Berita Utama
        </Link>
        {categories?.filter(Boolean).map((cat) => {
          const isActive = cat.slug === activeSlug || cat.name === activeCategoryName;
          return (
            <Link 
              key={cat.id || Math.random()} 
              href={`/kategori/${cat.slug || ''}`} 
              className={`text-[15px] font-bold px-4 py-2 border-b-2 hover:text-[#E30A17] transition-colors ${isActive ? 'text-[#E30A17] border-[#E30A17]' : 'text-[#001746] border-transparent'}`}
            >
              {cat.name || 'Kategori'}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between w-full h-[85px] lg:h-[90px] px-4 sm:px-6 lg:px-8 bg-white border-b container mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="block flex-shrink-0 mr-4 lg:mr-8">
            <img 
              src="/logo-pojoktv.png" 
              alt="PojokTV" 
              className="h-[80px] md:h-[110px] lg:h-[130px] w-auto object-contain" 
              onError={(e) => {
                e.target.src = "/logo.png";
              }}
            />
          </Link>
        </div>

        {/* Middle: Scrollable Rubrik Menu */}
        <nav className="overflow-x-auto whitespace-nowrap scrollbar-none flex-1 max-w-full mx-2 md:mx-4 py-2">
          <ul className="flex items-center gap-4 text-[13px] md:text-[14px] font-bold text-[#001746] uppercase">
            <li>
              <Link 
                href="/" 
                className={`pb-1 border-b-2 hover:text-[#E30A17] transition-colors ${isHomeActive ? 'text-[#E30A17] border-[#E30A17]' : 'text-[#001746] border-transparent'}`}
              >
                Berita Utama
              </Link>
            </li>
            {categories?.filter(Boolean).map((cat) => {
              const isActive = cat.slug === activeSlug || cat.name === activeCategoryName;
              return (
                <li key={cat.id || Math.random()}>
                  <Link 
                    href={`/kategori/${cat.slug || ''}`} 
                    className={`pb-1 border-b-2 hover:text-[#E30A17] transition-colors ${isActive ? 'text-[#E30A17] border-[#E30A17]' : 'text-[#001746] border-transparent'}`}
                  >
                    {cat.name || 'Kategori'}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="search-box relative flex items-center bg-slate-100 border border-slate-200 rounded-lg overflow-hidden px-2.5 py-1">
            <input
              type="text"
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-36 focus:w-48 transition-all"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-slate-400 hover:text-[#E30A17] ml-1 text-xs">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          {/* LIVE TV Button */}
          <a 
            href="https://www.youtube.com/channel/UC7-Jj-CtUK-MxbYEvcE_rJA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 bg-[#E30A17] text-white text-xs font-black rounded-full hover:bg-[#C20814] transition shadow-sm cursor-pointer" 
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>LIVE TV</span>
          </a>
        </div>
      </div>

      {/* Mobile Drawer (Sidebar Menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-col h-screen bg-white p-6 shadow-xl ring-1 ring-black/5 transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <img 
                src="/logo-pojoktv.png" 
                alt="PojokTV" 
                className="h-12 w-auto object-contain" 
                onError={(e) => {
                  e.target.src = "/logo.png";
                }}
              />
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-slate-500 hover:text-[#E30A17] text-xl p-1"
                aria-label="Tutup Menu"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            {/* Mobile Search inside Drawer */}
            <form onSubmit={handleSearch} className="w-full mt-4 mb-6 relative">
              <input
                type="text"
                className="w-full bg-gray-100 text-slate-800 px-4 py-3 text-base rounded-lg focus:outline-none focus:ring-2 focus:ring-red-650"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#E30A17] text-lg">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4 text-sm font-bold text-[#001746] uppercase overflow-y-auto flex-1 pb-32 overscroll-contain">
              <Link 
                href="/" 
                className={`py-2 border-b border-slate-50 ${isHomeActive ? 'text-[#E30A17]' : 'hover:text-[#E30A17] transition-colors'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Berita Utama
              </Link>
              {categories?.filter(Boolean).map((cat) => {
                const isActive = cat.slug === activeSlug || cat.name === activeCategoryName;
                return (
                  <Link 
                    key={cat.id || Math.random()} 
                    href={`/kategori/${cat.slug || ''}`} 
                    className={`py-2 border-b border-slate-50 ${isActive ? 'text-[#E30A17]' : 'hover:text-[#E30A17] transition-colors'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name || 'Kategori'}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
