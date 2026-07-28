import React from 'react';

const VideoSection: React.FC = () => {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/assets/brand-video-poster.jpg"
      >
        <source src="/assets/brand-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
          Built To Move
        </h2>
        <p className="text-lg md:text-2xl text-white/80 mb-10 font-light tracking-wide">
          Made To Inspire
        </p>
        <a
          href="/shop"
          className="px-10 py-4 bg-white text-black font-semibold text-sm tracking-widest uppercase hover:bg-neutral-200 transition-colors duration-300"
        >
          Explore the Collection
        </a>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
};

export default VideoSection;
