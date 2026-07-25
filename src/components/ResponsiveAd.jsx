import React from 'react';

export default function ResponsiveAd({
  linkTujuan = '#',
  image,
  imageDesktop,
  imageMobile,
  altText = 'Iklan',
  className = '',
}) {
  const imgSrc = image || imageDesktop || imageMobile;

  if (!imgSrc) {
    return null;
  }

  return (
    <a
      href={linkTujuan || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full max-w-[1200px] mx-auto text-center ${className}`}
    >
      <img
        src={imgSrc}
        alt={altText}
        className="w-full h-auto object-contain max-h-[90px] md:max-h-[100px] mx-auto block rounded-lg shadow-sm"
      />
    </a>
  );
}
