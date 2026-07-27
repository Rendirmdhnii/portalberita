import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function KebijakanPrivasi({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Kebijakan Privasi'} - PojokTV.com</title>
        <meta name="description" content="Kebijakan privasi PojokTV.com menjelaskan cara kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna." />
      </Head>
      <main className="w-full bg-slate-50/50 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-5 sm:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold">Kebijakan Privasi</span>
          </nav>

          {/* Article Container Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 md:p-12 shadow-sm">
            <header className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-md mb-3">
                Informasi Hukum & Privasi
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {title || 'KEBIJAKAN PRIVASI'}
              </h1>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
                <span>PojokTV.com</span>
                <span>•</span>
                <span>Diperbarui secara berkala</span>
              </p>
            </header>

            <div 
              className="rich-text-content space-y-6 text-left text-gray-700 leading-relaxed break-words whitespace-normal"
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
      .eq('slug', 'kebijakan-privasi')
      .single();

    if (error) throw error;

    return {
      props: {
        content: data?.konten || '',
        title: data?.judul || 'KEBIJAKAN PRIVASI',
      },
    };
  } catch (err) {
    console.error('Error fetching kebijakan-privasi content:', err);
    return {
      props: {
        content: '',
        title: 'KEBIJAKAN PRIVASI',
      },
    };
  }
}
