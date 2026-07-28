import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { api } from '@/lib/api';
import { SectionHeader } from '@/components/SectionHeader';
import { ProductCard } from '@/components/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  compare_price?: number;
  images?: { url: string; alt_text?: string }[];
  category?: string;
  badge?: string;
  is_bestseller?: boolean;
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    api.getProducts('sort=bestseller')
      .then((res: any) => {
  setProducts(res.data?.products ?? []);
})
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeader label="BEST SELLERS" heading="Fan Favourites" />
          <div className="flex gap-4 mt-12 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-sm aspect-[3/4] flex-shrink-0 w-1/4" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header with nav arrows */}
        <div className="flex items-end justify-between">
          <SectionHeader label="BEST SELLERS" heading="Fan Favourites" />
          {products.length > 0 && (
            <div className="hidden md:flex items-center gap-2 mb-2">
              <button
                onClick={() => swiperInstance?.slidePrev()}
                className="w-10 h-10 flex items-center justify-center border border-neutral-300 text-neutral-600 hover:border-black hover:text-black transition-colors duration-300"
                aria-label="Previous"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => swiperInstance?.slideNext()}
                className="w-10 h-10 flex items-center justify-center border border-neutral-300 text-neutral-600 hover:border-black hover:text-black transition-colors duration-300"
                aria-label="Next"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            Best sellers coming soon.
          </div>
        ) : (
          <div className="mt-12">
            <Swiper
              modules={[Navigation, Pagination]}
              onSwiper={setSwiperInstance}
              spaceBetween={16}
              slidesPerView={1.5}
              breakpoints={{
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              pagination={{
                clickable: true,
                el: '.best-sellers-pagination',
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom pagination container */}
            <div className="best-sellers-pagination flex justify-center gap-2 mt-6" />
          </div>
        )}
      </div>
    </section>
  );
}
