import { type FormEvent } from "react";
import { useState } from "react";
import { Search, Package, CheckCircle2, Truck, Clock3 } from "lucide-react";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim() || !email.trim()) return;

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-cool-gray">
            SELA
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-rich-black mt-4">
            Track Order
          </h1>

          <p className="font-body text-sm sm:text-base text-cool-gray mt-6 max-w-xl leading-7">
            Enter your order details below to check the latest status of your
            SELA order.
          </p>
        </div>
      </section>

      {/* Tracker */}
      <section className="px-4 sm:px-6 lg:px-12 py-14 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="border border-gray-200 p-6 sm:p-8 lg:p-10">
            <div className="flex items-start gap-4 mb-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-rich-black text-white">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-rich-black">
                  Find your order
                </h2>

                <p className="font-body text-sm text-cool-gray mt-2 leading-6">
                  Enter the order number and email address used when placing
                  your order.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="order-number"
                  className="block font-body text-xs font-medium uppercase tracking-[0.12em] text-rich-black mb-2"
                >
                  Order Number
                </label>

                <input
                  id="order-number"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. SELA-10024"
                  className="w-full border border-gray-200 px-4 py-3.5 font-body text-sm text-rich-black outline-none transition-colors placeholder:text-gray-400 focus:border-rich-black"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-body text-xs font-medium uppercase tracking-[0.12em] text-rich-black mb-2"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 px-4 py-3.5 font-body text-sm text-rich-black outline-none transition-colors placeholder:text-gray-400 focus:border-rich-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-rich-black text-white px-6 py-4 font-body text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-gold"
              >
                <Search className="h-4 w-4" />
                Track Order
              </button>
            </form>

            {submitted && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />

                  <div>
                    <p className="font-body text-sm font-semibold text-rich-black">
                      Order lookup submitted
                    </p>

                    <p className="font-body text-xs text-cool-gray mt-1">
                      Order #{orderNumber}
                    </p>
                  </div>
                </div>

                {/* Status Preview */}
                <div className="space-y-0">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rich-black text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <div className="w-px h-12 bg-gray-200" />
                    </div>

                    <div className="pb-8">
                      <p className="font-body text-sm font-medium text-rich-black">
                        Order received
                      </p>

                      <p className="font-body text-xs text-cool-gray mt-1">
                        Your order has been received.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white">
                        <Clock3 className="h-4 w-4 text-gray-400" />
                      </div>

                      <div className="w-px h-12 bg-gray-200" />
                    </div>

                    <div className="pb-8">
                      <p className="font-body text-sm font-medium text-rich-black">
                        Processing
                      </p>

                      <p className="font-body text-xs text-cool-gray mt-1">
                        Your order will be prepared for shipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white">
                      <Truck className="h-4 w-4 text-gray-400" />
                    </div>

                    <div>
                      <p className="font-body text-sm font-medium text-rich-black">
                        Shipped
                      </p>

                      <p className="font-body text-xs text-cool-gray mt-1">
                        Tracking information will appear once your order ships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="mt-10 text-center">
            <p className="font-body text-sm text-cool-gray">
              Can't find your order or need help?
            </p>

            <a
              href="/contact"
              className="inline-block mt-2 font-body text-sm font-medium text-rich-black underline underline-offset-4 hover:text-gold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}