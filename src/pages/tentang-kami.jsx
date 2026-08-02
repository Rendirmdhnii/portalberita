import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

const cleanStaticContent = (html) => {
  if (!html) return '';
  return html.replace(/&shy;/g, '').replace(/\u00AD/g, '');
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
          <div className="relative overflow-hidden bg-slate-900 rounded-2xl shadow-xl mb-8 border border-slate-800 text-white p-6 sm:p-10 md:p-12">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute right-1/3 -top-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider rounded-full mb-4 shadow-sm">
                <span>PT. SARANA PERDANA MEDIA</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Tentang Kami & Susunan Redaksi
              </h1>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                PojokTV.com adalah portal berita digital independen yang menyajikan berita terkini, terpercaya, akurat, dan berimbang dengan menjunjung tinggi Kode Etik Jurnalistik dan Undang-Undang Pers.
              </p>
            </div>
          </div>

          {/* CMS Dynamic Content (jika ada) */}
          {content && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-3">Profil Perusahaan</h2>
              <div 
                className="rich-text-content text-slate-700 leading-relaxed break-words whitespace-normal text-left [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: cleanStaticContent(content) }}
              />
            </div>
          )}

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
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V11m0 0V5" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                  Manajemen Eksekutif
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Direktur Utama</span>
                    <span className="font-semibold text-slate-800">Mujianto Primadi</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Komisaris</span>
                    <span className="font-semibold text-slate-800">Hadi Waloyo</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Manajer Operasional</span>
                    <span className="font-semibold text-slate-800">Shandy Arifianto</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Manajer IT & Teknologi</span>
                    <span className="font-semibold text-slate-800">Muhammad Rendy Ramadhani</span>
                  </div>
                </ul>
              </div>

              {/* Card 2: Dapur Redaksi */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow lg:col-span-2">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                  Dapur Redaksi
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Penanggung Jawab</span>
                      <span className="font-semibold text-slate-800">Mujianto Primadi</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Pemimpin Redaksi</span>
                      <span className="font-semibold text-slate-800 block">Fanny Firmansyah</span>
                      <span className="inline-block text-[11px] text-slate-600 font-mono mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        No. UKW: PWI/WU/DP/VI/2022/30/10/76
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Redaktur Pelaksana</span>
                      <span className="font-semibold text-slate-800">Ari Prasetyo</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-medium">Redaktur / Editor</span>
                      <span className="font-semibold text-slate-800">Rizqullah Harya Prayoga</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium mb-2">Wartawan / Jurnalis</span>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">Sugeng Prasetyo</span>
                          <span className="text-[10px] text-slate-400">Liputan Sidoarjo</span>
                        </div>
                      </li>
                      <li className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">Muhammad Anas</span>
                          <span className="text-[10px] text-slate-400">Liputan Sidoarjo</span>
                        </div>
                      </li>
                      <li className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                        <div>
                          <span className="font-semibold text-slate-800 block text-xs">Anto</span>
                          <span className="text-[10px] text-slate-400">Liputan Surabaya</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 3: Tim Kreatif & Hukum */}
              <div className="space-y-6">
                {/* Tim Kreatif & Dukungan */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
                    Tim Kreatif & Dukungan
                  </h3>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Pemasaran & Iklan</span>
                    <span className="font-semibold text-slate-800 text-sm">Kristion</span>
                  </div>
                </div>

                {/* Hukum & Etika */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">
                    Hukum & Etika
                  </h3>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-medium">Kuasa Hukum</span>
                    <span className="font-semibold text-slate-800 text-sm">Bramada Pratama Putra, S.H., CPLA</span>
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
                  <span className="text-xs text-slate-400 font-medium block mb-1">Penerbit</span>
                  <span className="text-sm font-bold text-slate-900 block">PT. SARANA PERDANA MEDIA</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-medium block mb-1">Status Dewan Pers</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-amber-700">Dalam Proses</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-medium block mb-1">SK Kemenkumham</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block select-all">
                    AHU-0058215.AH.01.01.TAHUN 2026
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150">
                  <span className="text-xs text-slate-400 font-medium block mb-1">NIB (Nomor Induk Berusaha)</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block select-all">
                    2307260090052
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 sm:col-span-2 lg:col-span-2">
                  <span className="text-xs text-slate-400 font-medium block mb-1">NPWP Perusahaan</span>
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Kantor Redaksi & Operasional</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Perum Citra Pesona Buduran Blok E3 No. 25, RT. 037 RW. 007, Desa/Kelurahan Sidokepung, Kec. Buduran, Kab. Sidoarjo, Provinsi Jawa Timur 61252.
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150 hover:bg-emerald-50 hover:border-emerald-200 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Telepon / WhatsApp</span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Mujianto Primadi (+62 813-3116-0799)
                    </span>
                  </div>
                </a>

                {/* Email Redaksi */}
                <a 
                  href="mailto:redaksi@pojoktv.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Email Redaksi & Surat Pembaca</span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      redaksi@pojoktv.com
                    </span>
                  </div>
                </a>

                {/* Email Iklan */}
                <a 
                  href="mailto:redaksi@pojoktv.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-150 hover:bg-red-50 hover:border-red-200 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Email Kerjasama & Iklan</span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      redaksi@pojoktv.com
                    </span>
                  </div>
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

