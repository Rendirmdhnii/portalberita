import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicLayout({ children, user }) {
    const { global_ads } = usePage().props;
    const headerAd = global_ads?.find(ad => ad.position === 'Header' || ad.position === 'Header (728x90)' || ad.posisi === 'Header (728x90)' || ad.position === 'header');
    const footerAd = global_ads?.find(ad => ad.position === 'Footer' || ad.position === 'Footer (970x250)' || ad.posisi === 'Footer (970x250)' || ad.position === 'footer');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Ad Management Logic
    const hasPremiumAccess = user && (user.role === 'subscriber' || user.role === 'super_admin');
    const showAds = !hasPremiumAccess;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
            {/* Navbar Utama Sesuai Branding */}
            <Navbar />

            {/* Header Ad Placement */}
            {showAds && (
                <div className="w-full px-4 sm:px-0 my-6 flex justify-center">
                    {headerAd ? (
                        <a href={headerAd.link && headerAd.link !== '-' ? headerAd.link : '#'} target="_blank" rel="noreferrer" 
                           className="block w-full max-w-[728px] aspect-[8/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                            <img src={`/storage/${headerAd.image}`} alt={headerAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                        </a>
                    ) : (
                        <div className="bg-gray-100 text-center py-6 text-gray-400 text-xs w-full max-w-[728px] aspect-[8/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                            [ Slot Iklan Header (Banner) 728x90 ]
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main className="w-full bg-gray-50 px-4">
                <div className="w-full max-w-[1200px] mx-auto px-4">
                    {children}
                </div>
            </main>

            {/* Footer Ad Placement */}
            {showAds && (
                <div className="w-full px-4 sm:px-0 my-8 flex justify-center border-t border-gray-100 pt-8">
                    {footerAd ? (
                        <a href={footerAd.link && footerAd.link !== '-' ? footerAd.link : '#'} target="_blank" rel="noreferrer" 
                           className="block w-full max-w-[970px] aspect-[4/1] bg-gray-100 overflow-hidden rounded-lg shadow-sm border border-gray-200">
                            <img src={`/storage/${footerAd.image}`} alt={footerAd.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
                        </a>
                    ) : (
                        <div className="bg-gray-100 text-center py-12 text-gray-400 text-xs w-full max-w-[970px] aspect-[4/1] rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                            [ Slot Iklan Footer (Banner) 970x250 ]
                        </div>
                    )}
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}
