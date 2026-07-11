import axios from 'axios';

// Example configuration for your frontend's axiosInstance

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Intercept all outgoing requests and attach the Bearer token dynamically
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = null;

    if (typeof window !== 'undefined') {
      // Client-Side: Extract token from document.cookie
      const match = document.cookie.match(new RegExp('(^| )echonav_token=([^;]+)'));
      if (match) token = match[2];
    } else {
      // Server-Side (Next.js 16 SSR context)
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('echonav_token')?.value;
      } catch (error) {
        // Ignore if cookies() is not available in the current server context
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);