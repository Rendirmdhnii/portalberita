import Link from 'next/link';

export default function Footer({ categories = [] }) {
  return (
    <footer className="footer bg-slate-950 text-slate-350 border-t-4 border-red-600 pt-12 pb-6 w-full">
      <div className="container mx-auto px-4">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kolom 1: Logo & Tentang */}
          <div className="footer-col md:col-span-2">
            <div className="footer-about-logo text-3xl font-black tracking-tighter text-white mb-3">
              Pojok<span className="text-red-600">TV.com</span>
            </div>
            <p className="footer-about-text text-sm text-slate-400 leading-relaxed">
              PojokTV.com adalah bagian dari jaringan televisi berita digital nasional terkemuka yang berdedikasi menghadirkan jurnalisme berwibawa, independen, tajam, dan tercepat dari seluruh penjuru nusantara.
            </p>
            <div className="social-icons flex gap-3 text-slate-400 mt-4">
              <a href="#" className="hover:text-white transition" aria-label="Facebook"><i className="fa-brands fa-facebook-f text-lg"></i></a>
              <a href="#" className="hover:text-white transition" aria-label="Instagram"><i className="fa-brands fa-instagram text-lg"></i></a>
              <a href="#" className="hover:text-white transition" aria-label="Youtube"><i className="fa-brands fa-youtube text-lg"></i></a>
              <a href="#" className="hover:text-white transition" aria-label="TikTok"><i className="fa-brands fa-tiktok text-lg"></i></a>
            </div>
          </div>

          {/* Kolom 2: Peta Situs/Kategori */}
          <div className="footer-col">
            <h4 className="footer-col-title text-white font-bold text-sm uppercase mb-3 tracking-wider">Kategori</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400">
              <Link href="/" className="hover:text-white transition">Berita Utama</Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`} className="hover:text-white transition">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Kolom 3: Redaksi & Kontak */}
          <div className="footer-col">
            <h4 className="footer-col-title text-white font-bold text-sm uppercase mb-3 tracking-wider">Hubungi Kami</h4>
            <div className="footer-links text-slate-400 space-y-2 text-sm">
              <div className="footer-contact-item flex gap-2">
                <i className="fa-solid fa-user text-red-600 mt-1 shrink-0"></i>
                <span>Mujianto Primadi</span>
              </div>
              <div className="footer-contact-item flex gap-2">
                <i className="fa-solid fa-location-dot text-red-600 mt-1 shrink-0"></i>
                <span>Perum Citra Oma Pesona Blok E3/25 RT 37 RW 07, Desa Sidokepung, Kecamatan Buduran, Sidoarjo, Jatim</span>
              </div>
              <div className="footer-contact-item flex gap-2">
                <i className="fa-brands fa-whatsapp text-red-600 mt-1 shrink-0"></i>
                <span>Info Iklan &amp; Kemitraan: <a href="https://wa.me/6281331160799" target="_blank" rel="noreferrer" className="hover:text-white underline font-semibold">+62 813-3116-0799</a></span>
              </div>
              <div className="footer-contact-item flex gap-2">
                <i className="fa-solid fa-envelope text-red-600 mt-1 shrink-0"></i>
                <span>Email: <a href="mailto:redaksi@pojoktv.com" className="hover:text-white underline">redaksi@pojoktv.com</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Paling Bawah */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 mt-8 border-t border-gray-800 text-sm text-gray-400">
          <div className="footer-copyright text-center md:text-left text-xs text-slate-400 max-w-2xl leading-relaxed">
            <p>© 2026 PojokTV.com. Jaringan Berita Nasional Terpercaya. Menghadirkan jurnalisme independen, tajam, dan tercepat dari seluruh penjuru nusantara. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6 shrink-0">
            <Link href="/tentang-kami" className="hover:text-white transition-colors duration-200">Tentang Kami</Link>
            <Link href="/pedoman-media" className="hover:text-white transition-colors duration-200">Pedoman Media Siber</Link>
            <Link href="/kebijakan-privasi" className="hover:text-white transition-colors duration-200">Kebijakan Privasi</Link>
            <Link href="/ketentuan-layanan" className="hover:text-white transition-colors duration-200">Ketentuan Layanan</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors duration-200">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
