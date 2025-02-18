import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: '',
    userName: '',
  }),

  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('http://127.0.0.1:8081/api/login', { email, password });

        if (response.data.status) {
          this.isLoggedIn = true;
          this.user = response.data.user;
          this.token = response.data.token;
          this.userName = response.data.user.name;

          // Store in localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userName', this.userName);

          // Set global authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        throw error;
      }
    },

    async logout() {
      try {
        await axios.post('http://127.0.0.1:8081/api/logout');

        this.isLoggedIn = false;
        this.user = null;
        this.token = '';
        this.userName = '';

        // Clear localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');

        delete axios.defaults.headers.common['Authorization'];
      } catch (error) {
        console.error("Logout error:", error.response?.data?.message || error.message);
      }
    },

    checkAuth() {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      const storedUserName = localStorage.getItem('userName');

      if (token && storedUser) {
        this.isLoggedIn = true;
        this.user = JSON.parse(storedUser);
        this.token = token;
        this.userName = storedUserName;

        // Ensure axios has the token for API requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        this.isLoggedIn = false;
        this.user = null;
        this.token = '';
        this.userName = '';
      }
    }
  },
});
