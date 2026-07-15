import Head from 'next/head';
import Layout from '@/components/Layout';

export default function KetentuanLayanan() {
  return (
    <Layout>
      <Head>
        <title>Ketentuan Layanan - PojokTV.com</title>
        <meta name="description" content="Ketentuan layanan (Terms of Service) penggunaan situs PojokTV.com." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">KETENTUAN LAYANAN (TERMS OF SERVICE)</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            Selamat datang di <strong>PojokTV.com</strong>. Dengan mengakses dan menggunakan situs ini, Anda secara otomatis menyetujui Ketentuan Layanan berikut:
          </p>
          <div className="border-l-4 border-red-500 pl-5 space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Hak Cipta Konten</h2>
              <p>Seluruh materi konten (teks, foto, video, logo, dan infografis) di PojokTV.com dilindungi oleh Undang-Undang Hak Cipta. Penggunaan, penyalinan, atau reproduksi konten untuk tujuan komersial tanpa izin tertulis dari redaksi adalah pelanggaran hukum.</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Kutipan Berita</h2>
              <p>Penggunaan konten PojokTV untuk keperluan referensi atau pendidikan diperbolehkan dengan syarat mutlak mencantumkan tautan (link) aktif yang mengarah langsung ke halaman sumber di PojokTV.com.</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Tanggung Jawab Pengguna</h2>
              <p>Pengguna dilarang menggunakan situs ini untuk tindakan yang melanggar hukum, menyebarkan hoaks, ujaran kebencian, atau merusak sistem keamanan server (hacking/spamming).</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
