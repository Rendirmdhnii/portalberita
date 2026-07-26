import React from 'react';
import ResponsiveAd from './ResponsiveAd';

export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad) return null;

  const desktopUrl = ad.desktop_image_url || ad.image;
  const tabletUrl = ad.tablet_image_url || ad.image;
  const mobileUrl = ad.mobile_image_url || ad.image_mobile_url || ad.image;

  if (!desktopUrl && !tabletUrl && !mobileUrl) {
    return null;
  }

  return (
    <div className={`w-full block my-3 md:my-5 ${className}`}>
      <ResponsiveAd
        linkTujuan={ad.link}
        desktopImageUrl={desktopUrl}
        tabletImageUrl={tabletUrl}
        mobileImageUrl={mobileUrl}
        altText={ad.name || 'Iklan PojokTV'}
      />
    </div>
  );
}

