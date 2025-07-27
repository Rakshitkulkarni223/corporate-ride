import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // Only run in browser environment
      if (typeof window !== 'undefined') {
        // Get token from localStorage
        const authData = localStorage.getItem('auth');
        if (authData) {
          const { token } = JSON.parse(authData);
          
          // Add authorization header if token exists
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
      return config;
    } catch (error) {
      console.error('Error in axios interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
