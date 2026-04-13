const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ═══ Public APIs ═══

export async function getProducts(category) {
  const params = category ? `?category=${category}` : '';
  return fetchAPI(`/products${params}`);
}

export async function getCategories() {
  return fetchAPI('/categories');
}

export async function getSettings() {
  return fetchAPI('/settings');
}

export async function createOrder(orderData) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

// ═══ Admin APIs ═══

export async function login(username, password) {
  const data = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('admin_token', data.token);
  return data;
}

export async function logout() {
  localStorage.removeItem('admin_token');
}

export async function getMe() {
  return fetchAPI('/auth/me');
}

export async function getAllProducts() {
  return fetchAPI('/products/all');
}

export async function createProduct(data) {
  return fetchAPI('/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(id, data) {
  return fetchAPI(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProduct(id) {
  return fetchAPI(`/products/${id}`, { method: 'DELETE' });
}

export async function createCategory(data) {
  return fetchAPI('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCategory(id, data) {
  return fetchAPI(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function updateSetting(key, value) {
  return fetchAPI(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
}

export async function updateSettings(settings) {
  return fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(settings) });
}

export async function getOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/orders?${query}`);
}

export async function updateOrderStatus(id, status) {
  return fetchAPI(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

export async function getStatsOverview() {
  return fetchAPI('/stats/overview');
}

export async function getRevenue(period, date) {
  const params = new URLSearchParams({ period, date }).toString();
  return fetchAPI(`/stats/revenue?${params}`);
}

export async function getTopProducts(limit = 10) {
  return fetchAPI(`/stats/top-products?limit=${limit}`);
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
