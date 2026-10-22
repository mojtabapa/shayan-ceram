"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Dealer {
  id: string;
  company: string;
  nationalId: string;
  status: string;
  createdAt: Date;
  user: {
    name: string;
    phone: string | null;
  };
}

export default function DealersTable({ dealers }: { dealers: Dealer[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(dealerId: string, newStatus: string) {
    setLoadingId(dealerId);
    try {
      const res = await fetch("/api/dealers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealerId, status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("خطا در تغییر وضعیت");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoadingId(null);
    }
  }

  if (dealers.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
        <div className="mb-4 text-6xl">👥</div>
        <h3 className="mb-2 text-xl font-bold text-secondary">هنوز نماینده‌ای ثبت‌نام نکرده</h3>
        <p className="text-sm text-muted">نمایندگان جدید پس از ثبت‌نام در اینجا نمایش داده می‌شوند.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 text-xs text-muted md:text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">نام نماینده</th>
              <th className="px-4 py-3 font-medium">شرکت</th>
              <th className="px-4 py-3 font-medium">موبایل</th>
              <th className="px-4 py-3 font-medium">کد ملی</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dealers.map((dealer) => (
              <tr key={dealer.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 font-bold text-secondary">{dealer.user.name}</td>
                <td className="px-4 py-3 text-muted">{dealer.company}</td>
                <td className="px-4 py-3 text-muted font-mono" dir="ltr">{dealer.user.phone}</td>
                <td className="px-4 py-3 text-muted font-mono" dir="ltr">{dealer.nationalId}</td>
                <td className="px-4 py-3">
                  {dealer.status === "PENDING" && (
                    <span className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                      در انتظار تایید
                    </span>
                  )}
                  {dealer.status === "ACTIVE" && (
                    <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600">
                      فعال
                    </span>
                  )}
                  {dealer.status === "REJECTED" && (
                    <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                      رد شده
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {dealer.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(dealer.id, "ACTIVE")}
                        disabled={loadingId === dealer.id}
                        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                      >
                        تایید
                      </button>
                      <button
                        onClick={() => handleStatusChange(dealer.id, "REJECTED")}
                        disabled={loadingId === dealer.id}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        رد
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