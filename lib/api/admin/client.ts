import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_URL || 'http://localhost:9070';

export const adminClient = axios.create({
  baseURL: `${baseURL}/api/admin`,
  withCredentials: true, // For cookies if applicable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token if you are storing it in localStorage or elsewhere
adminClient.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== "undefined") {
        const storage = localStorage.getItem("AuthSession");
        if (storage) {
          const { state } = JSON.parse(storage);
          if (state?.session?.token) {
            config.headers.Authorization = `Bearer ${state.session.token}`;
          }
        }
      }
    } catch (error) {
      console.error("Error reading token from local storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    return Promise.reject(error);
  }
);
