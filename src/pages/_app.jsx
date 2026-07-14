import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PojokTV - Jaringan Berita Nasional Terpercaya</title>
        <meta name="description" content="Portal berita terkini, tajam, dan independen. Menghadirkan informasi dan jurnalisme terpercaya dari seluruh penjuru nusantara setiap hari." />
        <meta name="keywords" content="berita terkini, pojoktv, berita nasional, politik, ekonomi, olahraga, indonesia" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-pojoktv.png" />
        <link rel="shortcut icon" href="/logo-pojoktv.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
