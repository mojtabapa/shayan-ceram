export default function Features() {
  const features = [
    {
      icon: "🏆",
      title: "کیفیت برتر",
      description: "بیش از ۱۵ سال تجربه در تولید کاشی و سرامیک با استانداردهای جهانی",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: "🚚",
      title: "ارسال سریع",
      description: "ارسال به سراسر کشور با بسته‌بندی ایمن و بیمه‌شده",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: "💰",
      title: "قیمت مناسب",
      description: "قیمت مستقیم از کارخانه بدون واسطه، با تخفیف‌های ویژه",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: "🛡️",
      title: "ضمانت کیفیت",
      description: "ضمانت اصالت کالا و بازگشت وجه در صورت نارضایتی",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-bglight py-12 md:py-16">
      <div className="container-custom">
        {/* عنوان */}
        <div className="mb-10 text-center md:mb-12">
          <h2 className="text-2xl font-black text-secondary md:text-3xl lg:text-4xl">
            ⭐ چرا کاشی شایان؟
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted md:text-base">
            دلایلی که ما را از دیگران متمایز می‌کند
          </p>
        </div>

        {/* کارت‌های ویژگی */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white p-4 text-center shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 md:p-6"
            >
              {/* آیکون */}
              <div
                className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16 md:text-3xl`}
              >
                {feature.icon}
              </div>

              {/* عنوان */}
              <h3 className="mb-2 text-base font-bold text-secondary md:text-lg">
                {feature.title}
              </h3>

              {/* توضیحات */}
              <p className="text-xs leading-relaxed text-muted md:text-sm">
                {feature.description}
              </p>

              {/* خط تزئینی پایین */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-l from-primary to-accent transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}