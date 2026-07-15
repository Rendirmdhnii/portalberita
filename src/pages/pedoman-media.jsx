import Head from 'next/head';
import Layout from '@/components/Layout';

export default function PedomanMedia() {
  return (
    <Layout>
      <Head>
        <title>Pedoman Pemberitaan Media Siber - PojokTV.com</title>
        <meta name="description" content="Pedoman pemberitaan media siber PojokTV.com sesuai dengan standar Dewan Pers Republik Indonesia." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">PEDOMAN PEMBERITAAN MEDIA SIBER</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-700">
          <p>
            Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. Keberadaan media siber di Indonesia juga merupakan bagian dari kemerdekaan berpendapat dan berekspresi.
          </p>
          <p>
            Oleh karena itu, <strong>PojokTV.com</strong> secara penuh tunduk dan patuh pada Pedoman Pemberitaan Media Siber yang ditetapkan oleh Dewan Pers.
          </p>
          <div className="border-l-4 border-red-500 pl-5 space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Verifikasi dan Keberimbangan</h2>
              <p>Setiap berita harus melalui verifikasi. Berita yang merugikan pihak lain menuntut verifikasi pada berita yang sama untuk memenuhi prinsip akurasi dan keberimbangan.</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Ralat, Koreksi, dan Hak Jawab</h2>
              <p>Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan Pers.</p>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-1">Pencabutan Berita</h2>
              <p>Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran dari pihak luar redaksi, kecuali terkait masalah SARA, kesusilaan, masa depan anak, pengalaman traumatik korban, atau pertimbangan khusus lain yang ditetapkan Dewan Pers.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
