import { useEffect, useMemo, useState } from "react";
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
  inventory_quantity?: number;
  category_name?: string;
  category_slug?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductVariant {
  id: string;
  sku?: string;
  size?: string;
  color?: string;
  color_hex?: string;
  stock_quantity: number;
  price_adjustment?: number;
  image_url?: string;
}

export default function ProductDetails() {
  const { slug = "" } = useParams();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res: any = await api.getProduct(slug);

        setProduct(res.data);
        const availableVariants = res.data.variants || [];
        setSelectedVariant(
          availableVariants.find(
            (variant: ProductVariant) =>
              Number(variant.stock_quantity) > 0
          ) ||
            availableVariants[0] ||
            null
        );
        setQty(1);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;

  const sizes = useMemo(
    () => [
      ...new Set(
        variants
          .map((variant) => variant.size)
          .filter((size): size is string => Boolean(size))
      ),
    ],
    [variants]
  );

  const colors = useMemo(
    () => [
      ...new Map(
        variants
          .filter(
            (variant): variant is ProductVariant & { color: string } =>
              Boolean(variant.color)
          )
          .map((variant) => [variant.color, variant])
      ).values(),
    ],
    [variants]
  );

  const hasStock = selectedVariant
    ? Number(selectedVariant.stock_quantity) > 0
    : Number(product?.inventory_quantity || 0) > 0;

  const maxQty = selectedVariant
    ? Number(selectedVariant.stock_quantity || 0)
    : Number(product?.inventory_quantity || 10);

  const displayPrice =
    Number(product?.base_price || 0) +
    Number(selectedVariant?.price_adjustment || 0);

  useEffect(() => {
    if (maxQty > 0 && qty > maxQty) {
      setQty(maxQty);
    }
  }, [maxQty, qty]);

  const findVariant = ({
    size,
    color,
  }: {
    size?: string | null;
    color?: string | null;
  }) =>
    variants.find(
      (variant) =>
        (!size || variant.size === size) &&
        (!color || variant.color === color)
    );

  const selectSize = (size: string) => {
    const sameColor = findVariant({
      size,
      color: selectedVariant?.color,
    });

    setSelectedVariant(
      sameColor || variants.find((variant) => variant.size === size) || null
    );
    setQty(1);
    setCartError("");
  };

  const selectColor = (color: string) => {
    const sameSize = findVariant({
      size: selectedVariant?.size,
      color,
    });

    setSelectedVariant(
      sameSize || variants.find((variant) => variant.color === color) || null
    );
    setQty(1);
    setCartError("");
  };


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
            <span className="text-3xl font-semibold">₦{displayPrice.toLocaleString()}</span>
            {product.compare_price && (
              <span className="line-through text-neutral-400">
                ₦{Number(product.compare_price).toLocaleString()}
              </span>
            )}
          </div>

          <p className="mt-8 leading-7 text-neutral-600">{product.description}</p>

{hasVariants && (
  <>
    {/* Size */}
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Size</span>

        <Link to="/size-guide"
  className="text-sm underline text-neutral-500 hover:text-black"
>
  Size Guide
</Link>
      </div>

      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
            const isSelected = selectedVariant?.size === size;
            const inStockForSize = variants.some(
              (variant) =>
                variant.size === size &&
                Number(variant.stock_quantity) > 0
            );

            return (
              <button
                key={size}
                type="button"
                onClick={() => selectSize(size)}
                disabled={!inStockForSize}
                className={`w-14 h-10 rounded-xl border transition ${
                  isSelected
                    ? "bg-black text-white border-black"
                    : inStockForSize
                      ? "border-neutral-300 hover:border-black"
                      : "border-neutral-200 text-neutral-300 cursor-not-allowed"
                }`}
              >
                {size}
              </button>
            );
          })}
      </div>
    </div>

    {/* Color */}
    {colors.length > 0 && (
      <div className="mb-6">
        <span className="block text-sm font-medium mb-3">
          Color
        </span>

        <div className="flex flex-wrap gap-3">
          {colors.map((colorVariant) => {
            const isSelected =
              selectedVariant?.color === colorVariant.color;
            const inStockForColor = variants.some(
              (variant) =>
                variant.color === colorVariant.color &&
                Number(variant.stock_quantity) > 0
            );

            return (
              <button
                key={colorVariant.color}
                type="button"
                onClick={() => selectColor(colorVariant.color || "")}
                disabled={!inStockForColor}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                  isSelected
                    ? "border-black ring-1 ring-black"
                    : inStockForColor
                      ? "border-neutral-300 hover:border-black"
                      : "border-neutral-200 text-neutral-300 cursor-not-allowed"
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
      onClick={() => setQty(Math.min(maxQty || 1, qty + 1))}
      disabled={!hasStock || qty >= maxQty}
      className="w-10 h-10 text-xl hover:bg-neutral-100 transition"
    >
      +
    </button>

  </div>

</div>

          <button
onClick={async () => {
  try {
    setCartError("");

    if (hasVariants && !selectedVariant) {
      setCartError("Please select a size and color.");
      return;
    }

    if (!hasStock) {
      setCartError("This option is out of stock.");
      return;
    }

    await addItem({
      productId: product.id,
      variantId: hasVariants ? selectedVariant?.id : undefined,
      quantity: qty,
    });
  } catch (err) {
    setCartError(
      err instanceof Error
        ? err.message
        : "Unable to add this item to cart."
    );
  }
}}
            disabled={!hasStock || (hasVariants && !selectedVariant)}
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
disabled:cursor-not-allowed
disabled:opacity-50
"
          >
            {hasStock ? "Add to Cart" : "Out of Stock"}
          </button>
          {cartError && (
            <p className="mt-3 text-sm text-red-600">{cartError}</p>
          )}
          <div className="mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 bg-neutral-50">

  <div className="flex items-center gap-3">
    <span className="text-green-600 text-lg">✓</span>
    <div>
      <p className="font-medium">In Stock</p>
      <p className="text-sm text-neutral-500">
        {hasVariants && selectedVariant
          ? `${selectedVariant.stock_quantity} available for this option.`
          : "Ready to ship within 24 hours."}
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
