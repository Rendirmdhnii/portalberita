import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function KebijakanPrivasi() {
  const title = 'KEBIJAKAN PRIVASI';

  return (
    <Layout>
      <Head>
        <title>{title} - PojokTV.com</title>
        <meta name="description" content="Kebijakan privasi PojokTV.com menjelaskan cara kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna." />
      </Head>
      <main className="w-full bg-slate-50/50 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto w-full overflow-hidden px-4 sm:px-6 md:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Kebijakan Privasi</span>
          </nav>

          {/* Article Container Card */}
          <div className="px-6 py-8 md:px-12 md:py-10 bg-white rounded-lg shadow-sm border border-slate-200/80">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md mb-3">
                Informasi Hukum & Privasi
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight text-left">
                {title}
              </h1>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <span>PojokTV.com</span>
                <span>•</span>
                <span>Diperbarui secara berkala</span>
              </p>
            </header>

            <div className="prose max-w-none text-gray-700 space-y-6 [&_*]:!break-words [&_*]:!whitespace-normal leading-relaxed">
              <p><strong>PojokTV.com</strong> sangat menghargai privasi Anda. Kami berkomitmen penuh menjaga keamanan data pribadi seluruh pengunjung. Halaman ini memuat aturan mengenai cara kami mencatat, memakai, serta melindungi data Anda saat membaca portal berita kami.</p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Pengumpulan Data</h3>
              <p>Sistem kami secara otomatis mencatat info teknis non-pribadi. Contohnya seperti alamat IP, jenis browser, dan rekaman kunjungan. Kami memakai teknologi cookies murni untuk meningkatkan kenyamanan visual (UI/UX) dan menyajikan berita yang relevan.</p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Penggunaan Informasi</h3>
              <p>Seluruh data yang terkumpul hanya dipakai untuk keperluan internal PojokTV. Mulai dari analisis trafik, optimasi server, hingga perbaikan fitur web. Kami tidak akan pernah menjual atau membagikan data Anda kepada pihak ketiga tanpa izin resmi, kecuali jika diwajibkan oleh hukum dan perundang-undangan di Republik Indonesia.</p>
            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
}
