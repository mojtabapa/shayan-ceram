import Link from "next/link";
import { siteConfig } from "@/config/site.config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "خانه" },
    { href: "/catalog", label: "محصولات" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/register", label: "ثبت‌نام نماینده" },
  ];

  const categories = [
    { href: "/catalog?category=ceramic", label: "سرامیک" },
    { href: "/catalog?category=porcelain", label: "پرسلان" },
    { href: "/catalog?category=tile", label: "کاشی" },
    { href: "/catalog?category=floor", label: "کاشی کف" },
    { href: "/catalog?category=wall", label: "کاشی دیواری" },
  ];

  return (
    <footer className="bg-secondary-dark text-white">
      {/* ============ بخش اصلی فوتر ============ */}
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* برند */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logoPath}
                alt={siteConfig.brandName}
                className="h-12 w-auto"
              />
              <div>
                <div className="text-base font-bold">{siteConfig.brandNameShort}</div>
                <div className="text-xs text-white/60">{siteConfig.brandNameEn}</div>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-white/70">
              تولیدکننده کاشی و سرامیک با کیفیت برتر در شهرک صنعتی جهان‌آباد
              میبد. با بیش از ۱۵ سال تجربه در صنعت کاشی.
            </p>
            {/* شبکه‌های اجتماعی */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/98${siteConfig.whatsapp.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-green-500"
                aria-label="واتساپ"
              >
                💬
              </a>
              <a
                href={`tel:${siteConfig.contactMobile}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-primary"
                aria-label="تماس"
              >
                📞
              </a>
            </div>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="mb-4 text-base font-bold text-accent">لینک‌های سریع</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    <span className="text-xs">◄</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* دسته‌بندی محصولات */}
          <div>
            <h3 className="mb-4 text-base font-bold text-accent">دسته‌بندی محصولات</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    <span className="text-xs">◄</span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h3 className="mb-4 text-base font-bold text-accent">اطلاعات تماس</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-accent">📍</span>
                <span className="leading-relaxed">{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">☎️</span>
                <a
                  href={`tel:${siteConfig.contactPhone1}`}
                  className="hover:text-accent"
                  dir="ltr"
                >
                  {siteConfig.contactPhone1}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">☎️</span>
                <a
                  href={`tel:${siteConfig.contactPhone2}`}
                  className="hover:text-accent"
                  dir="ltr"
                >
                  {siteConfig.contactPhone2}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">📱</span>
                <a
                  href={`tel:${siteConfig.contactMobile}`}
                  className="hover:text-accent"
                  dir="ltr"
                >
                  {siteConfig.contactMobileDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============ کپی‌رایت ============ */}
      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-white/60 md:flex-row md:text-sm">
          <div>
            © {currentYear.toLocaleString("fa-IR")} تمامی حقوق برای{" "}
            <span className="font-bold text-white">{siteConfig.brandName}</span> محفوظ است.
          </div>
          <div className="flex items-center gap-1">
            <span>ساخته شده با</span>
            <span className="text-primary">❤️</span>
            <span>در ایران</span>
          </div>
        </div>
      </div>
    </footer>
  );
}