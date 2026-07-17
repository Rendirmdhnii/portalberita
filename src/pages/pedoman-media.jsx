import Head from 'next/head';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function PedomanMedia({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Pedoman Pemberitaan Media Siber'} - PojokTV.com</title>
        <meta name="description" content="Pedoman pemberitaan media siber PojokTV.com sesuai dengan standar Dewan Pers Republik Indonesia." />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">
          {title || 'PEDOMAN PEMBERITAAN MEDIA SIBER'}
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
