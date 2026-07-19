export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad || !ad.image) {
    return null;
  }

  const isExternal = ad.link && ad.link.startsWith('http');
  const imgClass = "w-full h-auto object-contain block rounded-lg";

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
              className="block md:hidden w-full h-[130px] object-cover object-top rounded-lg shadow-sm" 
              alt={ad.name || "Iklan Mobile"} 
            />
            {/* Tampil HANYA di Desktop */}
            <img 
              src={ad.image} 
              className="hidden md:block w-full h-auto object-contain rounded-lg" 
              alt={ad.name || "Iklan Desktop"} 
            />
          </>
        ) : (
          <img 
            src={ad.image} 
            alt={ad.name || "Iklan Universal"} 
            className={imgClass}
          />
        )}
      </a>
    </div>
  );
}

