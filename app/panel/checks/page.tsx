import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/pricing";
import Link from "next/link";

export default async function MyChecksPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role !== "DEALER") redirect("/panel");

  const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
  if (!dealer) return <div className="p-6 text-center text-muted">اطلاعات نماینده یافت نشد.</div>;

  const checks = await prisma.check.findMany({
    where: { dealerId: dealer.id },
    orderBy: { dueDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-secondary md:text-3xl">💰 چک‌های من</h1>
          <p className="mt-1 text-sm text-muted">لیست چک‌های ارسالی و وضعیت وصول آن‌ها</p>
        </div>
        <Link href="/panel/checks/new" className="btn-primary px-5 py-2.5 text-sm">
          + ثبت چک جدید
        </Link>
      </div>

      {checks.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
          <div className="mb-4 text-6xl">📄</div>
          <h3 className="mb-2 text-xl font-bold text-secondary">هنوز چکی ثبت نکرده‌اید</h3>
          <p className="text-sm text-muted">چک‌های جدید خود را با دکمه بالا ثبت کنید.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {checks.map((check) => {
            let statusText = "";
            let statusColor = "";
            if (check.status === "UPLOADED") { statusText = "آپلود شده"; statusColor = "bg-gray-100 text-gray-600"; }
            else if (check.status === "RECEIVED") { statusText = "دریافت شده"; statusColor = "bg-blue-50 text-blue-600"; }
            else if (check.status === "CLEARED") { statusText = "وصول شده"; statusColor = "bg-green-50 text-green-600"; }
            else if (check.status === "BOUNCED") { statusText = "برگشتی"; statusColor = "bg-red-50 text-red-600"; }

            return (
              <div key={check.id} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-lg font-black text-primary">{formatPrice(check.amount)} <span className="text-xs font-normal text-muted">تومان</span></div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${statusColor}`}>{statusText}</span>
                </div>
                <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
                  <div className="flex justify-between">
                    <span className="text-muted">تاریخ سررسید:</span>
                    <span className="font-bold text-secondary">{new Date(check.dueDate).toLocaleDateString("fa-IR")}</span>
                  </div>
                  <div className="mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={check.imageUrl} alt="چک" className="h-32 w-full rounded-xl object-cover border border-gray-100" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}