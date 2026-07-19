export default function AdSlot({ size = "728x90", className = "", ad = null }) {
  if (!ad || !ad.image) {
    return null;
  }

  const isExternal = ad.link && ad.link.startsWith('http');
  const imgClass = size === "970x90"
    ? "w-full h-[120px] md:h-[160px] lg:h-[180px] object-cover block rounded-lg"
    : "w-full h-auto object-contain block rounded-lg";

  return (
    <div className={`w-full h-auto overflow-hidden flex justify-center items-center rounded-lg ${className}`}>
      <a 
        href={ad.link && ad.link !== '-' ? ad.link : '#'} 
        target={isExternal ? "_blank" : "_self"} 
        rel="noreferrer"
        className="block w-full"
      >
        <img 
          src={ad.image} 
          alt={ad.name || "Iklan PojokTV"} 
          className={imgClass}
        />
      </a>
    </div>
  );
}

