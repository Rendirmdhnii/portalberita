export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad || !ad.image) {
    return null;
  }

  const isExternal = ad.link && ad.link.startsWith('http');
  return (
    <div className={`w-full overflow-hidden flex justify-center items-center rounded-lg ${className}`}>
      <a 
        href={ad.link && ad.link !== '-' ? ad.link : '#'} 
        target={isExternal ? "_blank" : "_self"} 
        rel="noreferrer"
        className="block w-full"
      >
        <img 
          src={ad.image} 
          alt={ad.name || "Iklan PojokTV"} 
          className="w-full h-auto object-cover block rounded-lg"
        />
      </a>
    </div>
  );
}

