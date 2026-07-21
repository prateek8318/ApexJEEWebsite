// // import { NextConfig } from "next";

// // /** @type {import('next').NextConfig} */
// // const nextConfig: NextConfig = {
// //   images: {
// //     dangerouslyAllowLocalIP: true,
// //     remotePatterns: [
// //       { hostname: "flagcdn.com", pathname: "**", protocol: "https" },
// //       {
// //         hostname: "minio-api-dev.baseel.com",
// //         pathname: "**",
// //         protocol: "https",
// //       },
// //       {
// //         hostname: "minio-api-uat.baseel.com",
// //         pathname: "**",
// //         protocol: "https",
// //       },
// //       { hostname: "minio-api.baseel.com", pathname: "**", protocol: "https" },
// //       { hostname: "ui-avatars.com", pathname: "**", protocol: "https" },
// //     ],
// //   },
// //   logging: {
// //     fetches: {
// //       fullUrl: true,
// //     },
// //   },
// //   reactStrictMode: true,
// //   async headers() {
// //     return [
// //       {
// //         source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
// //         headers: [
// //           {
// //             key: "Permissions-Policy",
// //             value: "camera=(), geolocation=(), microphone=()",
// //           },
// //           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
// //           {
// //             key: "Strict-Transport-Security",
// //             value: "max-age=63072000; includeSubDomains; preload",
// //           },
// //           { key: "X-Content-Type-Options", value: "nosniff" },
// //           { key: "X-Frame-Options", value: "DENY" },
// //           { key: "X-XSS-Protection", value: "1; mode=block" },
// //           { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
// //           { key: "Cache-Control", value: "no-store, max-age=0, no-cache" },
// //           { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
// //         ],
// //       },
// //     ];
// //   },
// // };

// // export default nextConfig;





// import { NextConfig } from "next";

// /** @type {import('next').NextConfig} */
// const nextConfig: NextConfig = {
//   images: {
//     dangerouslyAllowLocalIP: true,
//     remotePatterns: [
//       { hostname: "flagcdn.com", pathname: "**", protocol: "https" },
//       {
//         hostname: "minio-api-dev.baseel.com",
//         pathname: "**",
//         protocol: "https",
//       },
//       {
//         hostname: "minio-api-uat.baseel.com",
//         pathname: "**",
//         protocol: "https",
//       },
//       { hostname: "minio-api.baseel.com", pathname: "**", protocol: "https" },
//       { hostname: "ui-avatars.com", pathname: "**", protocol: "https" },
//     ],
//   },
//   logging: {
//     fetches: {
//       fullUrl: true,
//     },
//   },
//   reactStrictMode: true,
//   async headers() {
//     return [
//       {
//         source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
//         headers: [
//           {
//             key: "Permissions-Policy",
//             value: "camera=(), geolocation=(), microphone=()",
//           },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

//           /* 🔴 बदलाव 1: IP + HTTP पर चलाने के लिए Strict-Transport-Security (HSTS) को कमेंट/हटा दिया गया है */
//           // {
//           //   key: "Strict-Transport-Security",
//           //   value: "max-age=63072000; includeSubDomains; preload",
//           // },

//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "X-Frame-Options", value: "DENY" },
//           { key: "X-XSS-Protection", value: "1; mode=block" },
//           { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
//           { key: "Cache-Control", value: "no-store, max-age=0, no-cache" },

//           /* 🔴 बदलाव 2: HTTP असुरक्षित ओरिजिन एरर से बचने के लिए इसे 'same-origin-allow-popups' किया या हटाया जा सकता है */
//           { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;











import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { hostname: "flagcdn.com", pathname: "**", protocol: "https" },
      {
        hostname: "minio-api-dev.baseel.com",
        pathname: "**",
        protocol: "https",
      },
      {
        hostname: "minio-api-uat.baseel.com",
        pathname: "**",
        protocol: "https",
      },
      { hostname: "minio-api.baseel.com", pathname: "**", protocol: "https" },
      { hostname: "ui-avatars.com", pathname: "**", protocol: "https" },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          /* ✅ HSTS को हटाया गया (ताकि HTTP पर CSS/Fonts न फटे) */
          // {
          //   key: "Strict-Transport-Security",
          //   value: "max-age=63072000; includeSubDomains; preload",
          // },

          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Cache-Control", value: "no-store, max-age=0, no-cache" },

          /* ✅ COOP हेडर को पूरी तरह हटा दिया गया है ताकि ब्राउज़र IP एड्रेस पर CSS/JS ब्लॉक न करे */
          // { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;