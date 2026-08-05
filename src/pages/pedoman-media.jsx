import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const cleanStaticContent = (html) => {
  if (!html) return '';
  return html
    .replace(/&shy;/g, '')
    .replace(/\u00AD/g, '')
    .replace(/&#173;/g, '')
    .replace(/&#8203;/g, '')
    .replace(/\u200B/g, '')
    .replace(/(\w+)-\s+(\w+)/g, '$1$2')
    .replace(/\bbreak-all\b/g, 'break-normal')
    .replace(/\bbreak-words\b/g, 'break-normal')
    .replace(/word-break:\s*break-all;?/gi, 'word-break: normal;')
    .replace(/word-break:\s*break-word;?/gi, 'word-break: normal;');
};

export default function PedomanMedia({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Pedoman Pemberitaan Media Siber'} - PojokTV.com</title>
        <meta name="description" content="Pedoman pemberitaan media siber PojokTV.com sesuai dengan standar Dewan Pers Republik Indonesia." />
      </Head>
      <main className="w-full bg-slate-50/50 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto w-full overflow-hidden px-4 sm:px-6 md:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Pedoman Media Siber</span>
          </nav>

          {/* Article Container Card */}
          <div className="px-6 py-8 md:px-12 md:py-10 bg-white rounded-lg shadow-sm border border-slate-200/80">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md mb-3">
                Standar Jurnalistik Dewan Pers
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight text-left">
                {title || 'PEDOMAN PEMBERITAAN MEDIA SIBER'}
              </h1>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <span>PojokTV.com</span>
                <span>•</span>
                <span>Pedoman Etika & Jurnalistik</span>
              </p>
            </header>

            <div 
              className="rich-text-content text-gray-700 leading-relaxed mb-5 [&_*]:!break-words [&_*]:!whitespace-normal prose max-w-none text-left [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-left"
              style={{ wordBreak: 'normal', overflowWrap: 'break-word', wordWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: cleanStaticContent(content) }}
            />
          </div>

        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps({ res }) {
  if (res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }

  try {
    const { data, error } = await supabase
      .from('halaman_statis')
      .select('judul, konten')
      .eq('slug', 'pedoman-media')
      .single();

    if (error) throw error;

    return {
      props: {
        content: data?.konten || '',
        title: data?.judul || 'PEDOMAN PEMBERITAAN MEDIA SIBER',
      },
    };
  } catch (err) {
    console.error('Error fetching pedoman-media content:', err);
    return {
      props: {
        content: '',
        title: 'PEDOMAN PEMBERITAAN MEDIA SIBER',
      },
    };
  }
}
