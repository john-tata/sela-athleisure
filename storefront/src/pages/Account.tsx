import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            <a href="#details" className="py-2 border-b-2 border-transparent hover:border-white hover:text-white transition-colors">
              Account Details
            </a>
            <a href="#orders" className="py-2 border-b-2 border-transparent hover:border-white hover:text-white transition-colors">
              Orders{orders.length > 0 ? ` (${orders.length})` : ""}
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
        </div>
      </div>
    </main>
  );
}
