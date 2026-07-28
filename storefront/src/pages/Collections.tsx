import { Link } from 'react-router-dom';

const collections = [
  {
    title: 'Performance',
    description:
      'Technical pieces designed to move with you through every workout.',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=85',
    link: '/shop',
  },
  {
    title: 'Essentials',
    description:
      'Clean, versatile staples made for training and everyday movement.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
    link: '/shop',
  },
  {
    title: 'Women',
    description:
      'Confident silhouettes built around strength, comfort and style.',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85',
    link: '/shop',
  },
  {
    title: 'Accessories',
    description:
      'The finishing pieces for your training routine.',
    image:
      'https://images.unsplash.com/photo-1517838277536-f5f99be5011d?auto=format&fit=crop&w=1200&q=85',
    link: '/shop',
  },
];

export function Collections() {
  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            SELA
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-rich-black mt-4">
            Collections
          </h1>

          <p className="font-body text-sm sm:text-base text-cool-gray mt-6 max-w-xl leading-7">
            Explore the world of SELA through collections designed for
            movement, performance and everyday confidence.
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.title}
                to={collection.link}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10 text-white">
                    <h2 className="font-display text-4xl sm:text-5xl">
                      {collection.title}
                    </h2>

                    <p className="font-body text-sm leading-6 max-w-md mt-3 text-white/90">
                      {collection.description}
                    </p>

                    <div className="inline-flex items-center mt-6 border-b border-white pb-1 font-body text-xs uppercase tracking-[0.15em]">
                      Shop Collection
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-rich-black text-white px-4 sm:px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">

          <p className="font-body text-xs uppercase tracking-[0.2em] text-white/50">
            Find your fit
          </p>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-4">
            Built for movement.
          </h2>

          <p className="font-body text-sm text-white/60 max-w-xl mx-auto mt-5 leading-7">
            Discover the full SELA range and find pieces designed to move
            with you.
          </p>

          <Link
            to="/shop"
            className="inline-flex mt-8 bg-white text-rich-black px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-white transition-colors"
          >
            Shop All Products
          </Link>

        </div>
      </section>

    </main>
  );
}