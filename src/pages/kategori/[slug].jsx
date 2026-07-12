import Head from 'next/head';
import Link from 'next/link';
import PublicLayout from '@/layouts/PublicLayout';
import { supabase } from '@/lib/supabaseClient';

export default function CategoryPage({ category, posts = [], categories = [], ads = [], breakingNews = [] }) {
  if (!category) {
    return (
      <PublicLayout categories={categories} ads={ads} breakingNews={breakingNews}>
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500 text-lg">Kategori tidak ditemukan.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout categories={categories} ads={ads} breakingNews={breakingNews} title={`${category.name} - PojokTV`}>
      <Head>
        <meta name="description" content={`Berita terbaru kategori ${category.name} dari PojokTV.com`} />
      </Head>

      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-red-600 font-bold">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8 pb-4 border-b-4 border-red-600">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{category.name}</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 ml-5">
            {posts.length > 0 ? `${posts.length} artikel tersedia di rubrik ini` : 'Belum ada artikel di rubrik ini'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daftar Berita */}
          <div className="lg:col-span-2">
            {posts && posts.length > 0 ? (
              <div className="space-y-6">
                {/* Berita Pertama - Featured */}
                {posts[0] && (
                  <article className="border-b border-gray-200 pb-6">
                    {posts[0].image && (
                      <div className="overflow-hidden rounded-xl mb-4">
                        <img
                          src={posts[0].image.startsWith('http') ? posts[0].image : `/storage/${posts[0].image}`}
                          alt={posts[0].title}
                          className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3">
                      {posts[0].category}
                    </span>
                    <Link href={`/berita/${posts[0].slug}`}>
                      <h2 className="text-2xl font-black text-gray-900 hover:text-red-600 transition-colors leading-tight mb-3">
                        {posts[0].title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {posts[0].content?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span><i className="fa-regular fa-user mr-1"></i>{posts[0].author}</span>
                      <span>•</span>
                      <span><i className="fa-regular fa-eye mr-1"></i>{posts[0].views || 0} views</span>
                    </div>
                  </article>
                )}

                {/* Berita Lainnya - List Style */}
                {posts.slice(1).map(post => (
                  <article key={post.id} className="flex gap-4 border-b border-gray-100 pb-5 group">
                    {post.image ? (
                      <div className="shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={post.image.startsWith('http') ? post.image : `/storage/${post.image}`}
                          alt={post.title}
                          className="w-32 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="shrink-0 w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-newspaper text-2xl text-gray-400"></i>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-red-600 text-[10px] font-bold uppercase mb-1">{post.category}</span>
                      <Link href={`/berita/${post.slug}`}>
                        <h3 className="font-black text-gray-900 hover:text-red-600 transition-colors text-base leading-tight line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                        {post.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.views || 0} views</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl">
                <i className="fa-solid fa-newspaper text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-600 font-black text-lg">Belum ada berita di rubrik ini.</p>
                <p className="text-gray-400 text-sm mt-2">Silakan kunjungi kategori lain atau tunggu berita terbaru.</p>
                <Link href="/" className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
                  ← Kembali ke Beranda
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar Kanan */}
          <div className="lg:col-span-1 space-y-6">
            <div className="w-full h-[250px] bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-gray-400 border border-gray-700 rounded-xl">
              <i className="fa-solid fa-bullhorn text-3xl mb-2"></i>
              <span className="text-xs font-bold uppercase tracking-widest">Slot Iklan</span>
              <span className="text-xs text-gray-500">300 × 250</span>
            </div>

            {categories && categories.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-red-600 px-5 py-3">
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">Rubrik Lainnya</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {categories.filter(cat => cat.slug !== category.slug).slice(0, 6).map(cat => (
                    <li key={cat.id}>
                      <Link
                        href={`/kategori/${cat.slug}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-red-50 hover:text-red-600 transition-colors group"
                      >
                        <span className="font-bold text-sm text-gray-700 group-hover:text-red-600 transition-colors uppercase">
                          {cat.name}
                        </span>
                        <i className="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:text-red-500 transition-colors"></i>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
      { data: category },
      { data: categories },
      { data: ads },
      { data: breakingNews },
    ] = await Promise.all([
      supabase.from('categories').select('*').eq('slug', slug).single(),
      supabase.from('categories').select('*').eq('status', 'Aktif').order('name'),
      supabase.from('ads').select('*').eq('is_active', true),
      supabase.from('posts').select('id, title').eq('status', 'Published').order('created_at', { ascending: false }).limit(5),
    ]);

    if (!category) return { notFound: true };

    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'Published')
      .ilike('category', category.name)
      .order('created_at', { ascending: false });

    return {
      props: {
        category,
        posts: posts || [],
        categories: categories || [],
        ads: ads || [],
        breakingNews: breakingNews || [],
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
