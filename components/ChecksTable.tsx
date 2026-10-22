"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/pricing";

interface Check {
  id: string;
  amount: number;
  dueDate: Date;
  status: string;
  imageUrl: string;
  dealer: {
    company: string;
    user: { name: string };
  };
}

export default function ChecksTable({ checks }: { checks: Check[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(checkId: string, newStatus: string) {
    if (!confirm("آیا از تغییر وضعیت این چک مطمئن هستید؟")) return;

    setLoadingId(checkId);
    try {
      const res = await fetch("/api/checks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkId, status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("خطا در تغییر وضعیت چک");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingId(null);
    }
  }

  if (checks.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
        <div className="mb-4 text-6xl">💰</div>
        <h3 className="mb-2 text-xl font-bold text-secondary">هنوز چکی ثبت نشده</h3>
        <p className="text-sm text-muted">چک‌های ثبت شده توسط نمایندگان در اینجا نمایش داده می‌شوند.</p>
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
              <th className="px-4 py-3 font-medium">مبلغ چک</th>
              <th className="px-4 py-3 font-medium">تاریخ سررسید</th>
              <th className="px-4 py-3 font-medium">تصویر</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {checks.map((check) => (
              <tr key={check.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="font-bold text-secondary">{check.dealer.user.name}</div>
                  <div className="text-xs text-muted">{check.dealer.company}</div>
                </td>
                <td className="px-4 py-3 font-bold text-primary">{formatPrice(check.amount)}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(check.dueDate).toLocaleDateString("fa-IR")}
                </td>
                <td className="px-4 py-3">
                  <a href={check.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">
                    مشاهده عکس
                  </a>
                </td>
                <td className="px-4 py-3">
                  {check.status === "UPLOADED" && <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">آپلود شده</span>}
                  {check.status === "RECEIVED" && <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">دریافت شده</span>}
                  {check.status === "CLEARED" && <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">وصول شده</span>}
                  {check.status === "BOUNCED" && <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">برگشتی</span>}
                </td>
                <td className="px-4 py-3">
                  {(check.status === "RECEIVED" || check.status === "UPLOADED") ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(check.id, "CLEARED")}
                        disabled={loadingId === check.id}
                        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                      >
                        وصول شد
                      </button>
                      <button
                        onClick={() => handleStatusChange(check.id, "BOUNCED")}
                        disabled={loadingId === check.id}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        برگشت
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}