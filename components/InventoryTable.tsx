"use client";

import { getTotalStock } from "@/lib/pricing";

interface Product {
  id: string;
  code: string;
  name: string;
  size: string;
  stock: any;
  minStock: number;
}

export default function InventoryTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-xs text-muted md:text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">کد</th>
              <th className="px-4 py-3 font-medium">نام محصول</th>
              <th className="px-4 py-3 font-medium">سایز</th>
              <th className="px-4 py-3 font-medium">موجودی کل</th>
              <th className="px-4 py-3 font-medium">حداقل موجودی</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const totalStock = getTotalStock(product.stock);
              const isLowStock = totalStock <= product.minStock && totalStock > 0;
              const isOutOfStock = totalStock === 0;

              return (
                <tr key={product.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs">{product.code}</td>
                  <td className="px-4 py-3 font-bold text-secondary">{product.name}</td>
                  <td className="px-4 py-3 text-muted">{product.size}</td>
                  <td className="px-4 py-3 font-bold text-primary text-base">
                    {totalStock.toLocaleString("fa-IR")} <span className="text-xs font-normal text-muted">متر مربع</span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {product.minStock.toLocaleString("fa-IR")} <span className="text-xs text-muted">متر مربع</span>
                  </td>
                  <td className="px-4 py-3">
                    {isOutOfStock ? (<span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">ناموجود</span>) : 
                     isLowStock ? (<span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">کمبود موجودی</span>) : 
                     (<span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">موجود</span>)}
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