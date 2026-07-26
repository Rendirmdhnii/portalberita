import React from 'react';

export default function ResponsiveAd({
  linkTujuan = '',
  image,
  imageDesktop,
  imageTablet,
  imageMobile,
  desktopImageUrl,
  tabletImageUrl,
  mobileImageUrl,
  altText = 'Iklan PojokTV',
  className = '',
}) {
  const desktopUrl = desktopImageUrl || imageDesktop || image;
  const tabletUrl = tabletImageUrl || imageTablet || desktopUrl || image;
  const mobileUrl = mobileImageUrl || imageMobile || image;

  const fallbackSrc = mobileUrl || tabletUrl || desktopUrl;

  if (!fallbackSrc) {
    return null;
  }

  const isValidUrl =
    typeof linkTujuan === 'string' &&
    linkTujuan.trim() !== '' &&
    linkTujuan.trim() !== '#' &&
    linkTujuan.trim() !== '-';

  const bannerContent = (
    <div className="w-full relative mx-auto rounded-lg overflow-hidden shadow-sm">
      <picture className="w-full h-auto block">
        {desktopUrl && <source media="(min-width: 1024px)" srcSet={desktopUrl} />}
        {tabletUrl && <source media="(min-width: 768px)" srcSet={tabletUrl} />}
        <img
          src={mobileUrl || fallbackSrc}
          alt={altText}
          className="w-full h-auto object-cover rounded-lg block mx-auto"
        />
      </picture>
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

