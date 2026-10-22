"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site.config";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "خطایی رخ داد");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bglight p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl">✅</div>
          <h2 className="mb-2 text-2xl font-black text-secondary">ثبت‌نام موفق!</h2>
          <p className="mb-6 text-sm text-muted">
            حساب شما ساخته شد. در حال انتقال به صفحه ورود...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bglight">
      {/* سمت راست - فرم */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoPath} alt={siteConfig.brandName} className="h-16 w-auto" />
            <div className="text-right">
              <div className="text-lg font-bold text-secondary">{siteConfig.brandNameShort}</div>
              <div className="text-xs text-muted">{siteConfig.slogan}</div>
            </div>
          </Link>

          <h1 className="mb-2 text-2xl font-black text-secondary md:text-3xl">ثبت‌نام نماینده</h1>
          <p className="mb-8 text-sm text-muted">برای همکاری با ما، فرم زیر را پر کنید</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-secondary">نام و نام خانوادگی</label>
                <input name="name" required placeholder="مثلاً: علی رضایی" className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-secondary">شماره موبایل</label>
                <input name="phone" type="tel" required placeholder="09123456789" className="input-field text-left" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-secondary">نام فروشگاه / شرکت</label>
              <input name="company" required placeholder="نام فروشگاه شما" className="input-field" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-secondary">کد ملی</label>
              <input name="nationalId" required placeholder="۱۰ رقم" className="input-field text-left" dir="ltr" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-secondary">نام کاربری</label>
              <input name="username" required placeholder="برای ورود" className="input-field text-left" dir="ltr" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-secondary">رمز عبور</label>
              <input name="password" type="password" required placeholder="حداقل ۸ کاراکتر" className="input-field" dir="ltr" />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              ورود به سامانه
            </Link>
          </p>
        </div>
      </div>

      {/* سمت چپ - گرادیانت */}
      <div className="hidden w-1/2 bg-gradient-to-br from-secondary-dark via-secondary to-primary-dark md:flex md:flex-col md:items-center md:justify-center md:p-12">
        <div className="text-center text-white">
          <div className="mb-6 text-6xl">🤝</div>
          <h2 className="text-3xl font-black">همکاری با کاشی شایان</h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            با ثبت‌نام در سامانه، به عنوان نماینده فروش، از تخفیف‌های ویژه و امکانات اختصاصی بهره‌مند شوید.
          </p>
        </div>
      </div>
    </div>
  );
}