import React from 'react';

export default function ResponsiveAd({
  linkTujuan = '#',
  imageDesktop,
  imageMobile,
  altText = 'Iklan',
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
      className="block w-full max-w-[1200px] mx-auto text-center"
    >
      <img
        src={desktopSrc}
        alt={altText}
        className="hidden md:inline-block w-full h-auto object-contain"
      />
      <img
        src={mobileSrc}
        alt={altText}
        className="inline-block md:hidden w-full h-auto object-contain"
      />
    </a>
  );
}
