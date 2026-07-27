import React from 'react';
import ResponsiveAd from './ResponsiveAd';

export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad) return null;

  const hasAnyImage = ad.desktop_image_url || ad.tablet_image_url || ad.mobile_image_url || ad.image || ad.image_mobile_url;
  if (!hasAnyImage) {
    return null;
  }

  return (
    <div className={`w-full block my-3 md:my-5 ${className}`}>
      <ResponsiveAd ad={ad} />
    </div>
  );
}


