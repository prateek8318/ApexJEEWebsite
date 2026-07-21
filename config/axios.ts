// src/config/axios.ts
import Axios from "axios";

// Create an Axios instance with default settings.
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Interceptor to handle auth expiration (401) redirects.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.replace("/auth/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

// const axios = Axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error?.response?.status === 401) {
//       if (
//         typeof window !== "undefined" &&
//         !window.location.pathname.startsWith("/auth")
//       ) {
//         window.location.replace("/auth/login");
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export default axios;
