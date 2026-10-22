import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site.config";
import SplashScreen from "@/components/SplashScreen";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.brandName} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: `${siteConfig.brandName} — تولیدکننده کاشی و سرامیک با کیفیت برتر در ${siteConfig.addressShort}`,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: siteConfig.faviconPath,
    apple: "/images/icon-192.png",
  },
  openGraph: {
    title: siteConfig.brandName,
    description: siteConfig.slogan,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.primaryColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/images/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.brandNameShort} />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="font-vazir antialiased">
        <Providers>
          <SplashScreen>{children}</SplashScreen>
        </Providers>
      </body>
    </html>
  );
}