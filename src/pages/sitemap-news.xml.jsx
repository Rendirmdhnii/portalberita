import { supabase } from '@/lib/supabase';

const DOMAIN = 'https://pojoktv.com';

function generateNewsSiteMap(articles = []) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
     ${articles
       .map((article) => {
         const publishedDate = article.created_at ? new Date(article.created_at).toISOString() : new Date().toISOString();
         const escapedTitle = (article.title || '')
           .replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&apos;');
           
         return `
       <url>
           <loc>${DOMAIN}/berita/${article.slug}</loc>
           <news:news>
               <news:publication>
                   <news:name>PojokTV</news:name>
                   <news:language>id</news:language>
               </news:publication>
               <news:publication_date>${publishedDate}</news:publication_date>
               <news:title>${escapedTitle}</news:title>
           </news:news>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export default function NewsSitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  // Caching news sitemap for 10 minutes (600s) to keep it fresh for crawler bots
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=120'
  );

  try {
    // 1. Fetch articles published in the last 48 hours
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    let { data: articles } = await supabase
      .from('berita')
      .select('slug, title, created_at')
      .eq('status', 'Published')
      .gte('created_at', twoDaysAgo)
      .order('created_at', { ascending: false })
      .limit(1000);

    // Fallback: If no articles published in last 48 hours, return latest 100 articles
    if (!articles || articles.length === 0) {
      const { data } = await supabase
        .from('berita')
        .select('slug, title, created_at')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(100);
      articles = data || [];
    }

    const sitemapXml = generateNewsSiteMap(articles);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemapXml);
    res.end();
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    res.setHeader('Content-Type', 'text/xml');
    res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"></urlset>`);
    res.end();
  }

  return {
    props: {},
  };
}
