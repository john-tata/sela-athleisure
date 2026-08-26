import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { api } from "@/lib/api";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    compare_price?: number;
    images?: { url: string; alt_text?: string }[];
    variants?: { id: string; size: string; color: string; stock_quantity: number }[];
    is_bestseller?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {

const [isHovered, setIsHovered] = useState(false);

const [isWishlisted, setIsWishlisted] = useState(false);

const [wishlistLoading, setWishlistLoading] = useState(false);

const [justAdded, setJustAdded] = useState(false);

const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
  let cancelled = false;

  const checkWishlist = async () => {
    const token = localStorage.getItem("sb_token");

    // Favorites require a logged-in user
    if (!token) {
      return;
    }

    try {
      const response = await api.checkFavorite(product.id);

      if (!cancelled) {
        setIsWishlisted(Boolean(response.isFavorite));
      }
    } catch (error) {
      console.error("Failed to check favorite:", error);
    }
  };

  checkWishlist();

  return () => {
    cancelled = true;
  };
}, [product.id]);

  const firstImage = product.images?.[0];
  const hasComparePrice =
    product.compare_price && product.compare_price > product.base_price;

  const firstAvailableVariant = product.variants?.find(
    (v) => v.stock_quantity > 0
  );

const handleQuickAdd = useCallback(
  async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = firstAvailableVariant || product.variants?.[0];

    const payload = variant
      ? {
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
        }
      : {
          productId: product.id,
          quantity: 1,
        };

    console.log("Quick Add:", payload);

    await addItem(payload);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  },
  [firstAvailableVariant, product, addItem]
);

const handleWishlist = useCallback(
  async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("sb_token");

    if (!token) {
      alert("Please log in to save favorites.");
      return;
    }

    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      if (isWishlisted) {
        await api.removeFavorite(product.id);
        setIsWishlisted(false);
      } else {
        await api.addFavorite(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update favorite."
      );
    } finally {
      setWishlistLoading(false);
    }
  },
  [isWishlisted, wishlistLoading, product.id]
);

  const badge = product.is_bestseller ? 'Bestseller' : undefined;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-light-gray">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.alt_text || product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-light-gray">
              <span className="font-body text-sm text-cool-gray">
                No image
              </span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <span className="absolute left-3 top-3 bg-rich-black px-2.5 py-1 font-body text-xs font-medium uppercase tracking-wide text-white">
              {badge}
            </span>
          )}

          {/* Wishlist Button */}
          <button
  onClick={handleWishlist}
  disabled={wishlistLoading}
  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md disabled:cursor-wait disabled:opacity-60"
  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
>
            <Heart
              className={`h-4 w-4 transition-colors duration-200 ${
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-rich-black"
              }`}
            />
          </button>

          {/* Quick Add Button */}
          {product.id && (
            <button
              onClick={handleQuickAdd}
              className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-3 font-body text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                justAdded
                  ? "bg-green-600 text-white translate-y-0 opacity-100"
                  : isHovered
                  ? "bg-rich-black text-white translate-y-0 opacity-100"
                  : "bg-rich-black text-white translate-y-full opacity-0"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Quick Add
                </>
              )}
            </button>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-3">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-body text-sm font-medium text-rich-black transition-colors duration-200 hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-body text-sm font-semibold text-rich-black">
            ₦{Number(product.base_price).toLocaleString()}
          </span>
          {hasComparePrice && (
            <span className="font-body text-sm text-cool-gray line-through">
              ₦{Number(product.compare_price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
