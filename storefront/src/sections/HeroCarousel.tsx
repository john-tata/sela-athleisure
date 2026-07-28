import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';

interface HeroSlide {
  image_url: string;
  heading: string;
  subtext: string;
  cta_primary: string;
  cta_primary_link: string;
  cta_secondary: string;
  cta_secondary_link: string;
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  // Fetch slides on mount
  useEffect(() => {
    api.getContent('hero-slides')
      .then((res: any) => {
        if (res.success) {
          setSlides(res.data || []);
        } else {
          setSlides([]);
        }
      })
      .catch(() => setSlides([]));
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, slides.length]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Autoplay every 5s
  useEffect(() => {
    if (slides.length <= 1) return;
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides.length, next]);

  // Reset interval on manual navigation
  const handleDotClick = (index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(index);
    intervalRef.current = setInterval(next, 5000);
  };

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (diff > 0) next();
      else prev();
      intervalRef.current = setInterval(next, 5000);
    }
  };

  // Fallback placeholder slides if none fetched
  const displaySlides = slides.length > 0 ? slides : [];

  if (displaySlides.length === 0) {
    return (
      <section className="relative w-full h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">SELA ATHLEISURE</h1>
          <p className="text-lg text-neutral-400">Premium Activewear for Every Movement</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {displaySlides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === current ? 1 : 0,
          }}
        >
          {/* Background Image */}
          <img
            src={slide.image_url}
            alt={slide.heading}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </div>
      ))}

      {/* Text Content - Lower Third */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-32 md:pb-40 px-6">
        {displaySlides.map((slide, index) => (
          <div
            key={index}
            className="absolute text-center max-w-3xl"
            style={{
              opacity: index === current ? 1 : 0,
              transform: index === current ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              pointerEvents: index === current ? 'auto' : 'none',
            }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              {slide.heading}
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-xl mx-auto">
              {slide.subtext}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {slide.cta_primary && (
                <a
                  href={slide.cta_primary_link || '#'}
                  className="px-8 py-3.5 bg-white text-black font-semibold text-sm tracking-wider uppercase hover:bg-neutral-200 transition-colors duration-300"
                >
                  {slide.cta_primary}
                </a>
              )}
              {slide.cta_secondary && (
                <a
                  href={slide.cta_secondary_link || '#'}
                  className="px-8 py-3.5 border border-white/60 text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/10 transition-colors duration-300"
                >
                  {slide.cta_secondary}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Indicators (Dots) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="group relative p-1"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                index === current
                  ? 'bg-white scale-110'
                  : 'bg-white/40 group-hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>

      {/* Side Navigation Arrows (desktop only) */}
      <button
        onClick={() => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          prev();
          intervalRef.current = setInterval(next, 5000);
        }}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          next();
          intervalRef.current = setInterval(next, 5000);
        }}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center border border-white/30 text-white/70 hover:text-white hover:border-white/60 transition-all duration-300"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
