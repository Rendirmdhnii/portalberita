import { supabase } from '@/lib/supabase';

const DOMAIN = 'https://pojoktv.com';

const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

function generateSiteMap(categories = [], articles = []) {
  const staticPaths = [
    { path: '', priority: '1.00', changefreq: 'daily' },
    { path: '/tentang-kami', priority: '0.80', changefreq: 'monthly' },
    { path: '/kebijakan-privasi', priority: '0.80', changefreq: 'monthly' },
    { path: '/ketentuan-layanan', priority: '0.80', changefreq: 'monthly' },
    { path: '/pedoman-media', priority: '0.80', changefreq: 'monthly' },
  ];

  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPaths
    .map((item) => `
    <url>
        <loc>${DOMAIN}${item.path}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${item.changefreq}</changefreq>
        <priority>${item.priority}</priority>
    </url>`)
    .join('')}
  ${categories
    .map((category) => {
      const categorySlug = escapeXml(category.slug || category.name.toLowerCase().replace(/\s+/g, '-'));
      return `
    <url>
        <loc>${DOMAIN}/kategori/${categorySlug}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.80</priority>
    </url>`;
    })
    .join('')}
  ${articles
    .map((article) => {
      const articleSlug = escapeXml(article.slug);
      const lastmodDate = article.updated_at || article.created_at || currentDate;
      const formattedDate = new Date(lastmodDate).toISOString();
      return `
    <url>
        <loc>${DOMAIN}/berita/${articleSlug}</loc>
        <lastmod>${formattedDate}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.70</priority>
    </url>`;
    })
    .join('')}
</urlset>`;
}

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  // Caching sitemap for 1 hour to prevent DB overload while serving fast XML
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=600'
  );

  try {
    // 1. Fetch active categories
    const { data: categories } = await supabase
      .from('categories')
      .select('name, slug')
      .eq('status', 'Aktif')
      .order('name');

    // 2. Fetch published articles
    const { data: articles } = await supabase
      .from('berita')
      .select('slug, created_at, updated_at')
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(5000);

    const sitemapXml = generateSiteMap(categories || [], articles || []);

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.write(sitemapXml);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap.xml:', error);
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
    res.end();
  }

  return {
    props: {},
  };
}
