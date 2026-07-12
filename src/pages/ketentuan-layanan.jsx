import Head from 'next/head';
import Link from 'next/link';

export default function KetentuanLayanan() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Head>
        <title>Ketentuan Layanan - PojokTV.com</title>
      </Head>
      <header className="bg-white border-b-4 border-red-600 p-4 sticky top-0 shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-black text-2xl tracking-tighter">
            Pojok<span className="text-red-600">TV</span>
          </Link>
          <Link href="/" className="text-xs font-bold uppercase text-slate-500 hover:text-red-600 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </header>
      <main className="flex-grow max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-black mb-6 uppercase border-b-2 border-slate-900 pb-2">Ketentuan Layanan</h1>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
          <p>
            Selamat datang di PojokTV.com. Dengan mengakses dan menggunakan situs ini, Anda dianggap menyetujui seluruh Ketentuan Layanan yang ditetapkan di bawah ini.
          </p>
          <p>
            Seluruh konten yang tayang di PojokTV.com (berupa teks, gambar, video, dan infografis) dilindungi oleh hak cipta. Dilarang keras menyalin, mempublikasikan ulang, atau menyebarkan konten kami tanpa mencantumkan sumber link aktif ke PojokTV.com.
          </p>
          <p>
            Penggunaan situs ini harus tunduk pada hukum negara Republik Indonesia dan tidak boleh digunakan untuk tindakan ilegal, penyebaran hoaks, atau hal-hal yang melanggar ketertiban umum.
          </p>
        </div>
      </main>
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 text-center border-t-4 border-red-600">
        &copy; 2026 PojokTV.com. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
