import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  compare_price?: number;
  images?: {
    url: string;
    alt_text?: string;
  }[];
  variants?: any[];
  category_slug?: string;
}

interface Props {
  currentSlug: string;
  categorySlug?: string;
}

export default function RelatedProducts({
  currentSlug,
  categorySlug,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res: any = await api.getProducts();

        let items: Product[] = res.data.products ?? [];

        // remove current product
        items = items.filter(
          (p) => p.slug !== currentSlug
        );

        // prefer same category
        if (categorySlug) {
          const sameCategory = items.filter(
            (p) => p.category_slug === categorySlug
          );

          if (sameCategory.length >= 4) {
            items = sameCategory;
          }
        }

        setProducts(items.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [currentSlug, categorySlug]);

  if (!products.length) return null;

  return (
    <section className="mt-24">
      <h2 className="text-3xl font-semibold mb-8">
        You May Also Like
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}