import Head from 'next/head';
import Layout from '@/components/Layout';

export default function TentangKami() {
  return (
    <Layout>
      <Head>
        <title>Tentang Kami - PojokTV.com</title>
        <meta name="description" content="PojokTV.com adalah portal berita digital independen yang menyajikan jurnalisme akurat dan berimbang untuk masyarakat Indonesia." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">TENTANG KAMI</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            <strong>PojokTV.com</strong> adalah portal berita digital mutakhir yang lahir dari komitmen untuk menyajikan jurnalisme yang independen, akurat, dan berimbang. Kami hadir di tengah derasnya arus informasi untuk menjadi jangkar kebenaran bagi masyarakat Indonesia.
          </p>
          <p>
            Mengusung visi <em>&ldquo;Mencerahkan dan Mencerdaskan&rdquo;</em>, redaksi PojokTV bekerja dengan mengedepankan etika jurnalistik yang ketat. Kami menyajikan berbagai rubrik komprehensif mulai dari Pemerintahan, Ekonomi, Hukum, hingga ragam Peristiwa hangat yang terjadi di seluruh penjuru nusantara.
          </p>
          <p>
            Didukung oleh tim editorial yang berpengalaman dan sistem teknologi informasi terkini, PojokTV memastikan setiap berita yang sampai ke layar Anda telah melalui proses verifikasi fakta yang ketat, menjamin kecepatan tanpa mengorbankan akurasi.
          </p>
        </div>
      </div>
    </Layout>
  );
}
