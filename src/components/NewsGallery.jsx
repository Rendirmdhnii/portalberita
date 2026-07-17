import React, { useState } from 'react';
import Image from 'next/image';

export default function NewsGallery({ images, caption }) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="w-full mb-6">
      {/* Wrapper */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm mb-4 group">
        <Image
          src={images[currentImageIndex]}
          alt="Foto Utama Berita"
          fill
          priority={currentImageIndex === 0}
          fetchPriority={currentImageIndex === 0 ? "high" : "auto"}
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover transition-all duration-500"
        />

        {/* Tombol Navigasi Kiri & Kanan (Muncul otomatis jika gambar > 1) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-9 h-9 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              &#10094; {/* Panah Kiri */}
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-9 h-9 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              &#10095; {/* Panah Kanan */}
            </button>
          </>
        )}
      </div>

      {/* Indikator Titik (Dots) Minimalis */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mb-4 mt-[-8px]">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentImageIndex === index ? 'w-4 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Keterangan / Sumber Foto */}
      <p className="text-xs text-gray-500 italic mt-2">
        {caption ? `Foto: ${caption}` : "Foto: Dokumentasi Redaksi PojokTV"}
      </p>
    </div>
  );
}
