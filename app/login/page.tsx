"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { siteConfig } from "@/config/site.config";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false, // این خیلی مهمه! نمی‌ذاریم خودش ریدایرکت کنه
      });

      if (res?.error) {
        // اگه خطا داد، پیام رو نشون بده (نه اینکه بره صفحه 404)
        setError("نام کاربری یا رمز عبور اشتباه است");
      } else {
        // اگه موفق بود، برو به پنل
        router.push("/panel");
        router.refresh();
      }
    } catch (err) {
      setError("خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bglight">
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.logoPath}
              alt={siteConfig.brandName}
              className="h-16 w-auto"
            />
            <div className="text-right">
              <div className="text-lg font-bold text-secondary">
                {siteConfig.brandNameShort}
              </div>
              <div className="text-xs text-muted">{siteConfig.slogan}</div>
            </div>
          </Link>

          <h1 className="mb-2 text-2xl font-black text-secondary md:text-3xl">
            ورود به سامانه
          </h1>
          <p className="mb-8 text-sm text-muted">
            برای دسترسی به پنل کاربری، وارد شوید
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-bold text-secondary">
                نام کاربری
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="نام کاربری خود را وارد کنید"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-secondary">
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              {loading ? "در حال ورود..." : "ورود به سامانه"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            هنوز ثبت‌نام نکرده‌اید؟{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              ثبت‌نام نماینده
            </Link>
          </p>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-muted hover:text-primary">
              ← بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden w-1/2 bg-secondary-dark md:flex md:flex-col md:items-center md:justify-center md:p-12">
        <div className="text-center text-white">
          <div className="mb-6 text-6xl">🔒</div>
          <h2 className="text-3xl font-black">پنل مدیریت شایان</h2>
          <p className="mt-4 text-white/60">
            سیستم مدیریت فروش، انبار و مالی کاشی شایان میبد
          </p>
        </div>
      </div>
    </div>
  );
}