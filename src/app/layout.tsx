import "@/styles/globals.css";

import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { NextAuthProvider } from "@/server/provider/nextAuthProvider";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieBanner from "@/components/cookieBanner";

export const metadata: Metadata = {
  title: "AI Icon and Logo Generator",
  description:
    "Generate the best looking logos and icons for your business and social media accounts.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <Suspense fallback={<div>Loading search results...</div>}>
        <GoogleAnalytics GA_MEASUREMENT_ID="G-G1G7M329V0" />
      </Suspense>
      <body>
        <NextAuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <CookieBanner />
        </NextAuthProvider>
      </body>
    </html>
  );
}
