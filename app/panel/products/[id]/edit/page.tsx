import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/EditProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-xs text-muted mb-4">
          <Link href="/panel" className="hover:text-primary">داشبورد</Link>
          <span>◄</span>
          <Link href="/panel/products" className="hover:text-primary">مدیریت محصولات</Link>
          <span>◄</span>
          <span className="text-secondary">ویرایش {product.name}</span>
        </nav>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">ویرایش محصول</h1>
        <p className="mt-1 text-sm text-muted">قیمت و درصد درجات را تنظیم کنید.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
        <EditProductForm product={product} />
      </div>
    </div>
  );
}