import Head from 'next/head';
import Layout from '@/components/Layout';

export default function KebijakanPrivasi() {
  return (
    <Layout>
      <Head>
        <title>Kebijakan Privasi - PojokTV.com</title>
        <meta name="description" content="Kebijakan privasi PojokTV.com menjelaskan cara kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">KEBIJAKAN PRIVASI</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            <strong>PojokTV.com</strong> menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi pengguna. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat mengakses layanan kami.
          </p>
          <div className="border-l-4 border-red-500 pl-5 space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Pengumpulan Data</h2>
              <p>Kami secara otomatis mengumpulkan informasi teknis non-pribadi seperti alamat IP, jenis peramban, dan data analitik kunjungan melalui teknologi cookies guna meningkatkan pengalaman pengguna (UI/UX) dan relevansi konten.</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Penggunaan Informasi</h2>
              <p>Data yang dikumpulkan digunakan secara internal oleh PojokTV untuk keperluan analisis trafik, optimasi server, dan pengembangan layanan. Kami tidak akan menjual, menyewakan, atau mendistribusikan data pribadi Anda kepada pihak ketiga tanpa izin eksplisit dari Anda, kecuali diwajibkan oleh hukum dan peraturan perundang-undangan di Republik Indonesia.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
