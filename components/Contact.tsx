import { siteConfig } from "@/config/site.config";

export default function Contact() {
  return (
    <section className="bg-bglight py-12 md:py-16">
      <div className="container-custom">
        {/* عنوان */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="text-2xl font-black text-secondary md:text-3xl lg:text-4xl">
            📞 تماس با ما
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted md:text-base">
            برای مشاوره، سفارش و پیگیری، ما آماده پاسخگویی هستیم
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* آدرس */}
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-2xl text-white shadow-lg">
              📍
            </div>
            <h3 className="mb-2 text-base font-bold text-secondary md:text-lg">
              آدرس کارخانه
            </h3>
            <p className="text-xs leading-relaxed text-muted md:text-sm">
              {siteConfig.address}
            </p>
          </div>

          {/* تلفن ثابت */}
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white shadow-lg">
              ☎️
            </div>
            <h3 className="mb-2 text-base font-bold text-secondary md:text-lg">
              تلفن ثابت
            </h3>
            <div className="space-y-1 text-xs md:text-sm">
              <a
                href={`tel:${siteConfig.contactPhone1}`}
                className="block text-primary hover:text-primary-dark"
                dir="ltr"
              >
                {siteConfig.contactPhone1}
              </a>
              <a
                href={`tel:${siteConfig.contactPhone2}`}
                className="block text-primary hover:text-primary-dark"
                dir="ltr"
              >
                {siteConfig.contactPhone2}
              </a>
            </div>
          </div>

          {/* موبایل */}
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-2xl text-white shadow-lg">
              📱
            </div>
            <h3 className="mb-2 text-base font-bold text-secondary md:text-lg">
              واحد فروش
            </h3>
            <a
              href={`tel:${siteConfig.contactMobile}`}
              className="text-sm font-bold text-primary hover:text-primary-dark md:text-base"
              dir="ltr"
            >
              {siteConfig.contactMobileDisplay}
            </a>
            <p className="mt-1 text-xs text-muted md:text-sm">
              واتساپ و تلگرام
            </p>
          </div>

          {/* واتساپ */}
          <div className="card text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl text-white shadow-lg">
              💬
            </div>
            <h3 className="mb-2 text-base font-bold text-secondary md:text-lg">
              واتساپ
            </h3>
            <a
              href={`https://wa.me/98${siteConfig.whatsapp.replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600 md:text-sm"
            >
              <span>ارسال پیام</span>
              <span>←</span>
            </a>
          </div>
        </div>

        {/* دکمه واتساپ شناور */}
        <div className="mt-8 text-center">
          <a
            href={`https://wa.me/98${siteConfig.whatsapp.replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-green-500 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-2xl transition-all hover:shadow-xl hover:-translate-y-1 md:text-lg"
          >
            <span>💬</span>
            <span>گفتگوی سریع در واتساپ</span>
          </a>
        </div>
      </div>
    </section>
  );
}