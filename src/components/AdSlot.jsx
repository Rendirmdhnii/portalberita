import React from 'react';
import ResponsiveAd from './ResponsiveAd';

export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad || (!ad.image && !ad.image_mobile_url)) {
    return null;
  }

  return (
    <div className={`w-full h-auto flex justify-center items-center ${className}`}>
      <ResponsiveAd
        linkTujuan={ad.link && ad.link !== '-' ? ad.link : '#'}
        imageDesktop={ad.image}
        imageMobile={ad.image_mobile_url || ad.image}
        altText={ad.name || 'Iklan'}
      />
    </div>
  );
}
