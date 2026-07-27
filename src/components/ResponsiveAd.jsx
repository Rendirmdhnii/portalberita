import React from 'react';

export default function ResponsiveAd({
  ad = null,
  linkTujuan = '',
  image = '',
  imageDesktop = '',
  imageTablet = '',
  imageMobile = '',
  desktopImageUrl = '',
  tabletImageUrl = '',
  mobileImageUrl = '',
  altText = 'Iklan PojokTV',
  className = '',
}) {
  const link = ad?.link || linkTujuan;
  const alt = ad?.name || altText;

  const desktopUrl = ad?.desktop_image_url || desktopImageUrl || imageDesktop || ad?.image || image;
  const tabletUrl = ad?.tablet_image_url || tabletImageUrl || imageTablet || desktopUrl || ad?.image || image;
  const mobileUrl = ad?.mobile_image_url || ad?.image_mobile_url || mobileImageUrl || imageMobile || ad?.image || image || tabletUrl || desktopUrl;

  const fallbackSrc = mobileUrl || tabletUrl || desktopUrl;

  if (!fallbackSrc) {
    return null;
  }

  const isValidUrl =
    typeof link === 'string' &&
    link.trim() !== '' &&
    link.trim() !== '#' &&
    link.trim() !== '-';

  const bannerContent = (
    <div className="w-full relative mx-auto rounded-lg overflow-hidden shadow-sm">
      <picture className="w-full h-auto block">
        {desktopUrl && <source media="(min-width: 1024px)" srcSet={desktopUrl} />}
        {tabletUrl && <source media="(min-width: 768px)" srcSet={tabletUrl} />}
        <img
          src={mobileUrl || fallbackSrc}
          alt={alt}
          className="w-full h-auto object-cover rounded-lg block mx-auto"
        />
      </picture>
    </div>
  );

  if (isValidUrl) {
    return (
      <a
        href={link.trim()}
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


