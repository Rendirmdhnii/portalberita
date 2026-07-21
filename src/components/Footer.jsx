import Link from 'next/link';

export default function Footer({ categories = [] }) {
  return (
    <footer className="bg-[#0B162C] text-white border-t border-slate-700 py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kolom 1: Logo & Tentang */}
          <div className="md:col-span-2">
            <img src="/logo-pojoktv.png" alt="PojokTV" className="h-[80px] md:h-[110px] lg:h-[130px] w-auto object-contain mb-6 brightness-0 invert" />
            <p className="text-sm text-gray-300 leading-relaxed">
              PojokTV.com adalah bagian dari jaringan televisi berita digital nasional terkemuka yang berdedikasi menghadirkan jurnalisme berwibawa, independen, tajam, dan tercepat dari seluruh penjuru nusantara.
            </p>
            <div className="flex gap-5 text-gray-400 mt-5 items-center">
              <a href="https://www.facebook.com/share/1BJb1xwa6H/" target="_blank" rel="noopener noreferrer" className="hover:text-red-450 transition" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f text-2xl"></i>
              </a>
              <a href="https://www.instagram.com/pojoktv_com?igsh=ZmRra3JqbGFsbWFl" target="_blank" rel="noopener noreferrer" className="hover:text-red-450 transition" aria-label="Instagram">
                <i className="fa-brands fa-instagram text-2xl"></i>
              </a>
              <a href="https://www.youtube.com/channel/UC7-Jj-CtUK-MxbYEvcE_rJA" target="_blank" rel="noopener noreferrer" className="hover:text-red-450 transition" aria-label="Youtube">
                <i className="fa-brands fa-youtube text-2xl"></i>
              </a>
              <a href="https://www.tiktok.com/@pojoktvcom" target="_blank" rel="noopener noreferrer" className="hover:text-red-450 transition" aria-label="TikTok">
                <i className="fa-brands fa-tiktok text-2xl"></i>
              </a>
              <a href="https://www.threads.com/@pojoktv_com" target="_blank" rel="noopener noreferrer" className="hover:text-red-450 transition flex items-center justify-center" aria-label="Threads">
                <svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                </svg>
              </a>
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
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <i className="fa-solid fa-building text-gray-400 mt-1 shrink-0"></i>
                <span className="font-bold text-white uppercase">PT SARANA PERDANA MEDIA</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fa-solid fa-location-dot text-gray-400 mt-1 shrink-0"></i>
                <span>PERUM MAGERSARI PERMAI BLOK CA No 13 Kota SIDOARJO</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="fa-brands fa-whatsapp text-gray-400 mt-1 shrink-0"></i>
                <div>
                  <span className="block text-gray-300">Mujianto Primadi</span>
                  <a href="https://wa.me/6281331160799" target="_blank" rel="noreferrer" className="block text-gray-300 no-underline font-normal hover:text-red-400">+62 813-3116-0799</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-envelope text-gray-400 shrink-0"></i>
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
