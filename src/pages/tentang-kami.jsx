import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function TentangKami({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Tentang Kami'} - PojokTV.com</title>
        <meta name="description" content="PojokTV.com adalah portal berita digital independen yang menyajikan jurnalisme akurat dan berimbang untuk masyarakat Indonesia." />
      </Head>
      <main className="w-full bg-slate-50/50 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-5 sm:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Tentang Kami</span>
          </nav>

          {/* Article Container Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 md:p-12 shadow-sm break-normal [word-break:normal]">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md mb-3">
                Tentang Perusahaan & Redaksi
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight break-normal [word-break:normal]">
                {title || 'TENTANG KAMI'}
              </h1>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <span>PojokTV.com</span>
                <span>•</span>
                <span>Jaringan Berita Nasional Terpercaya</span>
              </p>
            </header>

            <div 
              className="rich-text-content space-y-6 text-left text-gray-700 leading-relaxed break-normal whitespace-normal [word-break:normal]"
              dangerouslySetInnerHTML={{ __html: content || '' }}
            />
          </article>

        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const { data, error } = await supabase
      .from('halaman_statis')
      .select('judul, konten')
      .eq('slug', 'tentang-kami')
      .single();

    if (error) throw error;

    return {
      props: {
        content: data?.konten || '',
        title: data?.judul || 'TENTANG KAMI',
      },
    };
  } catch (err) {
    console.error('Error fetching tentang-kami content:', err);
    return {
      props: {
        content: '',
        title: 'TENTANG KAMI',
      },
    };
  }
}
