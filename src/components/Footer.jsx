import Link from 'next/link';

export default function Footer({ categories = [] }) {
  return (
    <footer className="bg-[#0B162C] text-white border-t border-slate-700 py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kolom 1: Logo & Tentang */}
          <div className="md:col-span-2">
            <img src="/logo-pojoktv.png" alt="PojokTV" className="h-[80px] md:h-[110px] lg:h-[130px] w-auto object-contain mb-6" />
            <p className="text-sm text-gray-300 leading-relaxed">
              PojokTV.com adalah bagian dari jaringan televisi berita digital nasional terkemuka yang berdedikasi menghadirkan jurnalisme berwibawa, independen, tajam, dan tercepat dari seluruh penjuru nusantara.
            </p>
            <div className="flex gap-3 text-gray-400 mt-4">
              <a href="#" className="hover:text-red-450 transition" aria-label="Facebook"><i className="fa-brands fa-facebook-f text-lg"></i></a>
              <a href="#" className="hover:text-red-450 transition" aria-label="Instagram"><i className="fa-brands fa-instagram text-lg"></i></a>
              <a href="#" className="hover:text-red-450 transition" aria-label="Youtube"><i className="fa-brands fa-youtube text-lg"></i></a>
              <a href="#" className="hover:text-red-450 transition" aria-label="TikTok"><i className="fa-brands fa-tiktok text-lg"></i></a>
            </div>
          </div>

          {/* Kolom 2: Kategori */}
          <div>
            <h4 className="text-white font-extrabold text-lg border-b-2 border-slate-700 pb-2 mb-4 uppercase tracking-wider">Kategori</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300">
              <Link href="/" className="hover:text-red-400 transition">Berita Utama</Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`} className="hover:text-red-400 transition">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Kolom 3: Hubungi Kami */}
          <div>
            <h4 className="text-white font-extrabold text-lg border-b-2 border-slate-700 pb-2 mb-4 uppercase tracking-wider">Hubungi Kami</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex gap-2">
                <i className="fa-solid fa-user text-gray-400 mt-1 shrink-0"></i>
                <span>Mujianto Primadi</span>
              </div>
              <div className="flex gap-2">
                <i className="fa-solid fa-location-dot text-gray-400 mt-1 shrink-0"></i>
                <span>Perum Citra Oma Pesona Blok E3/25 RT 37 RW 07, Desa Sidokepung, Kecamatan Buduran, Sidoarjo, Jatim</span>
              </div>
              <div className="flex gap-2">
                <i className="fa-brands fa-whatsapp text-gray-400 mt-1 shrink-0"></i>
                <span>Info Iklan &amp; Kemitraan: <a href="https://wa.me/6281331160799" target="_blank" rel="noreferrer" className="hover:text-red-400 underline font-semibold whitespace-nowrap">+62 813-3116-0799</a></span>
              </div>
              <div className="flex gap-2">
                <i className="fa-solid fa-envelope text-gray-400 mt-1 shrink-0"></i>
                <span>Email: <a href="mailto:redaksi@pojoktv.com" className="hover:text-red-400 underline">redaksi@pojoktv.com</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bawah - bg-white dengan teks gelap */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 mt-4 border-t border-slate-700 text-sm bg-white text-slate-900 px-6 rounded-lg">
          <p className="text-xs text-center md:text-left max-w-2xl leading-relaxed text-slate-900 font-medium">
            @2026 PojokTV.com. Hak cipta dilindungi undang-undang
          </p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6 shrink-0 text-slate-900 font-semibold">
            <Link href="/tentang-kami" className="hover:text-red-600 transition-colors">Tentang Kami</Link>
            <Link href="/pedoman-media" className="hover:text-red-600 transition-colors">Pedoman Media Siber</Link>
            <Link href="/kebijakan-privasi" className="hover:text-red-600 transition-colors">Kebijakan Privasi</Link>
            <Link href="/ketentuan-layanan" className="hover:text-red-600 transition-colors">Ketentuan Layanan</Link>
            <Link href="/layanan-mitra/login" className="hover:text-red-600 transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
