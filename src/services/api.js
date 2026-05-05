import { api } from '../lib/api';

export const authApi = {
  profile: async () => {
    const res = await api.get('/users/profile');
    return { user: res.data.data };
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return { user: res.data.data };
  },
  register: async (credentials) => {
    const res = await api.post('/auth/register', credentials);
    return { user: res.data.data };
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  }
};

export const cryptoApi = {
  getAll: async () => {
    const res = await api.get('/crypto');
    return res.data;
  },
  getGainers: async () => {
    const res = await api.get('/crypto/gainers');
    return res.data;
  },
  getNew: async () => {
    const res = await api.get('/crypto/new');
    return res.data;
  },
  add: async (body) => {
    const res = await api.post('/crypto', body);
    return res.data;
  }
};
