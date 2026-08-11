import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useCartStore } from "@/stores/cartStore";
import ProductGallery from "@/components/Product/ProductGallery";
import RelatedProducts from "@/components/Product/RelatedProducts";

interface ProductImage {
  id?: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  compare_price: number | null;
  category_name?: string;
  category_slug?: string;
  images: ProductImage[];
  variants: any[];
}

export default function ProductDetails() {
  const { slug = "" } = useParams();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res: any = await api.getProduct(slug);

        setProduct(res.data);
        if (res.data.variants?.length) {
    setSelectedVariant(res.data.variants[0]);
}
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);


  if (loading) return <main className="max-w-7xl mx-auto p-10">Loading...</main>;
  if (!product) return <main className="max-w-7xl mx-auto p-10">Product not found.</main>;


  return (
    <main className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      <div className="mb-8 flex items-center gap-2 text-sm text-neutral-500">

  <Link
    to="/"
    className="hover:text-black transition-colors"
  >
    Home
  </Link>

  <span>/</span>

  <Link
    to={`/category/${product.category_slug}`}
    className="hover:text-black transition-colors"
  >
    {product.category_name}
  </Link>

  <span>/</span>

  <span className="text-black font-medium">
    {product.name}
  </span>

</div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-5">

  <ProductGallery
    images={
        selectedVariant?.image_url
            ? [
                  {
                      url: selectedVariant.image_url,
                      is_primary: true,
                  } as ProductImage,
                  ...product.images,
              ]
            : product.images
    }
    productName={product.name}
/>
  
</div>

        <div>
          <p className="uppercase text-xs tracking-widest text-neutral-500">{product.category_name}</p>
          <h1 className="text-4xl font-bold mt-2">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-semibold">₦{Number(product.base_price).toLocaleString()}</span>
            {product.compare_price && (
              <span className="line-through text-neutral-400">
                ₦{Number(product.compare_price).toLocaleString()}
              </span>
            )}
          </div>

          <p className="mt-8 leading-7 text-neutral-600">{product.description}</p>

{product.variants && product.variants.length > 0 && (
  <>
    {/* Size */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Size</span>

        <button className="text-sm underline text-neutral-500 hover:text-black">
          Size Guide
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {[...new Set(product.variants.map((variant) => variant.size))]
          .filter(Boolean)
          .map((size) => {
            const isSelected = selectedVariant?.size === size;

            return (
              <button
                key={size}
                onClick={() => {
                  const matchingVariant = product.variants?.find(
                    (variant) =>
                      variant.size === size &&
                      (!selectedVariant?.color ||
                        variant.color === selectedVariant.color)
                  );

                  if (matchingVariant) {
                    setSelectedVariant(matchingVariant);
                  }
                }}
                className={`w-14 h-10 rounded-xl border transition ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                {size}
              </button>
            );
          })}
      </div>
    </div>

    {/* Color */}
    {[
      ...new Map(
        product.variants
          .filter((variant) => variant.color)
          .map((variant) => [variant.color, variant])
      ).values(),
    ].length > 0 && (
      <div className="mb-6">
        <span className="block text-sm font-medium mb-3">
          Color
        </span>

        <div className="flex flex-wrap gap-3">
          {[
            ...new Map(
              product.variants
                .filter((variant) => variant.color)
                .map((variant) => [variant.color, variant])
            ).values(),
          ].map((colorVariant) => {
            const isSelected =
              selectedVariant?.color === colorVariant.color;

            return (
              <button
                key={colorVariant.color}
                onClick={() => {
                  const matchingVariant = product.variants?.find(
                    (variant) =>
                      variant.color === colorVariant.color &&
                      (!selectedVariant?.size ||
                        variant.size === selectedVariant.size)
                  );

                  if (matchingVariant) {
                    setSelectedVariant(matchingVariant);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                  isSelected
                    ? "border-black ring-1 ring-black"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-neutral-300"
                  style={{
                    backgroundColor:
                      colorVariant.color_hex || "#000000",
                  }}
                />

                {colorVariant.color}
              </button>
            );
          })}
        </div>
      </div>
    )}
  </>
)}
         <div className="mt-10 flex items-center gap-4">

  <div className="flex items-center overflow-hidden rounded-xl border">

    <button
      onClick={() => setQty(Math.max(1, qty - 1))}
      className="w-10 h-10 text-xl hover:bg-neutral-100 transition"
    >
      −
    </button>

    <div className="w-8 text-center font-semibold">
      {qty}
    </div>

    <button
      onClick={() => setQty(qty + 1)}
      className="w-10 h-10 text-xl hover:bg-neutral-100 transition"
    >
      +
    </button>

  </div>

</div>

          <button
onClick={async () => {
  console.log("Add to Cart clicked");

  console.log({
    productId: product.id,
    variantId: selectedVariant?.id,
    quantity: qty,
  });

  await addItem({
    productId: product.id,
    variantId: product.variants?.length > 0 ? selectedVariant?.id : undefined,
    quantity: qty,
  });
}}
            className="
mt-8
w-full
rounded-xl
bg-black
py-4
text-white
font-semibold
tracking-wide
transition
duration-300
hover:scale-[1.02]
hover:bg-neutral-900
active:scale-100
"
          >
            Add to Cart
          </button>
          <div className="mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 bg-neutral-50">

  <div className="flex items-center gap-3">
    <span className="text-green-600 text-lg">✓</span>
    <div>
      <p className="font-medium">In Stock</p>
      <p className="text-sm text-neutral-500">
        Ready to ship within 24 hours.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-lg">🚚</span>
    <div>
      <p className="font-medium">Fast Delivery</p>
      <p className="text-sm text-neutral-500">
        Free delivery on orders over ₦100,000.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-lg">🔒</span>
    <div>
      <p className="font-medium">Secure Checkout</p>
      <p className="text-sm text-neutral-500">
        Protected payments powered by Paystack.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3">
    <span className="text-lg">↩️</span>
    <div>
      <p className="font-medium">Easy Returns</p>
      <p className="text-sm text-neutral-500">
        Return eligible items within 7 days.
      </p>
    </div>
    
  </div>
console.log(res.data.variants);
</div>

        </div>
      </div>
      <details className="border-b py-5">
  <summary className="cursor-pointer font-semibold">
    Product Details
  </summary>

  <div className="mt-4 text-neutral-600 leading-7">
    {product.description}
  </div>
</details>

<details className="border-b py-5">
  <summary className="cursor-pointer font-semibold">
    Shipping & Returns
  </summary>

  <div className="mt-4 text-neutral-600 leading-7">
    Orders are processed within 24 hours.
    Delivery takes 2–5 business days depending on your location.
  </div>
</details>
          <section className="mt-24">
        <RelatedProducts
          currentSlug={product.slug}
          categorySlug={product.category_slug}
        />
      </section>
    </main>
  );
}