import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function CartDrawer() {
  const { items, subtotal, shipping, total, itemCount, isOpen, close, removeItem, updateQuantity, loadCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1001]" onClick={close} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[1002] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#111111]" />
            <h2 className="font-body text-lg font-semibold text-[#111111]">Your Cart ({itemCount})</h2>
          </div>
          <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="font-body text-gray-500">Your cart is empty</p>
              <button onClick={close} className="mt-4 font-body text-sm text-[#C89A5A] hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const price = (item.product?.base_price || 0) + (item.variant?.price_adjustment || 0);
                return (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image?.url || '/assets/placeholder.jpg'}
                      alt={item.product?.name}
                      className="w-24 h-28 rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-body text-sm font-medium text-[#111111]">{item.product?.name}</h3>
                      <p className="font-body text-xs text-gray-500 mt-0.5">
  {item.variant
    ? `${item.variant.color || ''}${item.variant.color && item.variant.size ? ' / ' : ''}${item.variant.size || ''}`
    : 'Simple product'}
</p>
                      <p className="font-body text-sm font-semibold mt-1">N{price.toLocaleString()}</p>

                      <div className="flex items-center justify-between mt-2">
  {/* Quantity */}
  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
    <button
      onClick={() =>
        updateQuantity(item.id, item.quantity - 1)
      }
      disabled={item.quantity <= 1}
      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <Minus size={14} />
    </button>

    <span className="px-4 font-body text-sm font-medium">
      {item.quantity}
    </span>

    <button
      onClick={() =>
        updateQuantity(item.id, item.quantity + 1)
      }
      className="p-2 hover:bg-gray-50 transition-colors"
    >
      <Plus size={14} />
    </button>
  </div>

  {/* Delete */}
  <button
    onClick={() => removeItem(item.id)}
    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
    aria-label={`Remove ${item.product?.name} from cart`}
  >
    <Trash2 size={16} />
  </button>
</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-body text-gray-600">
                <span>Subtotal</span>
                <span>N{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `N${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between font-body text-lg font-semibold text-[#111111] pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>N{total.toLocaleString()}</span>
              </div>
              {shipping > 0 && (
                <p className="font-body text-xs text-gray-400">
                  Free shipping on orders over N30,000
                </p>
              )}
            </div>
            <button
  onClick={() => {
    close();
    navigate('/checkout');
  }}
  className="w-full mt-4 bg-[#111111] text-black py-4 font-body text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#C89A5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  Checkout
</button>
          </div>
        )}
      </div>
    </>
  );
}
