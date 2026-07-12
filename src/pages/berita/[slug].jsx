import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';
import { supabase } from '@/lib/supabaseClient';

export default function ArticlePage({ post, categories = [], ads = [], breakingNews = [], relatedPosts = [] }) {
  if (!post) {
    return (
      <PublicLayout categories={categories} breakingNews={breakingNews} ads={ads}>
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500 text-lg">Berita tidak ditemukan.</p>
        </div>
      </PublicLayout>
    );
  }

  const catSlug = post.category ? post.category.toLowerCase().replace(/\s+/g, '-') : 'berita';
  const authorDisplay = (author) =>
    author === 'Superadmin' || author === 'superadmin' ? 'Tim Redaksi PojokTV' : (author || 'Tim Redaksi PojokTV');

  return (
    <PublicLayout categories={categories} breakingNews={breakingNews} ads={ads} title={`${post.title} - PojokTV`}>
      <Head>
        <meta name="description" content={post.content?.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.image ? (post.image.startsWith('http') ? post.image : `/storage/${post.image}`) : ''} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri - Artikel Utama */}
        <div className="lg:col-span-2">

          {/* Breadcrumb */}
          <nav className="breadcrumbs">
            <Link href="/">Beranda</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <Link href={`/kategori/${catSlug}`}>{post.category || 'Berita'}</Link>
            <i className="fa-solid fa-chevron-right"></i>
            <span className="text-red-600 line-clamp-1">{post.title}</span>
          </nav>

          {/* Category badge */}
          <Link href={`/kategori/${catSlug}`} className="text-red-600 font-bold uppercase tracking-wider text-sm hover:underline block mb-2">
            {post.category || 'Berita'}
          </Link>

          {/* Judul */}
          <h1 className="article-headline">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center text-gray-500 text-sm mb-6 pb-4 border-b border-gray-200 flex-wrap gap-4">
            <span className="font-bold text-gray-900 mr-2">Oleh: {authorDisplay(post.author)}</span>
            <span>Diterbitkan: {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="border-l border-gray-300 pl-4">{(post.views || 0).toLocaleString('id-ID')} Kali Dibaca</span>
          </div>

          {/* Gambar Utama */}
          {post.image && (
            <div className="w-full mb-6">
              <img
                src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                alt={post.title}
                className="w-full h-auto max-h-[600px] rounded-lg object-cover"
              />
              <span className="text-xs text-gray-500 italic mt-2 block">Ilustrasi: {post.title}</span>
            </div>
          )}

          {/* Social Share + Konten */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-12 flex md:flex-col gap-4 sticky top-24 h-max py-2">
              <button
                className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')}
              >
                <i className="fa-brands fa-whatsapp"></i>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <i className="fa-brands fa-facebook"></i>
              </button>
              <button
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <i className="fa-brands fa-x-twitter"></i>
              </button>
            </div>

            <div className="flex-1 relative">
              <div
                className="article-body-text prose max-w-none text-gray-800 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Sidebar */}
        <div className="lg:col-span-1 border-l border-gray-200 pl-0 lg:pl-8 mt-8 lg:mt-0">
          <div className="mb-8">
            <h3 className="text-xl font-black border-l-4 border-red-600 pl-3 mb-6">BERITA TERPOPULER</h3>
            {relatedPosts.map((p, idx) => (
              <div key={p.id} className="flex gap-4 mb-4 border-b border-gray-100 pb-4">
                <span className="text-4xl font-black text-gray-200">{idx + 1}</span>
                <Link href={`/berita/${p.slug}`}>
                  <h4 className="font-bold text-sm hover:text-red-600 cursor-pointer">{p.title}</h4>
                </Link>
              </div>
            ))}
          </div>
          <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm border border-gray-300">
            [ Iklan 300x250 ]
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  try {
    const [
      { data: post },
      { data: categories },
      { data: ads },
      { data: breakingNews },
      { data: relatedPosts },
    ] = await Promise.all([
      supabase.from('posts').select('*').eq('slug', slug).eq('status', 'Published').single(),
      supabase.from('categories').select('*').eq('status', 'Aktif').order('name'),
      supabase.from('ads').select('*').eq('is_active', true),
      supabase.from('posts').select('id, title').eq('status', 'Published').order('created_at', { ascending: false }).limit(5),
      supabase.from('posts').select('id, title, slug').eq('status', 'Published').order('views', { ascending: false }).limit(5),
    ]);

    if (!post) return { notFound: true };

    // Increment views (fire and forget)
    supabase.from('posts').update({ views: (post.views || 0) + 1 }).eq('slug', slug).then(() => {});

    return {
      props: {
        post,
        categories: categories || [],
        ads: ads || [],
        breakingNews: breakingNews || [],
        relatedPosts: relatedPosts || [],
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
