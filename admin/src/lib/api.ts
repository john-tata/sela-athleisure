const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function request(method: string, endpoint: string, body?: any) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({ message: 'Request failed' }));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: (endpoint: string) => request('GET', endpoint),
  post: (endpoint: string, body?: any) => request('POST', endpoint, body),
  patch: (endpoint: string, body?: any) => request('PATCH', endpoint, body),
  delete: (endpoint: string) => request('DELETE', endpoint),
};

// === Products ===
export const productApi = {
  list: () => api.get('/products'),
  get: (slug: string) => api.get(`/products/${slug}`),
  create: (data: any) => api.post('/products', data),
  update: (slug: string, data: any) => api.patch(`/products/${slug}`, data),
  delete: (slug: string) => api.delete(`/products/${slug}`),
};

// === Categories ===
export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// === Orders ===
export const orderApi = {
  list: () => api.get('/orders'),
  get: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

// === Content ===
export const contentApi = {
};

  export const uploadApi = {
  image: async (file: File, folder = 'products') => {
    const token = localStorage.getItem('admin_token');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const res = await fetch(`${API_URL}/uploads/image`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.data;
  },

  images: async (files: File[], folder = 'products') => {
    const token = localStorage.getItem('admin_token');

    const formData = new FormData();

    files.forEach(file => {
      formData.append('images', file);
    });

    formData.append('folder', folder);

    const res = await fetch(`${API_URL}/uploads/images`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data.data;
  },

  // Hero Slides
  listSlides: () => api.get('/content/hero-slides'),
  createSlide: (data: any) => api.post('/content/hero-slides', data),
  updateSlide: (id: string, data: any) => api.patch(`/content/hero-slides/${id}`, data),
  deleteSlide: (id: string) => api.delete(`/content/hero-slides/${id}`),

  // Testimonials
  listTestimonials: () => api.get('/content/testimonials'),
  createTestimonial: (data: any) => api.post('/content/testimonials', data),
  updateTestimonial: (id: string, data: any) => api.patch(`/content/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/content/testimonials/${id}`),

  // Lookbook
  listLookbook: () => api.get('/content/lookbook'),
  createLookbook: (data: any) => api.post('/content/lookbook', data),
  updateLookbook: (id: string, data: any) => api.patch(`/content/lookbook/${id}`, data),
  deleteLookbook: (id: string) => api.delete(`/content/lookbook/${id}`),
};
