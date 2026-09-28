import api from './client';

export const authApi = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  getMe: async () => {
    return api.get('/auth/me');
  },
};

export default authApi;
