import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function KetentuanLayanan() {
  const title = 'KETENTUAN LAYANAN (TERMS OF SERVICE)';

  return (
    <Layout>
      <Head>
        <title>{title} - PojokTV.com</title>
        <meta name="description" content="Ketentuan layanan (Terms of Service) penggunaan situs PojokTV.com." />
      </Head>
      <main className="w-full bg-slate-50/50 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto w-full overflow-hidden px-4 sm:px-6 md:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Ketentuan Layanan</span>
          </nav>

          {/* Article Container Card */}
          <div className="px-6 py-8 md:px-12 md:py-10 bg-white rounded-lg shadow-sm border border-slate-200/80">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md mb-3">
                Informasi Hukum & Layanan
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight text-left">
                {title}
              </h1>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <span>PojokTV.com</span>
                <span>•</span>
                <span>Aturan & Syarat Penggunaan</span>
              </p>
            </header>

            <div className="prose max-w-none text-gray-700 space-y-6 [&_*]:!break-words [&_*]:!whitespace-normal leading-relaxed">
              <p>Selamat datang di portal <strong>PojokTV.com</strong>. Dengan mengunjungi dan membaca situs kami, Anda secara otomatis sepakat untuk tunduk pada seluruh aturan berikut ini:</p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Hak Cipta Konten</h3>
              <p>Semua materi jurnalistik berupa teks berita, foto liputan, video, logo, dan grafis di PojokTV.com dilindungi sah oleh Undang-Undang Hak Cipta. Segala bentuk penyalinan atau penggandaan konten untuk tujuan komersial tanpa izin tertulis dari pihak redaksi merupakan pelanggaran hukum.</p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Kutipan Berita</h3>
              <p>Penggunaan artikel PojokTV untuk bahan referensi tugas, penelitian, atau edukasi sangat diperbolehkan. Namun, pengguna diwajibkan mencantumkan tautan atau link aktif yang mengarah langsung ke halaman aslinya di situs PojokTV.com.</p>

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Tanggung Jawab Pengguna</h3>
              <p>Setiap pembaca dilarang keras menulis komentar yang memuat unsur SARA, hoaks, provokasi, atau ujaran kebencian. Tim redaksi PojokTV memegang hak penuh untuk menghapus komentar yang melanggar aturan tanpa perlu memberikan peringatan sebelumnya.</p>
            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
}
