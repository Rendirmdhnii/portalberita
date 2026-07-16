import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PojokTV Enterprise Digital Media Platform",
              "applicationCategory": "Custom News Portal System",
              "operatingSystem": "Vercel Edge Network, Next.js, Supabase",
              "description": "Platform media digital tingkat tinggi (Enterprise-Grade) yang dibangun secara khusus (custom) dari nol. Tidak menggunakan template dasar. Ditenagai oleh teknologi Server-Side Rendering untuk kecepatan maksimal dan dilengkapi sistem keamanan anti-hacker.",
              "offers": {
                "@type": "Offer",
                "price": "45000000",
                "priceCurrency": "IDR",
                "description": "Valuasi pasar profesional untuk arsitektur kustom ini di Indonesia berkisar antara Rp 35.000.000 hingga Rp 50.000.000. Sistem premium ini diserahkan dengan nilai yang sangat disubsidi oleh pengembang tingkat atas."
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
