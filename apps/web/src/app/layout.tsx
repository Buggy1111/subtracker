import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
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

export const metadata: Metadata = {
  title: "SubTracker — Know where your money goes",
  description:
    "Open-source subscription tracker. Import bank statements, get renewal alerts, cut waste. Privacy-first, self-hostable.",
  keywords: [
    "subscription tracker",
    "subscription manager",
    "recurring payments",
    "personal finance",
    "open source",
    "self-hosted",
  ],
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
