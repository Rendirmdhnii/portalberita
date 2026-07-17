import Head from 'next/head';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function TentangKami({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Tentang Kami'} - PojokTV.com</title>
        <meta name="description" content="PojokTV.com adalah portal berita digital independen yang menyajikan jurnalisme akurat dan berimbang untuk masyarakat Indonesia." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">
          {title || 'TENTANG KAMI'}
        </h1>
        <div 
          className="mt-8 rich-text-content"
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </div>
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
