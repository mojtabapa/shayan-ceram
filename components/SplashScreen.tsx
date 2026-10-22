"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site.config";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // چک کن که آیا قبلاً توی این نشست (session) نمایش داده شده
    const hasShown = sessionStorage.getItem("shayan-splash-shown");

    if (hasShown) {
      setShowSplash(false);
      return;
    }

    // بعد از ۱.۵ ثانیه، شروع به محو شدن کن
    const fadeTimer = setTimeout(() => setFadeOut(true), siteConfig.splashDuration - 500);

    // بعد از ۲ ثانیه، کلاً حذفش کن
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("shayan-splash-shown", "true");
    }, siteConfig.splashDuration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // برای جلوگیری از hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-secondary-dark" />;
  }

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-secondary-dark via-secondary to-primary-dark transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* ذرات تزئینی پس‌زمینه */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />
          </div>

          {/* محتوای وسط */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-6">
            {/* لوگو با انیمیشن */}
            <div className="animate-logo-reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logoPath}
                alt={siteConfig.brandName}
                className="h-32 w-auto drop-shadow-2xl md:h-40 animate-logo-glow"
              />
            </div>

            {/* اسم برند */}
            <div className="text-center animate-fade-up">
              <h1 className="text-2xl font-bold text-white md:text-4xl">
                {siteConfig.brandName}
              </h1>
              <p className="mt-2 text-sm text-white/70 md:text-base">
                {siteConfig.slogan}
              </p>
            </div>

            {/* لودر */}
            <div className="mt-4 flex gap-2 animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      {/* محتوای اصلی */}
      <div className={showSplash ? "invisible" : "visible"}>
        {children}
      </div>
    </>
  );
}