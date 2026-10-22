import Link from "next/link";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-xs text-muted mb-4">
          <Link href="/panel" className="hover:text-primary">داشبورد</Link>
          <span>◄</span>
          <Link href="/panel/products" className="hover:text-primary">مدیریت محصولات</Link>
          <span>◄</span>
          <span className="text-secondary">محصول جدید</span>
        </nav>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">افزودن محصول جدید</h1>
        <p className="mt-1 text-sm text-muted">اطلاعات محصول جدید را وارد کنید.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100">
        <ProductForm />
      </div>
    </div>
  );
}