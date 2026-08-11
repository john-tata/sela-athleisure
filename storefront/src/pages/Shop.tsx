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
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">

      {/* SHOP HEADER */}
      
      <section className="px-4 sm:px-6 lg:px-12 py-12 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">

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
      </section>

      {/* PRODUCTS SECTION */}
      <section className="px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto">

          {/* TOOLBAR */}
          {!loading && !error && products.length > 0 && (
            <div className="space-y-6 mb-10">

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

                  <select
                    id="sort"
                    value={urlSort || 'default'}
                    onChange={(e) =>
                      handleSortChange(e.target.value)
                    }
                    className="border border-gray-200 bg-white px-4 py-2.5 font-body text-sm text-rich-black outline-none transition-colors hover:border-gray-400 focus:border-rich-black"
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

                </div>
              </div>

              {/* CATEGORY FILTERS */}
              <div>
                <div className="flex flex-wrap gap-2">

                  {/* All */}
                  <button
                    type="button"
                    onClick={clearCategories}
                    className={`px-4 py-2 border font-body text-xs uppercase tracking-[0.08em] transition-colors ${
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
                        className={`px-4 py-2 border font-body text-xs uppercase tracking-[0.08em] transition-colors ${
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
                <div
                  key={index}
                  className="animate-pulse"
                >
                  <div className="aspect-[3/4] bg-gray-100" />

                  <div className="h-4 bg-gray-100 mt-4 w-3/4" />

                  <div className="h-4 bg-gray-100 mt-2 w-1/3" />
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
                className="mt-4 font-body text-sm text-rich-black underline underline-offset-4 hover:text-gold"
              >
                Try again
              </button>

            </div>
          )}

          {/* EMPTY STATE */}
          {!loading &&
            !error &&
            sortedProducts.length === 0 && (
              <div className="py-20 text-center">

                <p className="font-body text-gray-500">
                  No products found in this category.
                </p>

                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearCategories}
                    className="mt-4 font-body text-sm text-rich-black underline underline-offset-4 hover:text-gold"
                  >
                    Clear filters
                  </button>
                )}

              </div>
            )}

          {/* PRODUCT GRID */}
          {!loading &&
            !error &&
            sortedProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">

                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>
            )}

        </div>
      </section>

    </main>
  );
}