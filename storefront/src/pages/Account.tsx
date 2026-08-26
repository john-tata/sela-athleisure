import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

import milkyWayRidge from "@/assets/milky-way-ridge.jpg";

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
};

type Favorite = {
  id: string;
  product_id: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    compare_price?: number | null;
    is_active: boolean;
    is_bestseller: boolean;
    is_featured: boolean;
    is_new: boolean;
    product_images: {
      id: string;
      url: string;
      alt_text?: string | null;
      is_primary: boolean;
      sort_order: number;
    }[];
  };
};
// ---- Status presentation (dark-glass tinted) -------------------------------

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  pending: { dot: "bg-amber-300", text: "text-amber-200", bg: "bg-amber-400/15", border: "border-amber-300/30" },
  processing: { dot: "bg-blue-300", text: "text-blue-200", bg: "bg-blue-400/15", border: "border-blue-300/30" },
  confirmed: { dot: "bg-blue-300", text: "text-blue-200", bg: "bg-blue-400/15", border: "border-blue-300/30" },
  shipped: { dot: "bg-indigo-300", text: "text-indigo-200", bg: "bg-indigo-400/15", border: "border-indigo-300/30" },
  out_for_delivery: { dot: "bg-indigo-300", text: "text-indigo-200", bg: "bg-indigo-400/15", border: "border-indigo-300/30" },
  delivered: { dot: "bg-emerald-300", text: "text-emerald-200", bg: "bg-emerald-400/15", border: "border-emerald-300/30" },
  completed: { dot: "bg-emerald-300", text: "text-emerald-200", bg: "bg-emerald-400/15", border: "border-emerald-300/30" },
  paid: { dot: "bg-emerald-300", text: "text-emerald-200", bg: "bg-emerald-400/15", border: "border-emerald-300/30" },
  cancelled: { dot: "bg-red-300", text: "text-red-200", bg: "bg-red-400/15", border: "border-red-300/30" },
  failed: { dot: "bg-red-300", text: "text-red-200", bg: "bg-red-400/15", border: "border-red-300/30" },
  refunded: { dot: "bg-white/60", text: "text-white/70", bg: "bg-white/10", border: "border-white/20" },
};

const DEFAULT_STATUS_STYLE = { dot: "bg-white/60", text: "text-white/70", bg: "bg-white/10", border: "border-white/20" };

function formatStatus(status: string) {
  return status
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status?.toLowerCase()] ?? DEFAULT_STATUS_STYLE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${style.border} ${style.bg} ${style.text} px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full backdrop-blur-sm`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {formatStatus(status || "Unknown")}
    </span>
  );
}

// ---- Skeletons --------------------------------------------------------------

function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-white/15 rounded" />
          <div className="h-3 w-20 bg-white/10 rounded" />
        </div>
        <div className="space-y-2 sm:items-end sm:flex sm:flex-col">
          <div className="h-4 w-24 bg-white/15 rounded" />
          <div className="h-3 w-32 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

function BackgroundScene() {
  return (
    <div className="absolute inset-0">
      <style>{`
        @keyframes selaKenBurnsSlow {
          0%   { transform: scale(1.04) translate(0, 0); }
          100% { transform: scale(1.12) translate(-1%, 0.5%); }
        }
        .sela-account-bg {
          animation: selaKenBurnsSlow 30s ease-out forwards;
        }
      `}</style>
      <img src={milkyWayRidge} alt="" className="sela-account-bg absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/70" />
    </div>
  );
}

function AccountPageSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundScene />
      <div className="relative z-10 pt-[120px] px-4 sm:px-6 lg:px-12 pb-24">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 pb-8 border-b border-white/15">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/10 border border-white/15" />
              <div className="space-y-3">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-9 w-56 bg-white/15 rounded" />
                <div className="h-3 w-40 bg-white/10 rounded" />
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 rounded-2xl border border-white/15 bg-white/5 h-56" />
            <div className="lg:col-span-2 space-y-4">
              <OrderCardSkeleton />
              <OrderCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---- Page --------------------------------------------------------------

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, signOut } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
const [favoritesLoading, setFavoritesLoading] = useState(true);
const [removingFavorite, setRemovingFavorite] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        const response = await api.getMyOrders();
        setOrders(response?.data?.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  useEffect(() => {
  if (!user) return;

  const loadFavorites = async () => {
    try {
      const response = await api.getFavorites();

      console.log("ACCOUNT FAVORITES:", response);

      setFavorites(response?.favorites || []);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  loadFavorites();
}, [user]);

const handleRemoveFavorite = async (productId: string) => {
  setRemovingFavorite(productId);

  try {
    await api.removeFavorite(productId);

    setFavorites((current) =>
      current.filter((favorite) => favorite.product_id !== productId)
    );
  } catch (error) {
    console.error("Failed to remove favorite:", error);
  } finally {
    setRemovingFavorite(null);
  }
};

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate("/");
    } finally {
      setSigningOut(false);
    }
  };

  if (authLoading || !user) {
    return <AccountPageSkeleton />;
  }

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");

  const initials =
    [profile?.first_name?.[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundScene />

      <div className="relative z-10 pt-[120px] px-4 sm:px-6 lg:px-12 pb-24">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 pb-8 border-b border-white/15">
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-white font-display text-xl">
                {initials}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
                  My Account
                </p>

                <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight">
                  {profile?.first_name ? `Hello, ${profile.first_name}` : "My Account"}
                </h1>

                <p className="text-sm text-white/60 mt-3">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="border border-white/40 text-white px-6 py-3 text-xs uppercase tracking-wider hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>

          {/* Section nav */}
          <nav className="flex items-center gap-8 mb-10 -mt-2 text-xs uppercase tracking-wider text-white/50">
  <a
    href="#details"
    className="py-2 border-b-2 border-transparent hover:border-white hover:text-white transition-colors"
  >
    Account Details
  </a>

  <a
    href="#orders"
    className="py-2 border-b-2 border-transparent hover:border-white hover:text-white transition-colors"
  >
    Orders{orders.length > 0 ? ` (${orders.length})` : ""}
  </a>

  <a
    href="#favorites"
    className="py-2 border-b-2 border-transparent hover:border-white hover:text-white transition-colors"
  >
    Favourites{favorites.length > 0 ? ` (${favorites.length})` : ""}
  </a>
</nav>

          <div className="grid lg:grid-cols-3 gap-8">

            <section
              id="details"
              className="lg:col-span-1 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-2xl p-6 scroll-mt-32 self-start"
            >
              <h2 className="font-display text-2xl text-white mb-6">
                Account Details
              </h2>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                    Name
                  </p>
                  <p className="text-white">
                    {fullName || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                    Email
                  </p>
                  <p className="text-white break-all">{user.email}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                    Phone
                  </p>
                  <p className="text-white">{profile?.phone || "Not provided"}</p>
                </div>
              </div>
            </section>

            <section id="orders" className="lg:col-span-2 scroll-mt-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-white">
                  My Orders
                </h2>

                <Link
                  to="/shop"
                  className="text-xs uppercase tracking-wider text-white/70 underline underline-offset-4 hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {ordersLoading ? (
                <div className="space-y-4">
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-2xl p-10 sm:p-14 text-center">
                  <svg
                    className="mx-auto mb-5 h-10 w-10 text-white/40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    <path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <p className="font-display text-xl text-white mb-2">
                    No orders yet
                  </p>

                  <p className="text-sm text-white/60 mb-6 max-w-xs mx-auto">
                    Your orders will appear here once you make a purchase.
                  </p>

                  <Link
                    to="/shop"
                    className="inline-block bg-white text-rich-black px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-white/90 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-xl p-5 hover:border-white/35 hover:bg-white/[0.14] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="font-medium tracking-wide text-white">
                            {order.order_number}
                          </p>

                          <p className="text-xs text-white/50 mt-1">
                            {new Date(order.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2">
                          <p className="font-medium text-white">
                            ₦{Number(order.total).toLocaleString()}
                          </p>

                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            <StatusBadge status={order.status} />
                            <StatusBadge status={order.payment_status} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

                    </div>

          {/* Favourites */}
          <section
            id="favorites"
            className="mt-10 scroll-mt-32"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl text-white">
                  My Favourites
                </h2>

                <p className="text-sm text-white/50 mt-1">
                  Pieces you've saved for later.
                </p>
              </div>

              <Link
                to="/shop"
                className="text-xs uppercase tracking-wider text-white/70 underline underline-offset-4 hover:text-white transition-colors"
              >
                Shop More
              </Link>
            </div>

            {favoritesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="aspect-[3/4] rounded-2xl border border-white/10 bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-2xl p-10 sm:p-14 text-center">
                <Heart className="mx-auto mb-5 h-10 w-10 text-white/40" />

                <p className="font-display text-xl text-white mb-2">
                  No favourites yet
                </p>

                <p className="text-sm text-white/60 mb-6 max-w-sm mx-auto">
                  Save pieces you love and they'll appear here.
                </p>

                <Link
                  to="/shop"
                  className="inline-block bg-white text-rich-black px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-white/90 transition-colors"
                >
                  Explore the Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {favorites.map((favorite) => {
                  const product = favorite.products;
   const image =
   product.product_images?.find((img) => img.is_primary) ||
   product.product_images?.[0];

                  return (
                    <div
                      key={favorite.id}
                      className="group relative"
                    >
                      <Link
                        to={`/products/${product.slug}`}
                        className="block"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white/10">
                          {image ? (
                            <img
                              src={image.url}
                              alt={image.alt_text || product.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-white/30" />
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                            <p className="text-xs text-white/60">
                              Saved
                            </p>
                          </div>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveFavorite(product.id)
                        }
                        disabled={removingFavorite === product.id}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 disabled:opacity-50"
                        aria-label={`Remove ${product.name} from favourites`}
                      >
                        {removingFavorite === product.id ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>

                      <div className="mt-3">
                        <Link to={`/products/${product.slug}`}>
                          <h3 className="text-sm font-medium text-white hover:text-white/70 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            ₦{Number(product.base_price).toLocaleString()}
                          </span>

                          {product.compare_price &&
                            Number(product.compare_price) >
                              Number(product.base_price) && (
                              <span className="text-sm text-white/40 line-through">
                                ₦
                                {Number(
                                  product.compare_price
                                ).toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
