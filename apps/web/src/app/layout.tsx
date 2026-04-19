import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import { StructuredData } from "./structured-data";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
});

const body = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://subtracker-web-six.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "SubTracker — Your subscriptions, under control.",
    template: "%s · SubTracker",
  },
  description:
    "Open-source subscription tracker. Import CSV from Fio, Revolut, or Wise. See every renewal before it hits. Self-hostable. Free forever. AGPL-3.0.",
  keywords: [
    "subscription tracker",
    "subscription manager",
    "self-hosted",
    "open source",
    "recurring payments",
    "personal finance",
    "CSV bank import",
    "Fio Banka",
    "Revolut",
    "Wise",
    "Wallos alternative",
    "homelab",
    "selfhosted",
    "Next.js",
    "React",
    "privacy",
    "AGPL",
  ],
  authors: [{ name: "Michal Burget", url: "https://github.com/Buggy1111" }],
  creator: "Michal Burget",
  publisher: "Michal Burget",
  category: "Finance",
  applicationName: "SubTracker",
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "SubTracker",
    title: "SubTracker — Your subscriptions, under control.",
    description:
      "Open-source subscription tracker. Import CSV from Fio, Revolut, or Wise. See every renewal before it hits. Self-hostable. Free forever.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SubTracker — Your subscriptions, under control. Dashboard preview with $142.50 monthly spend, upcoming renewals and live stats.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SubTracker — Your subscriptions, under control.",
    description:
      "Open-source subscription tracker. CSV bank import, renewal calendar, self-hostable. Free forever.",
    images: ["/og-image.png"],
    creator: "@buggy1111",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SubTracker",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <StructuredData />
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
