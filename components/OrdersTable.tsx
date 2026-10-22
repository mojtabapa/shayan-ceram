"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";

interface Order {
  id: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: Date;
  dealer: {
    company: string;
    user: { name: string };
  };
  product: {
    name: string;
  };
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) router.refresh();
      else alert("خطا در تغییر وضعیت");
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
        <div className="mb-4 text-6xl">📦</div>
        <h3 className="mb-2 text-xl font-bold text-secondary">هنوز سفارشی ثبت نشده</h3>
        <p className="text-sm text-muted">سفارش‌های جدید در اینجا نمایش داده می‌شوند.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-xs text-muted md:text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">نماینده</th>
              <th className="px-4 py-3 font-medium">محصول</th>
              <th className="px-4 py-3 font-medium">تعداد</th>
              <th className="px-4 py-3 font-medium">مبلغ کل</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 font-bold text-secondary">{order.dealer.user.name} ({order.dealer.company})</td>
                <td className="px-4 py-3 text-muted">{order.product.name}</td>
                <td className="px-4 py-3 text-secondary font-bold">{order.quantity}</td>
                <td className="px-4 py-3 font-bold text-primary">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  {order.status === "PENDING" && <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">در انتظار</span>}
                  {order.status === "APPROVED" && <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">تایید شده</span>}
                  {order.status === "LOADED" && <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-600">بارگیری شده</span>}
                  {order.status === "DELIVERED" && <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">تحویل شده</span>}
                  {order.status === "REJECTED" && <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">رد شده</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* دکمه پیش‌فاکتور */}
                    <Link
                      href={`/print/proforma/${order.id}`}
                      target="_blank"
                      className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      🖨️ پیش‌فاکتور
                    </Link>

                    {/* دکمه‌های تغییر وضعیت */}
                    {order.status === "PENDING" && (
                      <button onClick={() => handleStatusChange(order.id, "APPROVED")} disabled={loadingId === order.id} className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50">تایید</button>
                    )}
                    {order.status === "APPROVED" && (
                      <button onClick={() => handleStatusChange(order.id, "LOADED")} disabled={loadingId === order.id} className="rounded-lg bg-purple-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-purple-600 disabled:opacity-50">بارگیری</button>
                    )}
                    {order.status === "LOADED" && (
                      <button onClick={() => handleStatusChange(order.id, "DELIVERED")} disabled={loadingId === order.id} className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600 disabled:opacity-50">تحویل</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}