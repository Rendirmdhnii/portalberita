import { supabase } from '@/lib/supabase';

const DOMAIN = 'https://pojoktv.com';

function generateSiteMap(categories = [], articles = []) {
  const staticPaths = [
    '',
    '/tentang-kami',
    '/kebijakan-privasi',
    '/ketentuan-layanan',
    '/pedoman-media',
  ];
 
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${staticPaths
       .map((path) => {
         return `
       <url>
           <loc>${DOMAIN}${path}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>daily</changefreq>
           <priority>${path === '' ? '1.00' : '0.80'}</priority>
       </url>
     `;
       })
       .join('')}
     ${categories
       .map((category) => {
         const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
         return `
       <url>
           <loc>${DOMAIN}/kategori/${categorySlug}</loc>
           <lastmod>${currentDate}</lastmod>
           <changefreq>hourly</changefreq>
           <priority>0.80</priority>
       </url>
     `;
       })
       .join('')}
     ${articles
       .map((article) => {
         const date = article.updated_at || article.created_at || currentDate;
         return `
       <url>
           <loc>${DOMAIN}/berita/${article.slug}</loc>
           <lastmod>${new Date(date).toISOString()}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.70</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  // Caching sitemap for 1 hour to avoid database overload
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=600'
  );

  try {
    // 1. Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('name')
      .eq('status', 'Aktif')
      .order('name');

    // 2. Fetch latest 1000 published articles
    const { data: articles } = await supabase
      .from('berita')
      .select('slug, created_at, updated_at')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(1000);

    const sitemapXml = generateSiteMap(categories || [], articles || []);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapXml);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.setHeader('Content-Type', 'text/xml');
    res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
    res.end();
  }

  return {
    props: {},
  };
}
