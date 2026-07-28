import React from 'react';

const features = [
  { label: 'BREATHABLE FABRIC', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )},
  { label: '4-WAY STRETCH', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  )},
  { label: 'SQUAT PROOF', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )},
  { label: 'PREMIUM QUALITY', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )},
  { label: 'FREE DELIVERY', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )},
];

const FeatureStrip: React.FC = () => {
  // Duplicate for seamless infinite scroll
  const items = [...features, ...features];

  return (
    <section className="w-full bg-black overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-8 md:px-12 text-white flex-shrink-0"
          >
            <span className="text-amber-400 flex-shrink-0">{feature.icon}</span>
            <span className="text-xs md:text-sm font-semibold tracking-widest uppercase">
              {feature.label}
            </span>
            <span className="text-amber-400/50 mx-4">&#9670;</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureStrip;
