import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, MapPin, Truck } from 'lucide-react';

import { useCartStore } from '@/stores/cartStore';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type ShippingQuote = {
  shipping: number;
  total: number;
  freeShipping: boolean;
  freeShippingThreshold: number | null;
  zone: {
    id: string;
    name: string;
    state?: string | null;
    description?: string | null;
  } | null;
};

type ShippingZone = {
  id: string;
  name: string;
  state?: string | null;
  description?: string | null;
  shipping_fee: number | string;
  free_shipping_threshold?: number | string | null;
};

export function Checkout() {
  const { user } = useAuth();

  const {
    items,
    subtotal,
    loadCart,
  } = useCartStore();

  const [shippingQuote, setShippingQuote] = useState<ShippingQuote>({
    shipping: 0,
    total: subtotal,
    freeShipping: false,
    freeShippingThreshold: null,
    zone: null,
  });

  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [shippingZonesLoading, setShippingZonesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    shipping_zone_id: '',
    shipping_zone_name: '',
    country: 'Nigeria',
    postal_code: '',
  });

  /*
   * Always load the latest cart when checkout opens.
   */
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    let cancelled = false;

    const loadShippingZones = async () => {
      try {
        setShippingZonesLoading(true);

        const response = await api.getShippingZones();

        if (!cancelled) {
          setShippingZones(response.data?.zones || []);
        }
      } catch (err) {
        console.error('Failed to load shipping zones:', err);

        if (!cancelled) {
          setError('Unable to load delivery areas.');
        }
      } finally {
        if (!cancelled) {
          setShippingZonesLoading(false);
        }
      }
    };

    loadShippingZones();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Keep shipping quote total synchronized with subtotal
   * whenever the cart changes.
   */
  useEffect(() => {
    setShippingQuote((prev) => ({
      ...prev,
      total: subtotal + prev.shipping,
    }));
  }, [subtotal]);

  /*
   * Calculate shipping whenever the customer selects
   * a delivery area.
   */
  useEffect(() => {
    const zoneId = form.shipping_zone_id;

    if (!zoneId) {
      setShippingQuote({
        shipping: 0,
        total: subtotal,
        freeShipping: false,
        freeShippingThreshold: null,
        zone: null,
      });

      return;
    }

    let cancelled = false;

    const calculateShipping = async () => {
      try {
        setShippingLoading(true);
        setError('');

        const response = await api.calculateShipping(
          {
            zoneId,
            state: form.state,
          },
          subtotal
        );

        if (cancelled) return;

        if (response.status !== 'success') {
          throw new Error('Unable to calculate shipping.');
        }

        setShippingQuote(response.data);
      } catch (err) {
        if (cancelled) return;

        console.error('Shipping calculation error:', err);

        setShippingQuote({
          shipping: 0,
          total: subtotal,
          freeShipping: false,
          freeShippingThreshold: null,
          zone: null,
        });

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to calculate shipping.'
        );
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    };

    calculateShipping();

    return () => {
      cancelled = true;
    };
  }, [form.shipping_zone_id, form.state, subtotal]);

  /*
   * Final amount shown to the customer.
   */
  const shipping = shippingQuote.shipping;
  const total = subtotal + shipping;

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectShippingZone = (zone: ShippingZone) => {
    setForm((prev) => ({
      ...prev,
      shipping_zone_id: zone.id,
      shipping_zone_name: zone.name,
      state: zone.state || zone.name,
      city: prev.city || (zone.name.toLowerCase().includes('abuja') ? 'Abuja' : prev.city),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!form.shipping_zone_id) {
      setError('Please select your delivery area before continuing.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      /*
       * Recalculate shipping one final time before creating
       * the order. This prevents the customer from paying
       * using a stale quote.
       */
      const shippingResponse = await api.calculateShipping(
        {
          zoneId: form.shipping_zone_id,
          state: form.state.trim(),
        },
        subtotal
      );

      if (shippingResponse.status !== 'success') {
        throw new Error(
          'Unable to calculate shipping. Please try again.'
        );
      }

      const finalShippingQuote = shippingResponse.data;

      setShippingQuote(finalShippingQuote);

      const orderItems = items.map((item) => ({
        productId: item.product.id,

        ...(item.variant?.id
          ? {
              variantId: item.variant.id,
            }
          : {}),

        variantName: item.variant
          ? `${item.variant.color || ''}${
              item.variant.color && item.variant.size
                ? ' / '
                : ''
            }${item.variant.size || ''}`
          : 'Default',

        quantity: item.quantity,
      }));

      /*
       * The backend should calculate the authoritative
       * order total from the items + shipping address.
       */
      const orderData = {
        items: orderItems,
        shippingAddress: form,
        billingAddress: form,
      };

      const orderRes = user
        ? await api.createOrder(orderData)
        : await api.createGuestOrder({
            email: form.email,
            ...orderData,
          });

      if (orderRes.status !== 'success') {
        throw new Error('Unable to create your order.');
      }

      const order = orderRes.data;

      /*
       * Payment initialization should use the order that was
       * just created. The backend should use the order's final
       * total rather than trusting a frontend amount.
       */
      const paymentRes = await api.initializePayment(
        order.id,
        form.email
      );

      if (paymentRes.status !== 'success') {
        throw new Error(
          'Unable to initialize payment.'
        );
      }

      sessionStorage.setItem(
        'pending_order',
        JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          email: form.email,
        })
      );

      window.location.href =
        paymentRes.data.authorizationUrl;
    } catch (err) {
      console.error('Checkout error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white pt-[100px] px-4">
        <div className="max-w-xl mx-auto text-center py-20">
          <h1 className="font-display text-4xl text-rich-black">
            Your cart is empty
          </h1>

          <p className="font-body text-sm text-cool-gray mt-4">
            Add some products before checking out.
          </p>

          <Link
            to="/shop"
            className="inline-flex mt-8 bg-rich-black text-white px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-[60px] lg:pt-[72px]">
      <section className="px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto">

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.12em] text-cool-gray hover:text-rich-black"
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 mt-10">

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              <div className="flex items-center gap-2 mb-8">
                <Lock size={16} />

                <h1 className="font-display text-4xl sm:text-5xl text-rich-black">
                  Checkout
                </h1>
              </div>

              <div className="space-y-10">

                {/* Contact */}
                <section>
                  <h2 className="font-body text-sm font-semibold uppercase tracking-[0.12em] text-rich-black mb-5">
                    Contact Information
                  </h2>

                  <div className="space-y-4">

                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) =>
                        updateField(
                          'email',
                          e.target.value
                        )
                      }
                      className="checkout-input"
                    />

                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          'phone',
                          e.target.value
                        )
                      }
                      className="checkout-input"
                    />

                  </div>
                </section>

                {/* Shipping */}
                <section>
                  <h2 className="font-body text-sm font-semibold uppercase tracking-[0.12em] text-rich-black mb-5">
                    Shipping Address
                  </h2>

                  <div className="space-y-4">

                    <input
                      required
                      placeholder="Full name"
                      value={form.full_name}
                      onChange={(e) =>
                        updateField(
                          'full_name',
                          e.target.value
                        )
                      }
                      className="checkout-input"
                    />

                    <input
                      required
                      placeholder="Address"
                      value={form.address_line1}
                      onChange={(e) =>
                        updateField(
                          'address_line1',
                          e.target.value
                        )
                      }
                      className="checkout-input"
                    />

                    <input
                      placeholder="Apartment, suite, etc. (optional)"
                      value={form.address_line2}
                      onChange={(e) =>
                        updateField(
                          'address_line2',
                          e.target.value
                        )
                      }
                      className="checkout-input"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <input
                        required
                        placeholder="City"
                        value={form.city}
                        onChange={(e) =>
                          updateField(
                            'city',
                            e.target.value
                          )
                        }
                        className="checkout-input"
                      />

                      <input
                        value={form.state}
                        readOnly
                        placeholder="State"
                        className="checkout-input bg-gray-50"
                      />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <input
                        required
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) =>
                          updateField(
                            'country',
                            e.target.value
                          )
                        }
                        className="checkout-input"
                      />

                      <input
                        placeholder="Postal code"
                        value={form.postal_code}
                        onChange={(e) =>
                          updateField(
                            'postal_code',
                            e.target.value
                          )
                        }
                        className="checkout-input"
                      />

                    </div>

                  </div>

                  <div className="mt-6 border border-gray-200 bg-white">
                    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4">
                      <MapPin size={18} className="text-rich-black" />

                      <h3 className="font-body text-base font-semibold text-rich-black">
                        Select Shipping
                      </h3>
                    </div>

                    {shippingZonesLoading ? (
                      <p className="font-body text-sm text-cool-gray p-4">
                        Loading delivery areas...
                      </p>
                    ) : shippingZones.length === 0 ? (
                      <p className="font-body text-sm text-cool-gray p-4">
                        No delivery areas are available right now.
                      </p>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {shippingZones.map((zone) => {
                          const checked =
                            form.shipping_zone_id === zone.id;

                          return (
                            <label
                              key={zone.id}
                              className="grid cursor-pointer grid-cols-[24px_1fr_auto] gap-3 px-4 py-5 hover:bg-gray-50"
                            >
                              <input
                                type="radio"
                                name="shipping_zone"
                                checked={checked}
                                onChange={() =>
                                  selectShippingZone(zone)
                                }
                                className="mt-1 h-4 w-4 accent-rich-black"
                              />

                              <span>
                                <span className="block font-body text-sm font-semibold text-rich-black">
                                  {zone.name}
                                </span>

                                {zone.description && (
                                  <span className="mt-2 block font-body text-sm leading-6 text-cool-gray">
                                    {zone.description}
                                  </span>
                                )}
                              </span>

                              <span className="font-body text-sm font-semibold text-rich-black">
                                N
                                {Number(
                                  zone.shipping_fee
                                ).toLocaleString()}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Shipping status */}
                  {form.shipping_zone_id && (
                    <div className="mt-5 flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">

                      <Truck
                        size={17}
                        className="text-rich-black"
                      />

                      <div className="flex-1">

                        {shippingLoading ? (
                          <p className="font-body text-sm text-cool-gray">
                            Calculating shipping...
                          </p>
                        ) : shippingQuote.zone ? (
                          <div>
                            <p className="font-body text-sm font-medium text-rich-black">
                              Shipping to{' '}
                              {shippingQuote.zone.name}
                            </p>

                            <p className="font-body text-xs text-cool-gray mt-1">
                              {shippingQuote.freeShipping
                                ? 'Free shipping'
                                : `Delivery: N${shipping.toLocaleString()}`}
                            </p>
                          </div>
                        ) : (
                          <p className="font-body text-sm text-red-600">
                            Shipping unavailable for this location.
                          </p>
                        )}

                      </div>
                    </div>
                  )}
                </section>

                {error && (
                  <div className="border border-red-200 bg-red-50 p-4">
                    <p className="font-body text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    shippingLoading ||
                    shippingZonesLoading ||
                    !shippingQuote.zone
                  }
                  className="w-full bg-rich-black text-black py-4 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold hover:text-rich-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Processing...'
                    : shippingLoading
                      ? 'Calculating shipping...'
                      : `Pay N${total.toLocaleString()}`}
                </button>

                <p className="font-body text-xs text-cool-gray text-center">
                  You will be redirected to Paystack to complete your payment securely.
                </p>

              </div>
            </form>

            {/* ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-28 h-fit bg-gray-50 p-6 sm:p-8">

              <h2 className="font-display text-2xl text-rich-black mb-6">
                Your Order
              </h2>

              <div className="space-y-5">

                {items.map((item) => {
                  const price =
  item.variant?.price != null
    ? Number(item.variant.price)
    : Number(item.product?.base_price || 0);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4"
                    >
                      <img
                        src={
                          item.image?.url ||
                          '/assets/placeholder.jpg'
                        }
                        alt={item.product?.name}
                        className="w-20 h-24 object-cover bg-gray-100"
                      />

                      <div className="flex-1">

                        <p className="font-body text-sm font-medium text-rich-black">
                          {item.product?.name}
                        </p>

                        <p className="font-body text-xs text-cool-gray mt-1">
                          Qty: {item.quantity}
                        </p>

                        {item.variant && (
                          <p className="font-body text-xs text-cool-gray mt-1">
                            {item.variant.color} /{' '}
                            {item.variant.size}
                          </p>
                        )}

                        <p className="font-body text-sm font-semibold mt-2">
                          N
                          {(
                            price * item.quantity
                          ).toLocaleString()}
                        </p>

                      </div>
                    </div>
                  );
                })}

              </div>

              <div className="border-t border-gray-200 mt-8 pt-6 space-y-3">

                <div className="flex justify-between font-body text-sm text-cool-gray">
                  <span>Subtotal</span>
                  <span>
                    N{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between font-body text-sm text-cool-gray">
                  <span>Shipping</span>

                  <span>
                    {shippingLoading
                      ? 'Calculating...'
                      : shippingQuote.freeShipping
                        ? 'Free'
                        : shippingQuote.zone
                          ? `N${shipping.toLocaleString()}`
                          : '—'}
                  </span>
                </div>

                {shippingQuote.freeShippingThreshold !== null &&
                  !shippingQuote.freeShipping && (
                    <p className="font-body text-xs text-cool-gray pt-1">
                      Spend N
                      {Math.max(
                        0,
                        shippingQuote.freeShippingThreshold -
                          subtotal
                      ).toLocaleString()}{' '}
                      more for free shipping.
                    </p>
                  )}

                <div className="flex justify-between border-t border-gray-200 pt-4 font-body text-lg font-semibold text-rich-black">
                  <span>Total</span>

                  <span>
                    N{total.toLocaleString()}
                  </span>
                </div>

              </div>

            </aside>

          </div>
        </div>
      </section>

      <style>{`
        .checkout-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          background: white;
          padding: 14px 16px;
          font-family: inherit;
          font-size: 14px;
          color: #111111;
          outline: none;
          transition: border-color 200ms;
        }

        .checkout-input:focus {
          border-color: #111111;
        }

        .checkout-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </main>
  );
}
