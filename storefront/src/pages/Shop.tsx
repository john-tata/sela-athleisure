import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import SEO from '@/components/SEO';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order: number;
  product_count?: number;
}

const PRODUCTS_PER_PAGE = 12;

export function Shop() {
  const { slug } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  const urlSort = searchParams.get('sort');
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category');

  const sort = urlSort || 'newest';

  const currentPage = Math.max(
    1,
    Number(searchParams.get('page')) || 1
  );

  /*
   * Supports:
   * /shop?category=sets
   * /shop?category=sets,leggings
   * /collections/sets
   */
  const selectedCategories = slug
    ? [slug]
    : urlCategory
      ? urlCategory.split(',').filter(Boolean)
      : [];

  const isNewArrivals = urlSort === 'newest';

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /*
   * PAGE MOUNT ANIMATION
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * SCROLL DETECTION
   */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /*
   * LOAD CATEGORIES
   */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.getCategories();

        if (res.status === 'success') {
          setCategories(res.data?.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    loadCategories();
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

    /*
     * SEARCH FILTER
     */
    if (urlSearch.trim()) {
      const q = urlSearch.trim().toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(q)
      );
    }

    /*
     * CATEGORY FILTER
     */
    if (selectedCategories.length > 0) {
      result = result.filter(
        (product) =>
          product.category_slug &&
          selectedCategories.includes(product.category_slug)
      );
    }

    /*
     * SORTING
     */
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
          (a, b) =>
            Number(a.base_price) - Number(b.base_price)
        );
        break;

      case 'price-high':
        result.sort(
          (a, b) =>
            Number(b.base_price) - Number(a.base_price)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    sort,
    selectedCategories,
    urlSearch,
  ]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedProducts.length / PRODUCTS_PER_PAGE
    )
  );

  /*
   * Make sure the current page can never exceed
   * the available number of pages.
   */
  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedProducts = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

    const endIndex =
      startIndex + PRODUCTS_PER_PAGE;

    return sortedProducts.slice(
      startIndex,
      endIndex
    );
  }, [sortedProducts, safeCurrentPage]);

  /*
   * UPDATE URL PAGE
   */
  const goToPage = (page: number) => {
    const nextPage = Math.max(
      1,
      Math.min(page, totalPages)
    );

    const nextParams: Record<string, string> = {};

    if (selectedCategories.length > 0) {
      nextParams.category =
        selectedCategories.join(',');
    }

    if (urlSort) {
      nextParams.sort = urlSort;
    }

    if (urlSearch) {
      nextParams.search = urlSearch;
    }

    if (nextPage > 1) {
      nextParams.page = String(nextPage);
    }

    setSearchParams(nextParams);

    /*
     * Scroll back to the top of the product section
     * rather than leaving the user at the bottom.
     */
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /*
   * CATEGORY FILTER TOGGLE
   */
  const toggleCategory = (categorySlug: string) => {
    const currentCategories = [
      ...selectedCategories,
    ];

    const exists =
      currentCategories.includes(categorySlug);

    const nextCategories = exists
      ? currentCategories.filter(
          (category) => category !== categorySlug
        )
      : [
          ...currentCategories,
          categorySlug,
        ];

    const nextParams: Record<string, string> = {};

    if (nextCategories.length > 0) {
      nextParams.category =
        nextCategories.join(',');
    }

    if (urlSort) {
      nextParams.sort = urlSort;
    }

    if (urlSearch) {
      nextParams.search = urlSearch;
    }

    /*
     * Reset pagination whenever filters change.
     */
    setSearchParams(nextParams);
  };

  /*
   * CLEAR CATEGORY FILTERS
   */
  const clearCategories = () => {
    const nextParams: Record<string, string> = {};

    if (urlSort) {
      nextParams.sort = urlSort;
    }

    if (urlSearch) {
      nextParams.search = urlSearch;
    }

    setSearchParams(nextParams);
  };

  /*
   * SORT CHANGE
   */
  const handleSortChange = (value: string) => {
    const nextParams: Record<string, string> = {};

    if (selectedCategories.length > 0) {
      nextParams.category =
        selectedCategories.join(',');
    }

    if (value !== 'default') {
      nextParams.sort = value;
    }

    if (urlSearch) {
      nextParams.search = urlSearch;
    }

    /*
     * Reset to page 1 when sorting changes.
     */
    setSearchParams(nextParams);
  };

  /*
   * CURRENT CATEGORY
   */
  const currentCategory = categories.find(
    (category) => category.slug === slug
  );

  /*
   * SEO
   */
  const siteUrl =
    'https://www.selaathleisure.com';

  const collectionName =
    currentCategory?.name || 'Shop';

  const collectionTitle = slug
    ? `${collectionName} | SELA Athleisure`
    : isNewArrivals
      ? 'New Arrivals | SELA Athleisure'
      : 'Shop Gym Wear & Activewear | SELA Athleisure';

  const collectionDescription = slug
    ? `Shop ${collectionName.toLowerCase()} from SELA Athleisure. Discover premium fitness and athleisure pieces designed for movement and everyday style.`
    : isNewArrivals
      ? 'Discover the latest arrivals from SELA Athleisure, with premium gym wear, activewear and fitness essentials designed for movement.'
      : 'Shop SELA Athleisure for premium gym wear, activewear and fitness essentials designed for workouts and everyday style.';

  const collectionCanonical = slug
    ? `${siteUrl}/collections/${slug}`
    : `${siteUrl}/collections`;

  /*
   * PAGINATION BUTTONS
   *
   * Shows a maximum of 5 page numbers at a time.
   */
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    let startPage = Math.max(
      1,
      safeCurrentPage - 2
    );

    let endPage = Math.min(
      totalPages,
      startPage + 4
    );

    if (endPage - startPage < 4) {
      startPage = Math.max(
        1,
        endPage - 4
      );
    }

    for (
      let i = startPage;
      i <= endPage;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  }, [totalPages, safeCurrentPage]);

  /*
   * PRODUCT RANGE TEXT
   */
  const firstProduct =
    sortedProducts.length === 0
      ? 0
      : (safeCurrentPage - 1) *
          PRODUCTS_PER_PAGE +
        1;

  const lastProduct = Math.min(
    safeCurrentPage * PRODUCTS_PER_PAGE,
    sortedProducts.length
  );

  return (
    <main className="min-h-screen bg-background pt-[60px] lg:pt-[72px]">
      <SEO
        title={collectionTitle}
        description={collectionDescription}
        canonical={collectionCanonical}
      />

      <style>{`
        @keyframes selaFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sela-reveal {
          animation: selaFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes selaShimmer {
          0% {
            background-position: -400px 0;
          }

          100% {
            background-position: 400px 0;
          }
        }

        .sela-shimmer {
          background: linear-gradient(
            90deg,
            #f3f4f6 25%,
            #ececec 37%,
            #f3f4f6 63%
          );

          background-size: 800px 100%;
          animation: selaShimmer 1.6s ease-in-out infinite;
        }

        .sela-scroll-x::-webkit-scrollbar {
          display: none;
        }

        .sela-scroll-x {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .sela-pill {
          position: relative;
          transition:
            color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background-color 0.25s ease;
        }

        .sela-pill:not(.sela-pill-active):hover {
          border-color: transparent;
          box-shadow:
            0 0 0 1px rgba(197, 165, 114, 0.4),
            0 0 16px 2px rgba(197, 165, 114, 0.35);

          color: #1a1a1a;
        }

        .sela-pill-active {
          box-shadow:
            0 0 14px 1px rgba(0, 0, 0, 0.25);
        }

        .sela-page-button {
          transition:
            background-color 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .sela-page-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .sela-page-button:disabled {
          cursor: not-allowed;
          opacity: 0.35;
        }
      `}</style>

      {/* SHOP HEADER */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 lg:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-700 ease-out ${
              mounted
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
          >
            <p className="font-body text-xs uppercase tracking-[0.2em] text-gold mb-4">
              {slug ? 'Collection' : 'Shop'}
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-rich-black">
              {slug
                ? currentCategory?.name || 'Collection'
                : isNewArrivals
                  ? 'New Arrivals'
                  : 'Shop'}
            </h1>

            <p className="font-body text-sm text-cool-gray mt-4 max-w-xl">
              {slug
                ? `Explore our ${
                    currentCategory?.name?.toLowerCase() ||
                    'collection'
                  } collection.`
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
          {!loading &&
            !error &&
            products.length > 0 && (
              <div
                className={`sticky top-[60px] lg:top-[72px] z-20 -mx-4 sm:-mx-6 lg:-mx-12 px-4 sm:px-6 lg:px-12 py-4 mb-8 space-y-6 bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
                  scrolled
                    ? 'border-b border-gray-200 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08)]'
                    : 'border-b border-transparent'
                }`}
              >

                {/* PRODUCT COUNT + SORT */}
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
                          handleSortChange(
                            e.target.value
                          )
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
                        <path
                          d="M4 6l4 4 4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* CATEGORY FILTERS */}
                <div>
                  <div className="sela-scroll-x flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible pb-1">

                    {/* ALL */}
                    <button
                      type="button"
                      onClick={clearCategories}
                      style={
                        selectedCategories.length === 0
                          ? {
                              backgroundColor:
                                '#0A0A0A',
                              color: '#ffffff',
                              borderColor:
                                '#0A0A0A',
                            }
                          : {
                              backgroundColor:
                                '#ffffff',
                              color: '#0A0A0A',
                              borderColor:
                                '#e5e7eb',
                            }
                      }
                      className="sela-pill shrink-0 px-4 py-2 border font-body text-xs uppercase tracking-[0.08em]"
                    >
                      All
                    </button>

                    {/* CATEGORIES */}
                    {categories.map((category) => {
                      const selected =
                        selectedCategories.includes(
                          category.slug
                        );

                      return (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() =>
                            toggleCategory(
                              category.slug
                            )
                          }
                          style={
                            selected
                              ? {
                                  backgroundColor:
                                    '#0A0A0A',
                                  color:
                                    '#ffffff',
                                  borderColor:
                                    '#0A0A0A',
                                }
                              : {
                                  backgroundColor:
                                    '#ffffff',
                                  color:
                                    '#0A0A0A',
                                  borderColor:
                                    '#e5e7eb',
                                }
                          }
                          className="sela-pill shrink-0 px-4 py-2 border font-body text-xs uppercase tracking-[0.08em]"
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
              {Array.from({ length: 12 }).map(
                (_, index) => (
                  <div key={index}>
                    <div className="sela-shimmer aspect-[3/4]" />

                    <div className="sela-shimmer h-4 mt-4 w-3/4" />

                    <div className="sela-shimmer h-4 mt-2 w-1/3" />
                  </div>
                )
              )}
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="py-20 text-center">
              <p className="font-body text-sm text-red-500">
                {error}
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
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
                  <path
                    d="M12 3l4 4h-8l4-4Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M6 7h12l1.5 13.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5L6 7Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
            paginatedProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
                {paginatedProducts.map(
                  (product, index) => (
                    <div
                      key={product.id}
                      className="sela-reveal"
                      style={{
                        animationDelay: `${Math.min(
                          index,
                          8
                        ) * 60}ms`,
                      }}
                    >
                      <ProductCard
                        product={product}
                      />
                    </div>
                  )
                )}
              </div>
            )}

          {/* PAGINATION */}
          {!loading &&
            !error &&
            sortedProducts.length > 0 &&
            totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-gray-100">

                {/* RESULT RANGE */}
                <div className="text-center mb-6">
                  <p className="font-body text-xs text-cool-gray tracking-wide">
                    Showing{' '}
                    <span className="text-rich-black font-medium">
                      {firstProduct}
                    </span>{' '}
                    –{' '}
                    <span className="text-rich-black font-medium">
                      {lastProduct}
                    </span>{' '}
                    of{' '}
                    <span className="text-rich-black font-medium">
                      {sortedProducts.length}
                    </span>{' '}
                    products
                  </p>
                </div>

                {/* PAGINATION CONTROLS */}
                <nav
                  className="flex items-center justify-center gap-2"
                  aria-label="Product pagination"
                >

                  {/* PREVIOUS */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        safeCurrentPage - 1
                      )
                    }
                    disabled={
                      safeCurrentPage === 1
                    }
                    aria-label="Previous page"
                    className="sela-page-button flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-gray-200 bg-white text-rich-black font-body text-xs uppercase tracking-[0.08em] hover:border-rich-black disabled:hover:border-gray-200"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M10 3L5 8l5 5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="hidden sm:inline">
                      Previous
                    </span>
                  </button>

                  {/* FIRST PAGE + ELLIPSIS */}
                  {pageNumbers[0] > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => goToPage(1)}
                        className="sela-page-button min-w-[40px] h-[40px] px-3 border border-gray-200 bg-white text-rich-black font-body text-sm hover:border-rich-black"
                      >
                        1
                      </button>

                      {pageNumbers[0] > 2 && (
                        <span className="px-1 text-gray-400 font-body text-sm">
                          …
                        </span>
                      )}
                    </>
                  )}

                  {/* PAGE NUMBERS */}
                  {pageNumbers.map((page) => {
                    const active =
                      page === safeCurrentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          goToPage(page)
                        }
                        aria-current={
                          active
                            ? 'page'
                            : undefined
                        }
                        className={`sela-page-button min-w-[40px] h-[40px] px-3 border font-body text-sm ${
                          active
                            ? 'bg-rich-black text-white border-rich-black'
                            : 'bg-white text-rich-black border-gray-200 hover:border-rich-black'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* LAST PAGE + ELLIPSIS */}
                  {pageNumbers[
                    pageNumbers.length - 1
                  ] < totalPages && (
                    <>
                      {pageNumbers[
                        pageNumbers.length - 1
                      ] <
                        totalPages - 1 && (
                        <span className="px-1 text-gray-400 font-body text-sm">
                          …
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          goToPage(totalPages)
                        }
                        className="sela-page-button min-w-[40px] h-[40px] px-3 border border-gray-200 bg-white text-rich-black font-body text-sm hover:border-rich-black"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* NEXT */}
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(
                        safeCurrentPage + 1
                      )
                    }
                    disabled={
                      safeCurrentPage ===
                      totalPages
                    }
                    aria-label="Next page"
                    className="sela-page-button flex items-center gap-2 px-3 sm:px-4 py-2.5 border border-gray-200 bg-white text-rich-black font-body text-xs uppercase tracking-[0.08em] hover:border-rich-black disabled:hover:border-gray-200"
                  >
                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M6 3l5 5-5 5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
