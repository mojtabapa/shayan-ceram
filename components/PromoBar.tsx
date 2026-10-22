"use client";

import { siteConfig } from "@/config/site.config";

export default function PromoBar() {
  const messages = [
    "🔥 فروش فوق‌العاده کاشی و سرامیک شایان میبد",
    "🎁 تخفیف ویژه روی محصولات منتخب",
    "🚚 ارسال به سراسر کشور",
    "📞 مشاوره رایگان: " + siteConfig.contactMobileDisplay,
    "🏆 کیفیت برتر، هنر ماندگار",
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-l from-primary via-primary-dark to-secondary py-2.5 text-white">
      {/* انیمیشن متحرک */}
      <div className="flex animate-marquee whitespace-nowrap">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="mx-8 inline-flex items-center text-sm font-medium md:text-base">
            {msg}
            <span className="mx-8 text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}