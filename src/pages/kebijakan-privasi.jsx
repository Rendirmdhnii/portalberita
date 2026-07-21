import Head from 'next/head';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function KebijakanPrivasi({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Kebijakan Privasi'} - PojokTV.com</title>
        <meta name="description" content="Kebijakan privasi PojokTV.com menjelaskan cara kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna." />

      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">
          {title || 'KEBIJAKAN PRIVASI'}
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
