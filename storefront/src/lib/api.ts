const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

function getGuestToken() {
  let token = localStorage.getItem('guest_token');

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('guest_token', token);
  }

  return token;
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('sb_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (endpoint.startsWith('/cart') && !token) {
    headers['x-guest-token'] = getGuestToken();
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({ message: 'Request failed' }));

  if (!res.ok) {
    const message =
      typeof data.message === 'string'
        ? data.message
        : typeof data.error === 'string'
          ? data.error
          : JSON.stringify(data.message || data.error || data);

    throw new Error(message);
  }

  return data;
}

export const api = {
  // Products
  getProducts: (params = '') => fetchApi(`/products?${params}`),
  getProduct: (slug: string) => fetchApi(`/products/${slug}`),

  // Categories
  getCategories: () => fetchApi('/categories'),
  getCategory: (slug: string) => fetchApi(`/categories/${slug}`),

   // Cart
getCart: () => fetchApi('/cart'),

addToCart: (
  payload: {
    productId?: string;
    variantId?: string;
    quantity?: number;
  }
) =>
  fetchApi('/cart/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

removeFromCart: (itemId: string) =>
  fetchApi(`/cart/items/${itemId}`, {
    method: 'DELETE',
  }),

updateCartItem: (itemId: string, quantity: number) =>
  fetchApi(`/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),
  
  // Favorites
getFavorites: () =>
  fetchApi('/favorites'),

checkFavorite: (productId: string) =>
  fetchApi(`/favorites/${productId}`),

addFavorite: (productId: string) =>
  fetchApi('/favorites', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  }),

removeFavorite: (productId: string) =>
  fetchApi(`/favorites/${productId}`, {
    method: 'DELETE',
  }),

 // Orders
createOrder: (orderData: any) =>
  fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

createGuestOrder: (orderData: any) =>
  fetchApi('/orders/guest', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

getOrders: () => fetchApi('/orders'),

getMyOrders: () => fetchApi('/orders/my-orders'),

//Shipping
getShippingZones: () => fetchApi('/shipping/available'),

calculateShipping: (params: { zoneId?: string; state?: string }, subtotal: number) => {
  const query = new URLSearchParams({
    subtotal: String(subtotal),
  });

  if (params.zoneId) query.set('zoneId', params.zoneId);
  if (params.state) query.set('state', params.state);

  return fetchApi(`/shipping/calculate?${query.toString()}`);
},

calculateShippingByState: (state: string, subtotal: number) =>
  fetchApi(
    `/shipping/calculate?state=${encodeURIComponent(state)}&subtotal=${encodeURIComponent(subtotal)}`
  ),
// Payments
initializePayment: (orderId: string, email: string) =>
  fetchApi('/payments/initialize', {
    method: 'POST',
    body: JSON.stringify({
      orderId,
      email,
    }),
  }),

verifyPayment: (reference: string) =>
  fetchApi(`/payments/verify/${reference}`),

submitContact: (payload: {
  name: string;
  email: string;
  message: string;
}) =>
  fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
  // Content
  getContent: (section: string) => fetchApi(`/content/${section}`),
  getAllContent: () => fetchApi('/content/all'),
};
export const contentApi = {
  getSection: async (key: string) => {
    const response = await fetchApi(`/content/section/${key}`);
    return response;
  },

  updateSection: async (key: string, data: any) => {
    const response = await fetchApi(`/content/section/${key}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response;
  },

  listSlides: async () => {
    const response = await fetchApi('/content/hero-slides');
    return response;
  },

  listTestimonials: async () => {
    const response = await fetchApi('/content/testimonials');
    return response;
  },

  listLookbook: async () => {
    const response = await fetchApi('/content/lookbook');
    return response;
  },
};
