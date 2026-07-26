import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Intercept all outgoing requests and attach the Bearer token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    // THE FIX: Strict Client-Side Cookie Parsing.
    // Removes the dynamic `next/headers` import that causes Webpack/SSR compilation crashes.
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )echonav_token=([^;]+)'));
      if (match) {
        config.headers.Authorization = `Bearer ${match[2]}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);