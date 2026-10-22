import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export default function About() {
  return (
    <section className="bg-secondary-dark py-12 text-white md:py-20">
      <div className="container-custom">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* سمت راست - محتوا */}
          <div className="text-center md:text-right">
            <div className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold text-accent md:text-sm">
              درباره ما
            </div>
            <h2 className="mb-4 text-2xl font-black leading-tight md:text-3xl lg:text-4xl">
              کارخانه{" "}
              <span className="bg-gradient-to-l from-primary via-accent to-primary bg-clip-text text-transparent">
                {siteConfig.brandName}
              </span>
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-white/80 md:text-base">
              کارخانه کاشی و سرامیک شایان میبد، با بیش از ۱۵ سال تجربه در صنعت
              کاشی و سرامیک، یکی از تولیدکنندگان برتر در استان یزد و شهرک صنعتی
              جهان‌آباد میبد است.
            </p>
            <p className="mb-6 text-sm leading-relaxed text-white/80 md:text-base">
              ما با بهره‌گیری از مدرن‌ترین تکنولوژی روز دنیا و تیمی مجرب،
              محصولاتی با کیفیت برتر و قیمت مناسب تولید می‌کنیم و محصولات خود را
              به سراسر کشور ارسال می‌کنیم.
            </p>

            {/* آمار */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-black text-accent md:text-3xl">+۱۵</div>
                <div className="text-xs text-white/70 md:text-sm">سال تجربه</div>
              </div>
              <div>
                <div className="text-2xl font-black text-accent md:text-3xl">+۵۰</div>
                <div className="text-xs text-white/70 md:text-sm">نماینده فعال</div>
              </div>
              <div>
                <div className="text-2xl font-black text-accent md:text-3xl">+۱۰۰۰</div>
                <div className="text-xs text-white/70 md:text-sm">محصول متنوع</div>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 md:text-base"
            >
              <span>بیشتر بدانید</span>
              <span>←</span>
            </Link>
          </div>

          {/* سمت چپ - لوگو */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* دایره‌های نور */}
              <div className="absolute inset-0 animate-pulse-slow rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute -inset-8 animate-pulse-slow rounded-full bg-accent/20 blur-3xl" />
              {/* لوگو */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logoPath}
                alt={siteConfig.brandName}
                className="relative h-48 w-auto drop-shadow-2xl md:h-64 lg:h-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}