import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

const cleanStaticContent = (html) => {
  if (!html) return '';
  return html
    .replace(/&shy;/g, '')
    .replace(/\u00AD/g, '')
    .replace(/(\w+)-\s+(\w+)/g, '$1$2')
    .replace(/\bbreak-all\b/g, 'break-words')
    .replace(/word-break:\s*break-all;?/gi, 'word-break: break-words;');
};

export default function TentangKami({ content, title }) {
  const metaTitle = "Tentang Kami & Susunan Redaksi - PojokTV.com";
  const metaDescription = "Susunan Redaksi, Manajemen, Legalitas Perusahaan PT. SARANA PERDANA MEDIA, dan Alamat Kantor Resmi PojokTV.com.";
  const canonicalUrl = "https://pojoktv.com/tentang-kami";
  const ogImage = "https://pojoktv.com/logo-pojoktv.png";

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="PojokTV" />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <main className="w-full bg-slate-50/60 py-6 sm:py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Tentang Kami</span>
          </nav>

          {/* Hero Header Card */}
          <div className="relative overflow-hidden bg-slate-900 rounded-2xl shadow-lg mb-8 border border-slate-800 text-white p-6 sm:p-8 md:p-10">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-block px-3 py-1 bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full mb-3">
                PT. SARANA PERDANA MEDIA
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Tentang Kami & Susunan Redaksi
              </h1>
            </div>
          </div>

          {/* Section 1: Susunan Redaksi & Manajemen */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
              <div className="w-1.5 h-7 bg-red-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Susunan Redaksi & Manajemen
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Manajemen Eksekutif */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:border-slate-300 transition-colors">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                  <span>Manajemen Eksekutif</span>
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Direktur Utama</span>
                    <span className="font-bold text-slate-900">Mujianto Primadi</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Komisaris</span>
                    <span className="font-bold text-slate-900">Hadi Waloyo</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Manajer Operasional</span>
                    <span className="font-bold text-slate-900">Shandy Arifianto</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Manajer IT & Teknologi</span>
                    <span className="font-bold text-slate-900">Muhammad Rendy Ramadhani</span>
                  </div>
                </ul>
              </div>

              {/* Card 2: Dapur Redaksi */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:border-slate-300 transition-colors lg:col-span-2">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  Dapur Redaksi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Penanggung Jawab</span>
                      <span className="font-bold text-slate-900">Mujianto Primadi</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Pemimpin Redaksi</span>
                      <span className="font-bold text-slate-900 block">Fanny Firmansyah</span>
                      <span className="inline-block text-[11px] text-slate-600 font-mono mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        No. UKW: PWI/WU/DP/VI/2022/30/10/76
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Redaktur Pelaksana</span>
                      <span className="font-bold text-slate-900">Ari Prasetyo</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Redaktur / Editor</span>
                      <span className="font-bold text-slate-900">Rizqullah Harya Prayoga</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider mb-2.5">Wartawan / Jurnalis</span>
                    <ul className="space-y-2">
                      <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                        <span className="font-bold text-slate-900 block text-xs">Sugeng Prasetyo</span>
                        <span className="text-[10px] text-slate-500 font-medium">Liputan Sidoarjo</span>
                      </li>
                      <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                        <span className="font-bold text-slate-900 block text-xs">Muhammad Anas</span>
                        <span className="text-[10px] text-slate-500 font-medium">Liputan Sidoarjo</span>
                      </li>
                      <li className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                        <span className="font-bold text-slate-900 block text-xs">Anto</span>
                        <span className="text-[10px] text-slate-500 font-medium">Liputan Surabaya</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 3: Tim Kreatif & Hukum */}
              <div className="space-y-6">
                {/* Tim Kreatif & Dukungan */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:border-slate-300 transition-colors">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">
                    Tim Kreatif & Dukungan
                  </h3>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Pemasaran & Iklan</span>
                    <span className="font-bold text-slate-900 text-sm">Kristion</span>
                  </div>
                </div>

                {/* Hukum & Etika */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:border-slate-300 transition-colors">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">
                    Hukum & Etika
                  </h3>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Kuasa Hukum</span>
                    <span className="font-bold text-slate-900 text-sm">Bramada Pratama Putra, S.H., CPLA</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Data Perusahaan & Legalitas */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
              <div className="w-1.5 h-7 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Data Perusahaan & Legalitas
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Penerbit</span>
                  <span className="text-sm font-bold text-slate-900 block">PT. SARANA PERDANA MEDIA</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Legalitas Pers</span>
                  <span className="text-sm font-bold text-slate-900 block">Mengacu pada UU Pers No. 40 Tahun 1999</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">SK Kemenkumham</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block select-all">
                    AHU-0058215.AH.01.01.TAHUN 2026
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">NIB (Nomor Induk Berusaha)</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block select-all">
                    2307260090052
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 sm:col-span-2 lg:col-span-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">NPWP Perusahaan</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block select-all">
                    1000 0000 1046 8272
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Section 3: Alamat Kantor & Kontak */}
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-3">
              <div className="w-1.5 h-7 bg-emerald-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Alamat Kantor & Kontak
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Alamat Kantor */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-3">Kantor Redaksi & Operasional</h3>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4 font-normal">
                    Kawasan Citra Pesona Blok E3 No. 25, Sidokepung, Buduran, Sidoarjo, Jawa Timur 61252.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                  PT. SARANA PERDANA MEDIA • Sidoarjo, Jawa Timur
                </div>
              </div>

              {/* Kontak & Email */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-4">
                
                {/* Telepon / WA */}
                <a 
                  href="https://wa.me/6281331160799" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl bg-slate-50 border border-slate-150 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                >
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Telepon / WhatsApp</span>
                  <span className="text-sm font-bold text-slate-900">
                    Mujianto Primadi (+62 813-3116-0799)
                  </span>
                </a>

                {/* Email Redaksi */}
                <a 
                  href="mailto:redaksi@pojoktv.com"
                  className="block p-4 rounded-xl bg-slate-50 border border-slate-150 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
                >
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Email Redaksi & Surat Pembaca</span>
                  <span className="text-sm font-bold text-slate-900">
                    redaksi@pojoktv.com
                  </span>
                </a>

                {/* Email Iklan */}
                <a 
                  href="mailto:redaksi@pojoktv.com"
                  className="block p-4 rounded-xl bg-slate-50 border border-slate-150 hover:bg-red-50/50 hover:border-red-200 transition-colors"
                >
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Email Kerjasama & Iklan</span>
                  <span className="text-sm font-bold text-slate-900">
                    redaksi@pojoktv.com
                  </span>
                </a>

              </div>

            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const { data } = await supabase
      .from('halaman_statis')
      .select('judul, konten')
      .eq('slug', 'tentang-kami')
      .single();

    return {
      props: {
        content: data?.konten || '',
        title: data?.judul || 'TENTANG KAMI',
      },
    };
  } catch (err) {
    return {
      props: {
        content: '',
        title: 'TENTANG KAMI',
      },
    };
  }
}
