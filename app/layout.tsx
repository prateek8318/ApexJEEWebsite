import "./globals.css";
import { cn } from "@lib/utils";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import QueryProvider from "@providers/QueryProvider";
import ToastProvider from "@providers/ToastProvider";
import { Poppins as FontSans } from "next/font/google";
import { unstable_noStore as noStore } from "next/cache";
import { APP_DESCRIPTION, APP_NAME, PRIMARY_COLOR } from "@data";

const fontSans = FontSans({
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    startupImage: { url: "/logo.png" },
    statusBarStyle: "default",
  },
  applicationName: APP_NAME,
  description: APP_DESCRIPTION,
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  icons: {
    apple: [
      "/icons/icon-192x192.png",
      "/icons/icon-256x256.png",
      "/icons/icon-384x384.png",
      "/icons/icon-512x512.png",
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL as string),
  openGraph: {
    description: APP_DESCRIPTION,
    images: [
      {
        alt: `${APP_NAME} logo`,
        url: "/logo.png",
      },
    ],
    title: APP_NAME,
    type: "website",
    url: process.env.NEXT_PUBLIC_URL,
  },
  title: APP_NAME,
};

const RootLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  noStore();
  const nonce = (await headers()).get("x-nonce") as string;

  return (
    <html lang="en">
      <meta content={PRIMARY_COLOR} name="theme-color" nonce={nonce} />
      <body className={cn("relative font-sans antialiased", fontSans.variable)}>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
