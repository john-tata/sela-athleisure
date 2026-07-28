import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { SectionHeader } from '@/components/SectionHeader';
import { ProductCard } from '@/components/ProductCard';

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

export default function NewCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts('')
      .then((res: any) => {
  setProducts(res.data?.products ?? []);
})
.catch((err) => {
  console.error('Failed to load products:', err);
  setProducts([]);
})
.finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeader label="NEW COLLECTION" heading="The Spring Edit" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`animate-pulse bg-neutral-200 rounded-sm ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} style={{ aspectRatio: i === 0 ? '1/1' : '3/4' }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredProduct = products[0];
  const remainingProducts = products.slice(1, 4);

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader label="NEW COLLECTION" heading="The Spring Edit" />

        {products.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            New arrivals coming soon.
          </div>
        ) : (
          <div className="mt-12 space-y-4 md:space-y-6">
            {/* Top Row: Featured (large) + 2 stacked products */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
              {/* Featured Product - takes 60% on desktop */}
              {featuredProduct && (
                <div className="md:col-span-3">
                  <ProductCard product={featuredProduct} />
                </div>
              )}
              {/* 2 products stacked - takes 40% on desktop */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
                {remainingProducts.slice(0, 2).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Bottom Row: 3 products */}
            {remainingProducts.length > 2 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {remainingProducts.slice(2).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
