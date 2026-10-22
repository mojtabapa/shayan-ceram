"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { activePct, formatPrice, getTotalStock } from "@/lib/pricing";

interface Product {
  id: string;
  code: string;
  name: string;
  size: string;
  price: number;
  stock: any;
  minStock: number;
  discountPercent: number;
  discountEndsAt: Date | null;
  published: boolean;
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`آیا از حذف محصول «${name}» مطمئن هستید؟`)) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert("خطا در حذف محصول");
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current })
      });
      if (res.ok) router.refresh();
      else alert("خطا در تغییر وضعیت");
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-xs text-muted md:text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">کد</th>
              <th className="px-4 py-3 font-medium">نام محصول</th>
              <th className="px-4 py-3 font-medium">قیمت</th>
              <th className="px-4 py-3 font-medium">موجودی</th>
              <th className="px-4 py-3 font-medium">انتشار</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const pct = activePct(product);
              const finalPrice = product.price - (product.price * pct) / 100;
              const totalStock = getTotalStock(product.stock);
              const isPriceSet = product.price > 0;

              return (
                <tr key={product.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs">{product.code}</td>
                  <td className="px-4 py-3 font-bold text-secondary">{product.name}</td>
                  <td className="px-4 py-3 font-bold text-primary">
                    {isPriceSet ? formatPrice(finalPrice) : (
                      <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-1 rounded-md">در انتظار قیمت</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{totalStock.toLocaleString("fa-IR")} <span className="text-xs text-muted">متر</span></td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => handleTogglePublish(product.id, product.published)}
                      disabled={loadingId === product.id || !isPriceSet}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                        !isPriceSet ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                        product.published ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {product.published ? "منتشر شده" : "مخفی"}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Link href={`/panel/products/${product.id}/edit`} className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 hover:bg-orange-100">
                      ویرایش
                    </Link>
                    <button onClick={() => handleDelete(product.id, product.name)} disabled={loadingId === product.id} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50">
                      {loadingId === product.id ? "..." : "حذف"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}