import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.brandName,
    short_name: siteConfig.brandNameShort,
    description: siteConfig.slogan,
    start_url: "/",
    display: "standalone",
    dir: "rtl",
    lang: "fa",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: siteConfig.primaryColor,
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
  };
}