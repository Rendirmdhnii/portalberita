import React from 'react';

export default function NewsGallery({ images }) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  // Pisahkan Gambar Utama dan Sisanya
  const mainImage = images[0];
  const extraImages = images.slice(1);

  return (
    <div className="w-full mb-6">
      {/* Gambar Utama */}
      <img
        src={mainImage}
        alt="Foto Utama Berita"
        className="w-full h-auto aspect-video object-cover rounded-xl shadow-sm"
      />

      {/* Galeri Tambahan (Grid Rapi) */}
      {extraImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {extraImages.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Foto tambahan ${index + 1}`}
              className="w-full h-full aspect-video object-cover rounded-lg shadow-sm border border-gray-100"
            />
          ))}
        </div>
      )}

      {/* Keterangan / Sumber Foto */}
      <p className="text-xs text-gray-500 italic mt-2">
        Foto: Dokumentasi Redaksi PojokTV
      </p>
    </div>
  );
}
