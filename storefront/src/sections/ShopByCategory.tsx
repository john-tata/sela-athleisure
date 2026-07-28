import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryCard } from '@/components/CategoryCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description?: string;
  product_count?: number;
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  api.getCategories()
    .then((res: any) => {
      setCategories(res.data?.categories ?? []);
    })
    .catch((err) => {
      console.error(err);
      setCategories([]);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return (
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeader label="SHOP" heading="Shop by Category" centered />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-200 rounded-sm aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader label="SHOP" heading="Shop by Category" centered />

        {categories.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            Categories coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
