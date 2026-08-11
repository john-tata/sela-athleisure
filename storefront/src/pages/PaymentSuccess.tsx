import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { loadCart } = useCartStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading'
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference was found.');
        return;
      }

      try {
        const response = await api.verifyPayment(reference);

        if (
          response.status === 'success' &&
          response.data?.status === 'success'
        ) {
          setStatus('success');

          sessionStorage.removeItem('pending_order');

          await loadCart();
        } else {
          setStatus('failed');
          setMessage('We could not confirm your payment.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);

        setStatus('failed');
        setMessage(
          error instanceof Error
            ? error.message
            : 'We could not verify your payment.'
        );
      }
    };

    verifyPayment();
  }, [searchParams, loadCart]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-rich-black"
          />

          <h1 className="font-display text-3xl text-rich-black mt-6">
            Confirming your payment
          </h1>

          <p className="font-body text-gray-500 mt-3">
            Please wait while we confirm your order.
          </p>
        </div>
      </main>
    );
  }

  if (status === 'failed') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-20">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <XCircle size={42} className="text-red-600" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-rich-black">
            Payment Not Confirmed
          </h1>

          <p className="font-body text-gray-500 mt-4 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              to="/checkout"
              className="bg-rich-black text-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold transition-colors"
            >
              Return to Checkout
            </Link>

            <Link
              to="/shop"
              className="border border-gray-200 text-rich-black px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:border-rich-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center py-20">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle size={42} className="text-green-600" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-rich-black">
          Payment Successful
        </h1>

        <p className="font-body text-gray-500 mt-4 leading-relaxed">
          Thank you for your order. Your payment has been received and your
          order is now being processed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/"
            className="bg-rich-black text-white px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gold transition-colors"
          >
            Back to Home
          </Link>

          <Link
            to="/shop"
            className="border border-gray-200 text-rich-black px-7 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:border-rich-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}