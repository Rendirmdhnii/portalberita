export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad || !ad.image) {
    return null;
  }

  const isExternal = ad.link && ad.link.startsWith('http');
  const isSidebar = size === '300x250' || size === '300x600' || ad.position?.includes('Sidebar');

  const imgClass = isSidebar
    ? "w-full h-auto object-contain block rounded-lg"
    : "w-full aspect-[21/9] md:aspect-[6/1] object-cover object-center block rounded-lg";

  return (
    <div className={`w-full h-auto overflow-hidden flex justify-center items-center rounded-lg ${className}`}>
      <a 
        href={ad.link && ad.link !== '-' ? ad.link : '#'} 
        target={isExternal ? "_blank" : "_self"} 
        rel="noreferrer"
        className="block w-full"
      >
        {ad.image_mobile_url ? (
          <>
            {/* Tampil HANYA di HP */}
            <img 
              src={ad.image_mobile_url} 
              className="block md:hidden w-full aspect-[21/9] object-cover object-center rounded-lg shadow-sm mx-auto" 
              alt={ad.name || "Iklan Mobile"} 
            />
            {/* Tampil HANYA di Desktop */}
            <img 
              src={ad.image} 
              className="hidden md:block w-full aspect-[6/1] object-cover object-center rounded-lg mx-auto" 
              alt={ad.name || "Iklan Desktop"} 
            />
          </>
        ) : (
          <img 
            src={ad.image} 
            alt={ad.name || "Iklan Universal"} 
            className={`${imgClass} mx-auto`}
          />
        )}
      </a>
    </div>
  );
}

