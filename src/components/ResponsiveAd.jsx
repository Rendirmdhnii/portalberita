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
      <div className="w-full aspect-[3.2/1] md:aspect-[4.8/1] overflow-hidden relative mx-auto rounded-lg shadow-sm">
        <img
          src={imgSrc}
          alt={altText}
          className="w-full h-full object-cover"
        />
      </div>
    </a>
  );
}
