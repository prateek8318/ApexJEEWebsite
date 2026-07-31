import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_URL || 'http://localhost:9070';

export const userClient = axios.create({
  baseURL: `${baseURL}/api/user`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

userClient.interceptors.request.use(
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

userClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
