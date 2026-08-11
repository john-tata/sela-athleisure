import React from 'react';
import { Instagram } from 'lucide-react';

const instagramImages = [
  { src: '/assets/insta-1.jpg', alt: 'SELA look 1' },
  { src: '/assets/insta-2.jpg', alt: 'SELA look 2' },
  { src: '/assets/insta-3.jpg', alt: 'SELA look 3' },
  { src: '/assets/insta-4.jpg', alt: 'SELA look 4' },
  { src: '/assets/insta-5.jpg', alt: 'SELA look 5' },
  { src: '/assets/insta-6.jpg', alt: 'SELA look 6' },
];

const INSTAGRAM_URL = 'https://instagram.com/selaathleisure';

const InstagramFeed: React.FC = () => {
  return (
    <section className="bg-white py-16 lg:py-24">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-12 mb-10 lg:mb-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
              @SELAATHLEISURE
            </p>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-rich-black mt-3">
              Follow Along
            </h2>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start sm:self-auto border-b border-rich-black pb-1 font-body text-xs uppercase tracking-[0.15em] text-rich-black hover:text-gold hover:border-gold transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Follow us on Instagram
          </a>
        </div>
      </div>

      {/* Instagram Gallery */}
      <div
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:px-8 lg:px-16"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {instagramImages.map((image, index) => (
          <a
            key={index}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex-shrink-0 w-[72vw] sm:w-[45vw] md:w-[30vw] lg:w-[16.666%] snap-start group overflow-hidden"
            aria-label={`View ${image.alt} on Instagram`}
          >
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-rich-black/0 group-hover:bg-rich-black/45 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-3 text-white">
                  <Instagram className="w-6 h-6" />

                  <span className="font-body text-xs uppercase tracking-[0.15em]">
                    View on Instagram
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Mobile hint */}
      <div className="md:hidden flex justify-center mt-5">
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-cool-gray">
          Swipe to explore
        </p>
      </div>
    </section>
  );
};

export default InstagramFeed;