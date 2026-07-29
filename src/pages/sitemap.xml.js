import { supabase } from '@/lib/supabase';

function generateSiteMap(berita) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://pojoktv.com</loc>
       <changefreq>hourly</changefreq>
       <priority>1.0</priority>
     </url>
     ${berita
       .map(({ slug, created_at }) => {
         const escapedSlug = String(slug || '')
           .replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&apos;');
         const validDate = created_at ? new Date(created_at).toISOString() : new Date().toISOString();
         return `
       <url>
           <loc>https://pojoktv.com/berita/${escapedSlug}</loc>
           <lastmod>${validDate}</lastmod>
           <changefreq>daily</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  // Fetch hanya slug dan created_at (mencegah error 'column updated_at does not exist')
  const { data: berita, error } = await supabase
    .from('berita')
    .select('slug, created_at')
    .in('status', ['Published', 'publish'])
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('Error fetching sitemap data:', error);
  }

  const sitemap = generateSiteMap(berita || []);

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function SiteMap() {}
