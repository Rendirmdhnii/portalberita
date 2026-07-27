import Head from 'next/head';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function TentangKami({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Tentang Kami'} - PojokTV.com</title>
        <meta name="description" content="PojokTV.com adalah portal berita digital independen yang menyajikan jurnalisme akurat dan berimbang untuk masyarakat Indonesia." />
      </Head>
      <main className="w-full overflow-x-hidden bg-white">
        <div className="container mx-auto max-w-4xl px-4 md:px-8 py-8 md:py-12 text-gray-800 break-words whitespace-normal text-wrap overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900 break-words whitespace-normal leading-tight">
            {title || 'TENTANG KAMI'}
          </h1>
          <div 
            className="mt-6 md:mt-8 rich-text-content break-words whitespace-normal text-wrap max-w-full overflow-hidden"
            dangerouslySetInnerHTML={{ __html: content || '' }}
          />
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
