import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogGrid from "@/components/CatalogGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "محصولات",
  description: "کاتالوگ کامل محصولات کاشی و سرامیک شایان میبد",
};

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: { 
      published: true,
      // دیگه شرط price > 0 رو نداریم تا محصولات منتظر قیمت هم بیان
    },
    orderBy: { code: "asc" }
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bglight py-8 md:py-12">
        <div className="container-custom">
          <div className="mb-8 text-center md:mb-10">
            <h1 className="mb-2 text-2xl font-black text-secondary md:text-3xl lg:text-4xl">
              🛍️ محصولات کاشی شایان
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-muted md:text-base">
              کاتالوگ کامل محصولات کاشی، سرامیک و پرسلان با بهترین کیفیت و قیمت
            </p>
          </div>
          <CatalogGrid products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}