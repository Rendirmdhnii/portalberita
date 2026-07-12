import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';

export default function PublicLayout({ children, categories = [], breakingNews = [], ads = [], title, description }) {
  const headerAd = ads?.find(ad => ad.position === 'Header' || ad.position === 'Header (728x90)' || ad.position === 'header');
  const footerAd = ads?.find(ad => ad.position === 'Footer' || ad.position === 'Footer (970x250)' || ad.position === 'footer');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
      {title && (
        <Head>
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
        </Head>
      )}

      <Navbar categories={categories} breakingNews={breakingNews} />

      {/* Header Ad Placement */}
      <div className="w-full px-4 sm:px-0 my-6 flex justify-center">
        {headerAd ? (
          <a
            href={headerAd.link && headerAd.link !== '-' ? headerAd.link : '#'}
            target="_blank"
            rel="noreferrer"
            className="block w-full max-w-[728px] aspect-[8/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200"
          >
            <img src={headerAd.image} alt={headerAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
          </a>
        ) : (
          <div className="bg-gray-100 text-center py-6 text-gray-400 text-xs w-full max-w-[728px] aspect-[8/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            [ Slot Iklan Header (Banner) 728x90 ]
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="w-full bg-gray-50 px-4">
        <div className="w-full max-w-[1200px] mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Footer Ad Placement */}
      <div className="w-full px-4 sm:px-0 my-8 flex justify-center border-t border-gray-100 pt-8">
        {footerAd ? (
          <a
            href={footerAd.link && footerAd.link !== '-' ? footerAd.link : '#'}
            target="_blank"
            rel="noreferrer"
            className="block w-full max-w-[970px] aspect-[4/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200"
          >
            <img src={footerAd.image} alt={footerAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
          </a>
        ) : (
          <div className="bg-gray-100 text-center py-12 text-gray-400 text-xs w-full max-w-[970px] aspect-[4/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            [ Slot Iklan Footer (Banner) 970x250 ]
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
