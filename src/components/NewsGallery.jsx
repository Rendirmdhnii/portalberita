import React from 'react';

export default function NewsGallery({ images }) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  // Ambil gambar urutan pertama sebagai Foto Utama
  const featuredImage = images[0];

  return (
    <div className="w-full mb-6">
      <img
        src={featuredImage}
        alt="Foto Utama Berita"
        className="w-full h-auto aspect-video object-cover rounded-xl shadow-sm"
      />
      {/* Keterangan / Sumber Foto */}
      <p className="text-xs text-gray-500 italic mt-2">
        Foto: Dokumentasi Redaksi PojokTV
      </p>
    </div>
  );
}
