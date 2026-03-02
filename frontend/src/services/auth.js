import api from './api';

export const authService = {
  async signUp(email, password, fullName) {
    const response = await api.post('/auth/signup', {
      email,
      password,
      fullName,
    });
    return response.data;
  },

  async signIn(email, password) {
    const response = await api.post('/auth/signin', {
      email,
      password,
    });
    return response.data;
  },

  async signOut() {
    const response = await api.post('/auth/signout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async resetPassword(email) {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },

  getAuthToken() {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated() {
    return !!this.getAuthToken();
  },
};
