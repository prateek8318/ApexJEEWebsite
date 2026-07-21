// "use server";
// import { getAuthToken } from "./getAuthToken";
// import { getRefreshToken } from "./getRefreshToken";

// export const refreshAccessToken = async () => {
//   const authToken = await getAuthToken();
//   const refreshToken = await getRefreshToken();
//   try {
//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/renew-token`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         cookie: `AUTH_TOKEN=${authToken};REFRESH_TOKEN=${refreshToken}`,
//       },
//       credentials: "include",
//     });
//     console.info("Middleware: Refresh Auth Token - Auth token refreshed!");
//     return true;
//   } catch (error: unknown) {
//     console.info(
//       `Middleware: Refresh Auth Token - ${(error as Error)?.message ?? "Internal server error!"}`,
//     );
//     return false;
//   }
// };
