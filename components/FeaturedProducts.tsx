import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { activePct } from "@/lib/pricing";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { published: true },
    take: 8,
  });

  if (products.length === 0) {
    return (
      <section className="container-custom py-12 md:py-16">
        <div className="text-center">
          <h2 className="section-title">محصولات ویژه</h2>
          <p className="section-subtitle">
            به‌زودی محصولات اینجا نمایش داده می‌شن
          </p>
        </div>
      </section>
    );
  }

  // جدا کردن محصولات تخفیف‌دار و معمولی
  const discounted = products.filter((p) => activePct(p) > 0);
  const regular = products.filter((p) => activePct(p) === 0);
  const allProducts = [...discounted, ...regular];

  return (
    <section className="container-custom py-12 md:py-16">
      {/* ============ عنوان بخش ============ */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:mb-10 md:flex-row">
        <div className="text-center md:text-right">
          <h2 className="text-2xl font-black text-secondary md:text-3xl">
            🛍️ محصولات ویژه
          </h2>
          <p className="mt-1 text-sm text-muted md:text-base">
            جدیدترین و محبوب‌ترین محصولات کاشی شایان میبد
          </p>
        </div>
        <Link
          href="/catalog"
          className="group inline-flex items-center gap-2 rounded-xl border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white md:px-5 md:py-2.5"
        >
          <span>مشاهده همه</span>
          <span className="transition-transform group-hover:-translate-x-1">←</span>
        </Link>
      </div>

      {/* ============ شبکه محصولات ============ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}