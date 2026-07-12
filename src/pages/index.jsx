import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
// Import Supabase client as requested
import supabase from '../lib/supabase';

// Dummy data for placeholder
const DUMMY_LATEST_NEWS = [
  {
    id: 1,
    title: 'Pembangunan Infrastruktur Tol Baru Jatim Siap Diresmikan Bulan Depan',
    category: 'Pemerintahan',
    excerpt: 'Surabaya - Pengerjaan proyek jalan tol lingkar timur Jawa Timur dilaporkan telah mencapai 98% dan ditargetkan beroperasi secara komersial awal bulan depan.',
    date: '12 Juli 2026',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Analisis Peluang Koalisi Menjelang Kontestasi Pilkada Serentak',
    category: 'Politik',
    excerpt: 'Jakarta - Sejumlah partai politik besar mulai mematangkan strategi penjajakan koalisi strategis untuk mendukung pasangan calon di daerah kunci.',
    date: '12 Juli 2026',
    image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'PN Sidoarjo Jadwalkan Putusan Sengketa Lahan Pekan Depan',
    category: 'Hukum',
    excerpt: 'Sidoarjo - Pengadilan Negeri Sidoarjo akan membacakan vonis akhir sengketa hak kepemilikan tanah warga yang telah berjalan selama setahun terakhir.',
    date: '11 Juli 2026',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Sektor UMKM Digital Catat Kenaikan Omzet Signifikan Kuartal Ini',
    category: 'Ekonomi',
    excerpt: 'Ekonomi kreatif lokal terus menunjukkan tren positif berkat adopsi teknologi pembayaran nontunai yang mempermudah proses transaksi ritel.',
    date: '11 Juli 2026',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Head>
        <title>PojokTV.com - Portal Berita Terpercaya</title>
        <meta name="description" content="PojokTV.com menghadirkan berita terkini, tajam, dan terpercaya." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* HEADER NAVBAR */}
      <header className="bg-white border-b-4 border-red-600 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="font-black text-3xl tracking-tighter flex items-baseline">
              <span className="text-slate-950">Pojok</span>
              <span className="text-red-600">TV</span>
              <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-widest">.com</span>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex space-x-6">
              {['Pemerintahan', 'Politik', 'Hukum', 'Sosial Budaya', 'Pendidikan', 'Ekonomi'].map((cat) => (
                <Link key={cat} href="#" className="text-xs font-black uppercase text-slate-800 hover:text-red-600 transition-colors">
                  {cat}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-xs w-[180px] focus:outline-none focus:border-red-500"
                />
              </div>
              <Link href="/admin/login" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase transition-colors">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-slate-950 rounded-2xl overflow-hidden relative min-h-[350px] md:min-h-[480px] flex items-end p-6 md:p-12 shadow-xl group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
            alt="Hero Headline"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded mb-4">
              Berita Utama
            </span>
            <h1 className="text-white text-2xl md:text-5xl font-black leading-tight mb-4 group-hover:text-red-400 transition-colors">
              Teknologi AI Siap Merevolusi Sistem Jurnalisme Digital Nusantara Tahun Ini
            </h1>
            <p className="text-slate-300 text-sm md:text-base mb-2 font-medium line-clamp-2">
              Kemunculan model kecerdasan buatan terapan mempermudah redaksi memproses verifikasi fakta mentah menjadi berita berkualitas secara real-time.
            </p>
            <div className="text-xs text-slate-400 font-semibold mt-4">
              Oleh: Redaksi PojokTV • 12 Juli 2026
            </div>
          </div>
        </div>
      </section>

      {/* GRID BERITA DUMMY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <div className="border-b-2 border-slate-900 pb-3 mb-8 flex justify-between items-end">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-950 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
            Berita Terkini
          </h2>
          <span className="text-xs font-bold text-slate-400">Total 4 Berita</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_LATEST_NEWS.map((news) => (
            <article key={news.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-red-400/50 transition-all flex flex-col group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-red-600 font-bold uppercase text-[9px] tracking-widest block mb-1">
                    {news.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-950 leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4">
                    {news.excerpt}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold flex justify-between border-t border-slate-100 pt-3">
                  <span>PojokTV Redaksi</span>
                  <span>{news.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t-4 border-red-600 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center">
          <p className="mb-4 sm:mb-0 font-bold">
            &copy; 2026 PojokTV.com. Jaringan Berita Nasional Terpercaya.
          </p>
          <div className="flex justify-center space-x-4">
            {['Tentang Kami', 'Pedoman Media', 'Kebijakan Privasi', 'Ketentuan Layanan'].map((link) => (
              <a key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
