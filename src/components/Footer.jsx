import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          {/* Kolom 1: Logo & Tentang */}
          <div className="footer-col">
            <div className="footer-about-logo">
              PojokTV<span>.com</span>
            </div>
            <p className="footer-about-text">
              PojokTV.com adalah portal berita digital yang berdedikasi menghadirkan jurnalisme berwibawa, independen, dan terpercaya. <em>&quot;Tajam, Terpercaya, Terkini.&quot;</em>
            </p>
            <div className="social-icons" style={{ marginTop: '0.5rem' }}>
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Youtube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
            </div>
          </div>

          {/* Kolom 2: Kategori */}
          <div className="footer-col">
            <h4 className="footer-col-title">Kategori</h4>
            <div className="footer-links">
              <Link href="/kategori/pemerintahan">Pemerintahan</Link>
              <Link href="/kategori/politik">Politik</Link>
              <Link href="/kategori/hukum">Hukum</Link>
              <Link href="/kategori/sosial-budaya">Sosial Budaya</Link>
              <Link href="/kategori/pendidikan">Pendidikan</Link>
              <Link href="/kategori/ekonomi">Ekonomi</Link>
              <Link href="/kategori/olah-raga">Olah Raga</Link>
              <Link href="/kategori/kesehatan">Kesehatan</Link>
            </div>
          </div>

          {/* Kolom 3: Redaksi & Kontak */}
          <div className="footer-col">
            <h4 className="footer-col-title">Hubungi Kami</h4>
            <div className="footer-links">
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>Perum Citra Oma Pesona Blok E3/25, RT 37/RW 07, Desa Sidokepung, Kecamatan Buduran, Sidoarjo, Jawa Timur.</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-brands fa-whatsapp"></i>
                <a href="https://wa.me/6281331160799" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>0813-3116-0799</a>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:redaksi@pojoktv.com" style={{ color: 'inherit' }}>redaksi@pojoktv.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} pojoktv.com. Jaringan Berita Nasional Terpercaya. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="footer-bottom-links">
            <Link href="/tentang-kami">Tentang Kami</Link>
            <Link href="/pedoman-media">Pedoman Media Siber</Link>
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link href="/ketentuan-layanan">Ketentuan Layanan</Link>
            <Link href="/struktur-redaksi">Struktur Redaksi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
