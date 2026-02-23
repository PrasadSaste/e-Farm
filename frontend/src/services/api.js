import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('efarm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler
api.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('efarm_token');
      localStorage.removeItem('efarm_user');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

export const authAPI = {
  register:       data => api.post('/auth/register', data),
  login:          data => api.post('/auth/login', data),
  getMe:          ()   => api.get('/auth/me'),
  changePassword: data => api.put('/auth/change-password', data),
};

export const farmerAPI = {
  getAll:  params  => api.get('/farmers', { params }),
  getOne:  id      => api.get(`/farmers/${id}`),
  update:  (id, d) => api.put(`/farmers/${id}`, d),
  remove:  id      => api.delete(`/farmers/${id}`),
  verify:  id      => api.put(`/farmers/${id}/verify`),
};

export const cropAPI = {
  getAll:      ()      => api.get('/crops'),
  getOne:      id      => api.get(`/crops/${id}`),
  create:      data    => api.post('/crops', data),
  update:      (id, d) => api.put(`/crops/${id}`, d),
  remove:      id      => api.delete(`/crops/${id}`),
  getAdvisory: id      => api.get(`/crops/${id}/advisory`),
};

export const marketAPI = {
  getListings:       params   => api.get('/market/listings', { params }),
  createListing:     data     => api.post('/market/listings', data),
  updateListing:     (id, d)  => api.put(`/market/listings/${id}`, d),
  deleteListing:     id       => api.delete(`/market/listings/${id}`),
  createOrder:       data     => api.post('/market/orders', data),
  getOrders:         ()       => api.get('/market/orders'),
  updateOrderStatus: (id, st) => api.put(`/market/orders/${id}/status`, { status: st }),
  getPrices:         ()       => api.get('/market/prices'),
};

export const weatherAPI = {
  getForecast: params => api.get('/weather', { params }),
  getAlerts:   ()     => api.get('/weather/alerts'),
};

export const schemeAPI = {
  getAll:          ()        => api.get('/schemes'),
  checkEligibility:(id, d)   => api.post(`/schemes/${id}/check`, d),
  apply:           id        => api.post(`/schemes/${id}/apply`),
  myApplications:  ()        => api.get('/schemes/my-applications'),
};

export const adminAPI = {
  dashboard:         ()        => api.get('/admin/dashboard'),
  salesReport:       ()        => api.get('/admin/reports/sales'),
  cropReport:        ()        => api.get('/admin/reports/crops'),
  verifyFarmer:      id        => api.put(`/admin/farmers/${id}/verify`),
  createAlert:       data      => api.post('/admin/alerts', data),
  createScheme:      data      => api.post('/admin/schemes', data),
  updateApplication: (sid,aid,d) => api.put(`/admin/schemes/${sid}/applications/${aid}`, d),
};

export default api;
