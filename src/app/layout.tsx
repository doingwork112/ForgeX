import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "ForgeX — The marketplace for ready-made apps",
    template: "%s | ForgeX",
  },
  description:
    "Browse finished apps built by developers. Try free demos, pay a 40% deposit, get your branded app in 24 hours. Or list your app and earn recurring revenue.",
  keywords: ["app marketplace", "buy app", "sell app", "PWA", "no-code", "startup app"],
  authors: [{ name: "ForgeX" }],
  creator: "ForgeX",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forgex.com",
    siteName: "ForgeX",
    title: "ForgeX — The marketplace for ready-made apps",
    description:
      "Try free demos, pay a 40% deposit, get your branded app in 24 hours. Developers earn recurring revenue.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ForgeX Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeX — The marketplace for ready-made apps",
    description: "Try free demos, pay a 40% deposit, get your branded app in 24 hours.",
    images: ["/og-image.png"],
    creator: "@forgexhq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans antialiased", inter.variable)}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
