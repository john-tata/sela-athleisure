import { create } from 'zustand';
import { api } from '@/lib/api';

interface CartItem {
  id: string;
  quantity: number;

  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
  };

  variant?: {
    id: string;
    sku: string;
    size: string;
    color: string;
    color_hex: string;
    stock_quantity: number;
    price_adjustment: number;
  };

  image?: {
    url: string;
  };
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;

  open: () => void;
  close: () => void;
  loadCart: () => Promise<void>;

  addItem: (
    payload: {
      productId?: string;
      variantId?: string;
      quantity?: number;
    }) => Promise<void>;

  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;

  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
  isOpen: false,
  isLoading: false,

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  loadCart: async () => {
    try {
      const res = await api.getCart();

      if (res.success) {
        const {
          items,
          subtotal,
          shipping,
          total,
          itemCount,
        } = res.data;

        set({
          items: items || [],
          subtotal: subtotal || 0,
          shipping: shipping || 0,
          total: total || 0,
          itemCount: itemCount || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  },

  addItem: async (payload) => {
    set({ isLoading: true });

    try {
      const finalPayload = {
        ...payload,
        quantity: payload.quantity ?? 1,
      };

      const res = await api.addToCart(finalPayload);
      console.log('🛒 CART ADD RESPONSE:', res);
      if (res.success) {
        const {
          items,
          subtotal,
          shipping,
          total,
          itemCount,
        } = res.data;

        set({
          items: items || [],
          subtotal: subtotal || 0,
          shipping: shipping || 0,
          total: total || 0,
          itemCount: itemCount || 0,
          isOpen: true,
        });
      }
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });

    try {
      const res = await api.removeFromCart(itemId);

      if (res.success) {
        const {
          items,
          subtotal,
          shipping,
          total,
          itemCount,
        } = res.data;

        set({
          items: items || [],
          subtotal: subtotal || 0,
          shipping: shipping || 0,
          total: total || 0,
          itemCount: itemCount || 0,
        });
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return;

    set({ isLoading: true });

    try {
      const res = await api.updateCartItem(itemId, quantity);

      if (res.success) {
        const {
          items,
          subtotal,
          shipping,
          total,
          itemCount,
        } = res.data;

        set({
          items: items || [],
          subtotal: subtotal || 0,
          shipping: shipping || 0,
          total: total || 0,
          itemCount: itemCount || 0,
        });
      }
    } catch (err) {
      console.error('Failed to update item:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => {
    set({
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0,
    });
  },
}));