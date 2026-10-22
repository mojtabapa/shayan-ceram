"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site.config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* ============ نوار بالایی (دسکتاپ) ============ */}
      <div className="hidden bg-secondary-dark text-white lg:block">
        <div className="container-custom flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="text-accent">📍</span>
              <span className="opacity-90">{siteConfig.addressShort}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-accent">📞</span>
              <a href={`tel:${siteConfig.contactPhone1}`} className="hover:text-accent transition-colors">
                {siteConfig.contactPhone1}
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="text-accent">✓</span>
              <span className="opacity-90">ارسال به سراسر کشور</span>
            </span>
          </div>
        </div>
      </div>

      {/* ============ هدر اصلی ============ */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container-custom flex items-center justify-between gap-3 py-3 md:py-4">
          
          {/* لوگو و اسم برند */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.logoPath}
              alt={siteConfig.brandName}
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 md:h-14"
            />
            <div className="hidden sm:block">
              <div className="text-base font-bold text-secondary md:text-lg leading-tight">
                {siteConfig.brandNameShort}
              </div>
              <div className="text-xs text-muted leading-tight">{siteConfig.slogan}</div>
            </div>
          </Link>

          {/* دکمه‌های ورود/پنل (دسکتاپ) */}
          <div className="hidden items-center gap-2 md:flex">
            {session ? (
              <Link
                href="/panel"
                className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-secondary-light hover:shadow-lg"
              >
                <span>👤</span>
                <span>پنل کاربری</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-xl border-2 border-secondary px-4 py-2.5 text-sm font-bold text-secondary transition-all hover:bg-secondary hover:text-white"
                >
                  <span>👤</span>
                  <span>ورود</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg"
                >
                  <span>✨</span>
                  <span>ثبت‌نام نماینده</span>
                </Link>
              </>
            )}
          </div>

          {/* دکمه‌های موبایل */}
          <div className="flex items-center gap-2 md:hidden">
            {session && (
              <Link
                href="/panel"
                className="rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-white"
              >
                پنل
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border-2 border-gray-200 p-2 transition-colors hover:border-primary"
              aria-label="منو"
            >
              <span className="text-lg">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white md:hidden">
            <div className="container-custom flex flex-col gap-1 py-3">
              <Link href="/" className="rounded-lg p-3 text-sm font-medium text-secondary transition-colors hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                🏠 خانه
              </Link>
              <Link href="/catalog" className="rounded-lg p-3 text-sm font-medium text-secondary transition-colors hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                🛍️ محصولات
              </Link>
              <Link href="/about" className="rounded-lg p-3 text-sm font-medium text-secondary transition-colors hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                درباره ما
              </Link>
              <Link href="/contact" className="rounded-lg p-3 text-sm font-medium text-secondary transition-colors hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                تماس با ما
              </Link>
              {!session && (
                <>
                  <Link href="/login" className="mt-2 rounded-lg border-2 border-secondary p-3 text-center text-sm font-bold text-secondary" onClick={() => setMobileMenuOpen(false)}>
                    👤 ورود
                  </Link>
                  <Link href="/register" className="rounded-lg bg-primary p-3 text-center text-sm font-bold text-white" onClick={() => setMobileMenuOpen(false)}>
                    ✨ ثبت‌نام نماینده
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}