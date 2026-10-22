import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/pricing";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role !== "DEALER") {
    redirect("/panel");
  }

  const dealer = await prisma.dealer.findUnique({
    where: { userId: user.id },
  });

  if (!dealer) {
    return <div className="p-6 text-center text-muted">اطلاعات نماینده یافت نشد.</div>;
  }

  const orders = await prisma.order.findMany({
    where: { dealerId: dealer.id },
    include: {
      product: { select: { name: true, size: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">📦 سفارش‌های من</h1>
        <p className="mt-1 text-sm text-muted">لیست سفارش‌هایی که ثبت کرده‌اید</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
          <div className="mb-4 text-6xl">📭</div>
          <h3 className="mb-2 text-xl font-bold text-secondary">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-sm text-muted mb-6">برای ثبت سفارش به کاتالوگ محصولات بروید.</p>
          <Link href="/catalog" className="btn-primary px-8 py-3">
            🛍️ مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => {
            // رنگ و متن وضعیت
            let statusText = "";
            let statusColor = "";
            if (order.status === "PENDING") { statusText = "در انتظار تایید"; statusColor = "bg-orange-50 text-orange-600"; }
            else if (order.status === "APPROVED") { statusText = "تایید شده"; statusColor = "bg-blue-50 text-blue-600"; }
            else if (order.status === "LOADED") { statusText = "بارگیری شده"; statusColor = "bg-purple-50 text-purple-600"; }
            else if (order.status === "DELIVERED") { statusText = "تحویل شده"; statusColor = "bg-green-50 text-green-600"; }
            else if (order.status === "REJECTED") { statusText = "رد شده"; statusColor = "bg-red-50 text-red-600"; }

            return (
              <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-secondary">{order.product.name}</div>
                      <div className="text-xs text-muted mt-1">سایز: {order.product.size}</div>
                    </div>
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted">درجه:</span>
                      <span className="font-bold text-secondary">{order.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">تعداد:</span>
                      <span className="font-bold text-secondary">{order.quantity} متر مربع</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">مبلغ کل:</span>
                      <span className="font-bold text-primary">{formatPrice(order.total)} تومان</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">تاریخ ثبت:</span>
                      <span className="text-secondary">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</span>
                    </div>
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