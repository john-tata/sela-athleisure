import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { api } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  compare_price?: number;
  created_at?: string;

  category_id?: string;
  category_name?: string;
  category_slug?: string;

  images?: {
    url: string;
    alt_text?: string;
  }[];

  variants?: {
    id: string;
    size: string;
    color: string;
    stock_quantity: number;
  }[];

  is_bestseller?: boolean;
}

const categoryOptions = [
  { name: 'Sports Bras', slug: 'sports-bras' },
  { name: 'Leggings', slug: 'leggings' },
  { name: 'Shorts', slug: 'shorts' },
  { name: 'Sets', slug: 'sets' },
  { name: 'Accessories', slug: 'accessories' },
];

export function Shop() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSort = searchParams.get('sort');
  const sort = urlSort || 'newest';

  const urlCategory = searchParams.get('category');

  // Supports:
  // /shop?category=sets
  // /shop?category=sets,leggings
  const selectedCategories = slug
  ? [slug]
  : urlCategory
    ? urlCategory.split(',').filter(Boolean)
    : [];

  const isNewArrivals = urlSort === 'newest';

  // Purely presentational state — entrance animation + sticky toolbar depth.
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /*
   * LOAD PRODUCTS
   */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await api.getProducts();

        console.log('SHOP PRODUCTS RESPONSE:', res);

        if (res.status === 'success') {
          setProducts(res.data?.products || []);
        } else {
          setError('Unable to load products.');
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
        setError('Unable to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /*
   * FILTER + SORT PRODUCTS
   */
  const sortedProducts = useMemo(() => {
    let result = [...products];

    // Category filtering
    if (selectedCategories.length > 0) {
      result = result.filter(
        (product) =>
          product.category_slug &&
          selectedCategories.includes(product.category_slug)
      );
    }

    // Sorting
    switch (sort) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.created_at
            ? new Date(a.created_at).getTime()
            : 0;

          const dateB = b.created_at
            ? new Date(b.created_at).getTime()
            : 0;

          return dateB - dateA;
        });
        break;

      case 'price-low':
        result.sort(
          (a, b) => Number(a.base_price) - Number(b.base_price)
        );
        break;

      case 'price-high':
        result.sort(
          (a, b) => Number(b.base_price) - Number(a.base_price)
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, sort, urlCategory, slug]);

  /*
   * CATEGORY FILTER TOGGLE
   */
  const toggleCategory = (categorySlug: string) => {
    const currentCategories = [...selectedCategories];

    const exists = currentCategories.includes(categorySlug);

    const nextCategories = exists
      ? currentCategories.filter(
          (category) => category !== categorySlug
        )
      : [...currentCategories, categorySlug];

    const nextParams: Record<string, string> = {};

    if (nextCategories.length > 0) {
      nextParams.category = nextCategories.join(',');
    }

    if (urlSort) {
      nextParams.sort = urlSort;
    }

    setSearchParams(nextParams);
  };

  /*
   * CLEAR CATEGORY FILTER
   */
  const clearCategories = () => {
    const nextParams: Record<string, string> = {};

    if (urlSort) {
      nextParams.sort = urlSort;
    }

    setSearchParams(nextParams);
  };

  /*
   * SORT CHANGE
   */
  const handleSortChange = (value: string) => {
    const nextParams: Record<string, string> = {};

    if (selectedCategories.length > 0) {
      nextParams.category = selectedCategories.join(',');
    }

    if (value !== 'default') {
      nextParams.sort = value;
    }

    setSearchParams(nextParams);
  };

  const collectionNames: Record<string, string> = {
  'sports-bras': 'Sports Bras',
  leggings: 'Leggings',
  shorts: 'Shorts',
  sets: 'Sets',
  accessories: 'Accessories',
};

  return (
    <main className="min-h-screen bg-background pt-[60px] lg:pt-[72px]">
      <style>{`
        @keyframes selaFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sela-reveal {
          animation: selaFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes selaShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .sela-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #ececec 37%, #f3f4f6 63%);
          background-size: 800px 100%;
          animation: selaShimmer 1.6s ease-in-out infinite;
        }
        .sela-scroll-x::-webkit-scrollbar { display: none; }
        .sela-scroll-x { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SHOP HEADER */}

      <section className="px-4 sm:px-6 lg:px-12 py-12 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">

          <div
            className={`transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-gold mb-4">
              {slug ? 'Collection' : 'Shop'}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-rich-black">
              {slug
                ? collectionNames[slug] || 'Collection'
                : isNewArrivals
                  ? 'New Arrivals'
                  : 'Shop'}
            </h1>

            <p className="font-body text-sm text-cool-gray mt-4 max-w-xl">
              {slug
                ? `Explore our ${collectionNames[slug]?.toLowerCase() || 'collection'} collection.`
                : isNewArrivals
                  ? 'Discover the latest pieces from SELA.'
                  : 'Explore the SELA collection.'}
            </p>
          </div>

        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto">

          {/* TOOLBAR */}
          {!loading && !error && products.length > 0 && (
            <div
              className={`sticky top-[60px] lg:top-[72px] z-20 -mx-4 sm:-mx-6 lg:-mx-12 px-4 sm:px-6 lg:px-12 py-4 mb-8 space-y-6 bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
                scrolled ? 'border-b border-gray-200 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08)]' : 'border-b border-transparent'
              }`}
            >

              {/* Product count + sort */}
              <div className="flex items-center justify-between">

                <p className="font-body text-sm text-cool-gray">
                  {sortedProducts.length}{' '}
                  {sortedProducts.length === 1
                    ? 'product'
                    : 'products'}
                </p>

                <div className="flex items-center gap-3">

                  <label
                    htmlFor="sort"
                    className="hidden sm:block font-body text-sm text-cool-gray"
                  >
                    Sort by
                  </label>

                  <div className="relative">
                    <select
                      id="sort"
                      value={urlSort || 'default'}
                      onChange={(e) =>
                        handleSortChange(e.target.value)
                      }
                      className="appearance-none border border-gray-200 bg-white pl-4 pr-9 py-2.5 font-body text-sm text-rich-black outline-none transition-colors hover:border-gray-400 focus:border-rich-black cursor-pointer"
                    >
                      <option value="default">
                        Featured
                      </option>

                      <option value="newest">
                        Newest
                      </option>

                      <option value="price-low">
                        Price: Low to High
                      </option>

                      <option value="price-high">
                        Price: High to Low
                      </option>
                    </select>

                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cool-gray"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* CATEGORY FILTERS */}
              <div>
                <div className="sela-scroll-x flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible pb-1">

                  {/* All */}
                  <button
                    type="button"
                    onClick={clearCategories}
                    className={`shrink-0 px-4 py-2 border font-body text-xs uppercase tracking-[0.08em] transition-colors duration-200 ${
                      selectedCategories.length === 0
                        ? 'bg-rich-black text-white border-rich-black'
                        : 'bg-white text-rich-black border-gray-200 hover:border-rich-black'
                    }`}
                  >
                    All
                  </button>

                  {/* Categories */}
                  {categoryOptions.map((category) => {
                    const selected = selectedCategories.includes(
                      category.slug
                    );

                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() =>
                          toggleCategory(category.slug)
                        }
                        className={`shrink-0 px-4 py-2 border font-body text-xs uppercase tracking-[0.08em] transition-colors duration-200 ${
                          selected
                            ? 'bg-rich-black text-white border-rich-black'
                            : 'bg-white text-rich-black border-gray-200 hover:border-rich-black'
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}

                </div>
              </div>

            </div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">

              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <div className="sela-shimmer aspect-[3/4]" />

                  <div className="sela-shimmer h-4 mt-4 w-3/4" />

                  <div className="sela-shimmer h-4 mt-2 w-1/3" />
                </div>
              ))}

            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="py-20 text-center">

              <p className="font-body text-sm text-red-500">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 inline-block border border-rich-black px-6 py-3 font-body text-xs uppercase tracking-wider text-rich-black hover:bg-rich-black hover:text-white transition-colors"
              >
                Try Again
              </button>

            </div>
          )}

          {/* EMPTY STATE */}
          {!loading &&
            !error &&
            sortedProducts.length === 0 && (
              <div className="py-24 text-center">

                <svg
                  className="mx-auto mb-6 h-10 w-10 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                >
                  <path d="M12 3l4 4h-8l4-4Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7h12l1.5 13.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5L6 7Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <p className="font-display text-xl text-rich-black mb-2">
                  No products found
                </p>

                <p className="font-body text-sm text-cool-gray mb-6">
                  Nothing matches this category right now.
                </p>

                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearCategories}
                    className="inline-block bg-rich-black text-white px-6 py-3 font-body text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            )}

          {/* PRODUCT GRID */}
          {!loading &&
            !error &&
            sortedProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">

                {sortedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="sela-reveal"
                    style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}

              </div>
            )}

        </div>
      </section>

    </main>
  );
}
