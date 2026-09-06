import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  product_count?: number;
}

export function Collections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.getCategories();

        const data =
          response.data?.categories ??
          response.categories ??
          response.data ??
          [];

        setCategories(
          [...data].sort(
            (a: Category, b: Category) =>
              (a.sort_order || 0) - (b.sort_order || 0)
          )
        );
      } catch (err) {
        console.error('Failed to load collections:', err);
        setError('Unable to load collections.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="relative aspect-[4/5] overflow-hidden bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="font-body text-sm text-cool-gray">
                {error}
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-sm text-cool-gray">
                No collections available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${encodeURIComponent(category.slug)}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">

                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="font-body text-xs uppercase tracking-[0.15em] text-gray-500">
                          {category.name}
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10 text-white">

                      <h2 className="font-display text-4xl sm:text-5xl">
                        {category.name}
                      </h2>

                      {category.description && (
                        <p className="font-body text-sm leading-6 max-w-md mt-3 text-white/90">
                          {category.description}
                        </p>
                      )}

                      <div className="inline-flex items-center mt-6 border-b border-white pb-1 font-body text-xs uppercase tracking-[0.15em]">
                        Shop Collection
                      </div>

                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

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