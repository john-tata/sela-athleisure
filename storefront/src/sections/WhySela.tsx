import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: 'Sweat Wicking',
    description: 'Advanced moisture-management technology keeps you dry during the most intense workouts.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13C6.477 8 2 12.477 2 18" />
      </svg>
    ),
  },
  {
    title: '4 Way Stretch',
    description: 'Move freely in every direction with our four-way stretch fabric that never loses shape.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    title: 'Soft Fabric',
    description: 'Luxuriously soft hand-feel that you\'ll want to live in, from studio to street.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Breathable',
    description: 'Strategically designed ventilation zones allow airflow exactly where you need it most.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

const WhySela: React.FC = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image Left */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
            <img
              src="/assets/why-sela-lifestyle.jpg"
              alt="Sela Athleisure lifestyle"
              className="w-full h-full object-cover"
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Text Right */}
          <div className="py-4 lg:py-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4 block">
  WHY SELA
</span>

<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
  Activewear Designed<br />for Your Best Move
</h2>

<p className="text-neutral-600 text-base md:text-lg mb-10 max-w-md leading-relaxed">
  Sela Athleisure is a Nigerian activewear brand creating stylish,
  comfortable gym wear and athleisure clothing for training, movement,
  and everyday life. Every piece is designed to help you move freely,
  feel confident, and look your best from the gym to the streets.
</p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-black text-white flex-shrink-0 group-hover:bg-amber-500 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySela;
