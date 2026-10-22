"use client";

import { useState } from "react";

interface ProductGalleryProps {
  imageUrl: string;
  aiLayoutImageUrl?: string | null;
  liveImageUrl?: string | null;
  name: string;
}

export default function ProductGallery({ imageUrl, aiLayoutImageUrl, liveImageUrl, name }: ProductGalleryProps) {
  const images = [
    { url: imageUrl, label: "کاتالوگ" },
    ...(aiLayoutImageUrl ? [{ url: aiLayoutImageUrl, label: "چیدمان (AI)" }] : []),
    ...(liveImageUrl ? [{ url: liveImageUrl, label: "زنده" }] : []),
  ];

  const [selectedImage, setSelectedImage] = useState(images[0].url);
  const [isZoomed, setIsZoomed] = useState(false);

  const isLogoImage = selectedImage.includes("logo");

  return (
    <div className="space-y-3">
      <div
        className={`relative aspect-square overflow-hidden rounded-2xl bg-white shadow-card ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {isLogoImage ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark p-8">
            <img src={selectedImage} alt={name} className={`h-3/4 w-auto object-contain transition-transform duration-500 ${isZoomed ? "scale-150" : "scale-100"}`} />
          </div>
        ) : (
          <img src={selectedImage} alt={name} className={`h-full w-full object-cover transition-transform duration-500 ${isZoomed ? "scale-150" : "scale-100"}`} />
        )}

        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
          🔍 برای بزرگ‌نمایی کلیک کنید
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img.url)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImage === img.url ? "border-primary" : "border-gray-200"}`}
            >
              <img src={img.url} alt={`${name} - ${i + 1}`} className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[10px] text-white">{img.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}