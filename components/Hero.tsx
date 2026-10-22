"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export default function Hero() {
  return (
    <section className="relative min-h-[450px] md:min-h-[500px] lg:min-h-[550px] overflow-hidden bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark">
      
      {/* ============ پس‌زمینه متحرک ============ */}
      <div className="absolute inset-0 overflow-hidden">
        {/* دایره‌های نور */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
        
        {/* الگوی کاشی‌های شناور */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)`,
              backgroundSize: "60px 60px",
              backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
            }}
          />
        </div>
      </div>

      {/* ============ محتوای وسط ============ */}
      <div className="container-custom relative z-10 flex min-h-[450px] flex-col items-center justify-center py-10 text-center md:min-h-[500px] md:py-12 lg:min-h-[550px]">
        
        {/* لوگو */}
        <div className="mb-5 animate-fade-up">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logoPath}
            alt={siteConfig.brandName}
            className="mx-auto h-20 w-auto drop-shadow-2xl md:h-24"
          />
        </div>

        {/* عنوان اصلی */}
        <h1 className="animate-fade-up text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
          سامانه هوشمند
          <br />
          <span className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
            {siteConfig.brandName}
          </span>
        </h1>

        {/* شعار */}
        <p className="mt-4 max-w-2xl animate-fade-up text-sm text-white/80 md:text-base lg:text-lg">
          {siteConfig.slogan} — تجربه‌ای متفاوت از خرید کاشی و سرامیک با کیفیت برتر
        </p>

        {/* دکمه‌ها */}
        <div className="mt-7 flex flex-col items-center gap-3 animate-fade-up sm:flex-row md:gap-4">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-base font-bold text-white shadow-2xl transition-all duration-300 hover:bg-primary-dark hover:shadow-glow hover:-translate-y-1 md:text-lg"
          >
            <span>🛍️</span>
            <span>مشاهده محصولات</span>
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:border-white/60 md:text-lg"
          >
            <span>✨</span>
            <span>ثبت‌نام نماینده</span>
          </Link>
        </div>

        {/* ویژگی‌های کوچیک زیر دکمه‌ها */}
        <div className="mt-7 grid grid-cols-3 gap-4 text-center md:gap-8 animate-fade-in">
          <div>
            <div className="text-xl font-bold text-accent md:text-2xl">+۱۵</div>
            <div className="text-xs text-white/70 md:text-sm">سال تجربه</div>
          </div>
          <div>
            <div className="text-xl font-bold text-accent md:text-2xl">+۵۰</div>
            <div className="text-xs text-white/70 md:text-sm">نماینده فعال</div>
          </div>
          <div>
            <div className="text-xl font-bold text-accent md:text-2xl">+۱۰۰۰</div>
            <div className="text-xs text-white/70 md:text-sm">محصول متنوع</div>
          </div>
        </div>
      </div>

      {/* ============ فلش پایین (اسکرول) ============ */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="text-white/50">
          <span className="text-xl">⌄</span>
        </div>
      </div>
    </section>
  );
}