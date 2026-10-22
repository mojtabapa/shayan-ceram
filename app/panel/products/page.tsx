import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductsTable from "@/components/ProductsTable";

export default async function PanelProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { code: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-secondary md:text-3xl">
            📦 مدیریت محصولات
          </h1>
          <p className="mt-1 text-sm text-muted">
            لیست کامل محصولات، موجودی و قیمت‌ها
          </p>
        </div>
        <Link 
          href="/panel/products/new"
          className="rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:-translate-y-0.5"
        >
          + افزودن محصول جدید
        </Link>
      </div>

      {/* جدول محصولات (کامپوننت جدید) */}
      <ProductsTable products={products} />
    </div>
  );
}