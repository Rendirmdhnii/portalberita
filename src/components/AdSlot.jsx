import React from 'react';
import ResponsiveAd from './ResponsiveAd';

export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad || (!ad.image && !ad.image_mobile_url)) {
    return null;
  }

  return (
    <div className={`w-full block my-3 md:my-5 ${className}`}>
      <ResponsiveAd
        linkTujuan={ad.link}
        image={ad.image || ad.image_mobile_url}
        altText={ad.name || 'Iklan'}
      />
    </div>
  );
}
