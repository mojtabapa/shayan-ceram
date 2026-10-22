import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { activePct, finalPrice, getTotalStock } from "@/lib/pricing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) notFound();

  const pct = activePct(product);
  const final = finalPrice(product.price, pct);
  const totalStock = getTotalStock(product.stock);

  const stockObj = typeof product.stock === "object" && product.stock !== null ? product.stock : {};
  const gradeEntries = Object.entries(stockObj).map(([grade, count]) => ({
    grade,
    count: Number(count) || 0,
  }));

  const similar = await prisma.product.findMany({
    where: { published: true, id: { not: product.id } },
    take: 4,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bglight py-6 md:py-10">
        <div className="container-custom">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted md:text-sm">
            <Link href="/" className="hover:text-primary">خانه</Link>
            <span>◄</span>
            <Link href="/catalog" className="hover:text-primary">محصولات</Link>
            <span>◄</span>
            <span className="text-secondary">{product.name}</span>
          </nav>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery 
                imageUrl={product.imageUrl} 
                aiLayoutImageUrl={product.aiLayoutImageUrl}
                liveImageUrl={product.liveImageUrl}
                name={product.name} 
              />
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-2 text-xs text-muted md:text-sm">
                  کد محصول: <span className="font-bold text-secondary">{product.code}</span>
                </div>
                <h1 className="mb-3 text-2xl font-black leading-tight text-secondary md:text-3xl lg:text-4xl">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-muted shadow-sm">
                    📐 سایز {product.size}
                  </span>
                  {totalStock > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 font-bold text-green-700">✅ موجود در انبار</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 font-bold text-red-700">❌ ناموجود</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-sm">
                {pct > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-primary px-2.5 py-1 text-sm font-bold text-white">{pct.toLocaleString("fa-IR")}٪ تخفیف</span>
                      <span className="text-sm text-muted line-through">{product.price.toLocaleString("fa-IR")} تومان</span>
                    </div>
                    <div className="text-3xl font-black text-primary">
                      {final.toLocaleString("fa-IR")}
                      <span className="mr-2 text-base font-normal text-muted">تومان</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-black text-secondary">
                    {product.price.toLocaleString("fa-IR")}
                    <span className="mr-2 text-base font-normal text-muted">تومان</span>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border-2 border-primary/20 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-secondary md:text-lg flex items-center gap-2">
                  <span>🛒</span><span>ثبت سفارش</span>
                </h3>
                <OrderForm 
                  productId={product.id} 
                  stock={product.stock} 
                  price={product.price}
                  discountPercent={product.discountPercent}
                  grade2Discount={product.grade2Discount}
                  grade3Discount={product.grade3Discount}
                  grade4Discount={product.grade4Discount}
                  grade5Discount={product.grade5Discount}
                  grade6Discount={product.grade6Discount}
                />
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-card">
                <h3 className="mb-4 text-base font-bold text-secondary md:text-lg">📋 مشخصات محصول</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-muted">کد محصول</dt><dd className="font-bold text-secondary">{product.code}</dd></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-muted">نام محصول</dt><dd className="font-bold text-secondary">{product.name}</dd></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-muted">سایز</dt><dd className="font-bold text-secondary">{product.size}</dd></div>
                  {pct > 0 && <div className="flex justify-between border-b border-gray-50 pb-2"><dt className="text-muted">تخفیف</dt><dd className="font-bold text-primary">{pct.toLocaleString("fa-IR")}٪</dd></div>}
                </dl>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="mb-2 text-sm font-bold text-secondary">📦 موجودی به تفکیک درجه (متر مربع):</h4>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {gradeEntries.map((g) => (
                      <div key={g.grade} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs border border-gray-100">
                        <span className="text-muted">درجه {g.grade}</span>
                        <span className={`font-bold ${g.count > 0 ? 'text-primary' : 'text-red-500'}`}>
                          {g.count.toLocaleString("fa-IR")} متر
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <section className="mt-12 md:mt-16">
              <h2 className="mb-6 text-xl font-black text-secondary md:text-2xl">🛍️ محصولات مشابه</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {similar.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}