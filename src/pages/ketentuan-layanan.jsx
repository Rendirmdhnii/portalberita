import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

const cleanStaticContent = (html) => {
  if (!html) return '';
  return html.replace(/&shy;/g, '').replace(/\u00AD/g, '');
};

export default function KetentuanLayanan({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Ketentuan Layanan'} - PojokTV.com</title>
        <meta name="description" content="Ketentuan layanan (Terms of Service) penggunaan situs PojokTV.com." />
      </Head>
      <main className="w-full bg-slate-50/50 py-8 sm:py-12 md:py-16 !break-normal !whitespace-normal !text-left">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Ketentuan Layanan</span>
          </nav>

          {/* Article Container Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl px-6 py-8 md:px-10 md:py-12 shadow-sm !break-normal !whitespace-normal !text-left">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md mb-3">
                Informasi Hukum & Layanan
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight !break-normal !whitespace-normal !text-left">
                {title || 'KETENTUAN LAYANAN (TERMS OF SERVICE)'}
              </h1>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <span>PojokTV.com</span>
                <span>•</span>
                <span>Aturan & Syarat Penggunaan</span>
              </p>
            </header>

            <div 
              className="rich-text-content space-y-6 !text-left !text-gray-700 !leading-[1.8] !break-normal !whitespace-normal [word-break:normal!important] [overflow-wrap:normal!important]"
              dangerouslySetInnerHTML={{ __html: cleanStaticContent(content) }}
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
      .eq('slug', 'ketentuan-layanan')
      .single();

    if (error) throw error;

    return {
      props: {
        content: data?.konten || '',
        title: data?.judul || 'KETENTUAN LAYANAN (TERMS OF SERVICE)',
      },
    };
  } catch (err) {
    console.error('Error fetching ketentuan-layanan content:', err);
    return {
      props: {
        content: '',
        title: 'KETENTUAN LAYANAN (TERMS OF SERVICE)',
      },
    };
  }
}
