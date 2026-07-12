import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function NewsGallery({ images }) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8 overflow-hidden rounded-xl bg-slate-900 shadow-md border border-gray-100">
      <Carousel
        showArrows={true}
        showThumbs={images.length > 1}
        showStatus={true}
        showIndicators={false}
        infiniteLoop={true}
        useKeyboardArrows={true}
        autoPlay={false}
        dynamicHeight={false}
        statusFormatter={(current, total) => `${current} / ${total}`}
        className="news-carousel"
      >
        {images.map((url, idx) => (
          <div key={idx} className="relative w-full h-[280px] sm:h-[400px] md:h-[500px] bg-black flex items-center justify-center">
            <img
              src={url}
              alt={`Foto berita ${idx + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </Carousel>

      <style jsx global>{`
        .news-carousel .thumbs-wrapper {
          margin: 10px 0 !important;
          padding: 0 !important;
        }
        .news-carousel .thumb {
          border: 2px solid #e2e8f0 !important;
          border-radius: 6px !important;
          overflow: hidden !important;
          height: 56px !important;
          width: 80px !important;
          cursor: pointer !important;
          margin-right: 8px !important;
          padding: 0 !important;
          transition: all 0.2s ease-in-out !important;
        }
        .news-carousel .thumb:hover,
        .news-carousel .thumb.selected {
          border-color: #d32f2f !important; /* crimson */
          transform: scale(1.05) !important;
        }
        .news-carousel .thumb img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        .news-carousel .control-arrow {
          background: rgba(0, 0, 0, 0.4) !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          opacity: 0.8 !important;
          transition: all 0.2s !important;
          margin: 0 10px !important;
        }
        .news-carousel .control-arrow:hover {
          background: #d32f2f !important; /* crimson */
          opacity: 1 !important;
        }
        .news-carousel .control-next.control-arrow {
          right: 10px !important;
        }
        .news-carousel .control-prev.control-arrow {
          left: 10px !important;
        }
        .news-carousel .control-next.control-arrow::before {
          border-left: 8px solid #fff !important;
          margin-left: 4px !important;
        }
        .news-carousel .control-prev.control-arrow::before {
          border-right: 8px solid #fff !important;
          margin-right: 4px !important;
        }
        .news-carousel .carousel-status {
          top: auto !important;
          bottom: 15px !important;
          right: 15px !important;
          background: rgba(0, 0, 0, 0.6) !important;
          padding: 4px 10px !important;
          border-radius: 20px !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
        }
      `}</style>
    </div>
  );
}
