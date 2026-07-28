import React from 'react';

const instagramImages = [
  { src: '/assets/insta-1.jpg', alt: 'Sela outfit 1' },
  { src: '/assets/insta-2.jpg', alt: 'Sela outfit 2' },
  { src: '/assets/insta-3.jpg', alt: 'Sela outfit 3' },
  { src: '/assets/insta-4.jpg', alt: 'Sela outfit 4' },
  { src: '/assets/insta-5.jpg', alt: 'Sela outfit 5' },
  { src: '/assets/insta-6.jpg', alt: 'Sela outfit 6' },
];

const InstagramFeed: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4 block">
            @SELAATHLEISURE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Follow Along
          </h2>
          <a
            href="https://instagram.com/selaathleisure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-neutral-600 hover:text-black transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Follow us on Instagram
          </a>
        </div>
      </div>

      {/* Horizontal scrolling row - full bleed on mobile */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:px-8 lg:px-16"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {instagramImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[16.666%] snap-start group cursor-pointer relative overflow-hidden"
          >
            <div className="aspect-square relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-white">
                  <span className="text-sm font-semibold tracking-wider uppercase">
                    View Outfit
                  </span>
                  <div className="flex items-center gap-5">
                    {/* Heart icon */}
                    <button className="hover:text-red-400 transition-colors" aria-label="Like">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    {/* Share icon */}
                    <button className="hover:text-amber-400 transition-colors" aria-label="Share">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;
