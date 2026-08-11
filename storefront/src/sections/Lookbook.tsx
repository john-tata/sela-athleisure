import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface LookbookImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_tall?: boolean;
}

export default function Lookbook() {
  const [images, setImages] = useState<LookbookImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.getContent('lookbook')
      .then((res: any) => {
        if (res.status === "success") {
          setImages(res.data.lookbook || []);
        } else {
          setImages([]);
        }
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4 block">
            LOOKBOOK
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-12">
            Style Inspiration
          </h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-sm mb-4 aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4 block">
          LOOKBOOK
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
          Style Inspiration
        </h2>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 text-neutral-500 max-w-7xl mx-auto px-4">
          Lookbook images coming soon.
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Masonry Grid using CSS Columns */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Lookbook image'}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    image.is_tall ? 'aspect-[3/5]' : 'aspect-[3/4]'
                  }`}
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxOpen && images[currentIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white z-10 p-2"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-3"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={images[currentIndex].image_url}
            alt={images[currentIndex].alt_text || 'Lookbook image'}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 p-3"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
