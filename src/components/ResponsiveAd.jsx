import React from 'react';

export default function ResponsiveAd({
  linkTujuan = '',
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

  const isValidUrl =
    typeof linkTujuan === 'string' &&
    linkTujuan.trim() !== '' &&
    linkTujuan.trim() !== '#' &&
    linkTujuan.trim() !== '-';

  const bannerContent = (
    <div className="w-full aspect-[3.2/1] md:aspect-[4.8/1] overflow-hidden relative mx-auto rounded-lg shadow-sm">
      <img
        src={imgSrc}
        alt={altText}
        className="w-full h-full object-cover"
      />
    </div>
  );

  if (isValidUrl) {
    return (
      <a
        href={linkTujuan.trim()}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full max-w-[1200px] mx-auto text-center ${className}`}
      >
        {bannerContent}
      </a>
    );
  }

  return (
    <div className={`w-full max-w-[1200px] mx-auto text-center ${className}`}>
      {bannerContent}
    </div>
  );
}
