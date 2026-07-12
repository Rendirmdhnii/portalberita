import Head from 'next/head';
import Link from 'next/link';

export default function TentangKami() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <Head>
        <title>Tentang Kami - PojokTV.com</title>
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
        <h1 className="text-3xl font-black mb-6 uppercase border-b-2 border-slate-900 pb-2">Tentang Kami</h1>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
          <p>
            <strong>PojokTV.com</strong> adalah bagian dari jaringan televisi berita digital nasional terkemuka yang berdedikasi menghadirkan jurnalisme berwibawa, independen, tajam, dan tercepat dari seluruh penjuru nusantara.
          </p>
          <p>
            Kami menyajikan informasi terpercaya seputar pemerintahan, hukum, kriminal, politik, dunia, otomotif, olahraga, hiburan, dan video berita eksklusif yang diperbarui setiap saat secara akurat dan objektif.
          </p>
          <p>
            Melalui jurnalisme berkualitas, kami berkomitmen untuk menjadi sumber informasi utama masyarakat Indonesia yang mencerdaskan dan mencerahkan.
          </p>
        </div>
      </main>
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 text-center border-t-4 border-red-600">
        &copy; 2026 PojokTV.com. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
