import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { api } from '@/lib/api';

export function Checkout() {
  

  const {
    items,
    subtotal,
    shipping,
    total,
    loadCart,
  } = useCartStore();

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
    country: 'Nigeria',
    postal_code: '',
  });

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        ...(item.variant?.id
          ? { variantId: item.variant.id }
          : {}),
        variantName: item.variant
          ? `${item.variant.color || ''}${
              item.variant.color && item.variant.size ? ' / ' : ''
            }${item.variant.size || ''}`
          : 'Default',
        quantity: item.quantity,
      }));

      const orderRes = await api.createGuestOrder({
        email: form.email,
        items: orderItems,
        shippingAddress: form,
        billingAddress: form,
      });

      if (orderRes.status !== 'success') {
        throw new Error('Unable to create your order.');
      }

      const order = orderRes.data;

      const paymentRes = await api.initializePayment(
        order.id,
        form.email
      );

      if (paymentRes.status !== 'success') {
        throw new Error('Unable to initialize payment.');
      }

      // Save order information so the verification page
      // knows which order the customer just paid for.
      sessionStorage.setItem(
        'pending_order',
        JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          email: form.email,
        })
      );

      window.location.href = paymentRes.data.authorizationUrl;
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
                        updateField('email', e.target.value)
                      }
                      className="checkout-input"
                    />

                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={(e) =>
                        updateField('phone', e.target.value)
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
                        updateField('full_name', e.target.value)
                      }
                      className="checkout-input"
                    />

                    <input
                      required
                      placeholder="Address"
                      value={form.address_line1}
                      onChange={(e) =>
                        updateField('address_line1', e.target.value)
                      }
                      className="checkout-input"
                    />

                    <input
                      placeholder="Apartment, suite, etc. (optional)"
                      value={form.address_line2}
                      onChange={(e) =>
                        updateField('address_line2', e.target.value)
                      }
                      className="checkout-input"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <input
                        required
                        placeholder="City"
                        value={form.city}
                        onChange={(e) =>
                          updateField('city', e.target.value)
                        }
                        className="checkout-input"
                      />

                      <input
                        required
                        placeholder="State"
                        value={form.state}
                        onChange={(e) =>
                          updateField('state', e.target.value)
                        }
                        className="checkout-input"
                      />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <input
                        required
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) =>
                          updateField('country', e.target.value)
                        }
                        className="checkout-input"
                      />

                      <input
                        placeholder="Postal code"
                        value={form.postal_code}
                        onChange={(e) =>
                          updateField('postal_code', e.target.value)
                        }
                        className="checkout-input"
                      />

                    </div>

                  </div>
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
                  disabled={loading}
                  className="w-full bg-rich-black text-white py-4 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? 'Processing...'
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
                    (item.product?.base_price || 0) +
                    (item.variant?.price_adjustment || 0);

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
                            {item.variant.color} / {item.variant.size}
                          </p>
                        )}

                        <p className="font-body text-sm font-semibold mt-2">
                          N{(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>

              <div className="border-t border-gray-200 mt-8 pt-6 space-y-3">

                <div className="flex justify-between font-body text-sm text-cool-gray">
                  <span>Subtotal</span>
                  <span>N{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-body text-sm text-cool-gray">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? 'Free'
                      : `N${shipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-4 font-body text-lg font-semibold text-rich-black">
                  <span>Total</span>
                  <span>N{total.toLocaleString()}</span>
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