import React from 'react';

export default function ResponsiveAd({
  linkTujuan = '#',
  imageDesktop,
  imageMobile,
  altText = 'Iklan',
  className = '',
}) {
  const desktopSrc = imageDesktop || imageMobile;
  const mobileSrc = imageMobile || imageDesktop;

  if (!desktopSrc && !mobileSrc) {
    return null;
  }

  return (
    <a
      href={linkTujuan || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full max-w-[1200px] mx-auto group ${className}`}
    >
      {/* Desktop Ad View (Hidden on Mobile) */}
      <div className="hidden md:flex relative w-full max-h-[250px] overflow-hidden bg-gray-900 rounded-lg items-center justify-center min-h-[90px]">
        {/* Layer Background Blur (z-0) */}
        <img
          src={desktopSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none z-0"
        />
        {/* Layer Foreground Preserved 100% (z-10) */}
        <img
          src={desktopSrc}
          alt={altText}
          className="relative z-10 w-full max-h-[250px] h-full object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>

      {/* Mobile Ad View (Hidden on Desktop) */}
      <div className="flex md:hidden relative w-full max-h-[250px] overflow-hidden bg-gray-900 rounded-lg items-center justify-center min-h-[90px]">
        {/* Layer Background Blur (z-0) */}
        <img
          src={mobileSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none z-0"
        />
        {/* Layer Foreground Preserved 100% (z-10) */}
        <img
          src={mobileSrc}
          alt={altText}
          className="relative z-10 w-full max-h-[250px] h-full object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>
    </a>
  );
}
