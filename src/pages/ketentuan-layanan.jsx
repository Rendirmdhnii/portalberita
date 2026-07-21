import Head from 'next/head';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

export default function KetentuanLayanan({ content, title }) {
  return (
    <Layout>
      <Head>
        <title>{title || 'Ketentuan Layanan'} - PojokTV.com</title>
        <meta name="description" content="Ketentuan layanan (Terms of Service) penggunaan situs PojokTV.com." />

      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800">
        <h1 className="text-3xl font-black mb-2 uppercase border-b-4 border-red-600 pb-3 text-slate-900">
          {title || 'KETENTUAN LAYANAN (TERMS OF SERVICE)'}
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
