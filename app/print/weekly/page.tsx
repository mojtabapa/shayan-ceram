import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site.config";
import { formatPrice } from "@/lib/pricing";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WeeklyReportPage() {
  // محاسبه تاریخ ۷ روز پیش
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // آمار هفته گذشته
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: oneWeekAgo },
      status: { in: ["APPROVED", "LOADED", "DELIVERED"] },
    },
    include: {
      dealer: { include: { user: { select: { name: true } } } },
      product: { select: { name: true } },
    },
  });

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalMeters = orders.reduce((sum, o) => sum + o.quantity, 0);
  const uniqueDealers = new Set(orders.map(o => o.dealerId)).size;

  // پیش‌بینی فروش (میانگین فروش قبلی)
  const previousOrders = await prisma.order.findMany({
    where: { status: { in: ["APPROVED", "LOADED", "DELIVERED"] } },
    select: { total: true, createdAt: true },
  });
  
  const monthlySales: Record<string, number> = {};
  previousOrders.forEach(o => {
    const monthKey = `${o.createdAt.getFullYear()}-${o.createdAt.getMonth()}`;
    monthlySales[monthKey] = (monthlySales[monthKey] || 0) + o.total;
  });

  const salesValues = Object.values(monthlySales);
  let forecast = 0;
  if (salesValues.length > 0) {
    forecast = salesValues.reduce((a, b) => a + b, 0) / salesValues.length;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center print:bg-white print:p-0">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg print:shadow-none print:rounded-none">
        
        {/* هدر */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoPath} alt={siteConfig.brandName} className="h-16 w-auto" />
            <div>
              <h1 className="text-xl font-black text-secondary">{siteConfig.brandName}</h1>
              <p className="text-xs text-muted">گزارش عملکرد هفتگی</p>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-black text-primary">گزارش هفتگی</h2>
            <p className="text-xs text-muted mt-1">تاریخ: {new Date().toLocaleDateString("fa-IR")}</p>
            <p className="text-xs text-muted">بازه: {oneWeekAgo.toLocaleDateString("fa-IR")} تا امروز</p>
          </div>
        </div>

        {/* کارت‌های آمار */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-blue-600">{orders.length.toLocaleString("fa-IR")}</div>
            <div className="text-xs text-blue-500 mt-1">تعداد سفارش</div>
          </div>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-green-600">{totalMeters.toLocaleString("fa-IR")}</div>
            <div className="text-xs text-green-500 mt-1">متر مربع بارگیری</div>
          </div>
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
            <div className="text-2xl font-black text-orange-600">{uniqueDealers.toLocaleString("fa-IR")}</div>
            <div className="text-xs text-orange-500 mt-1">نماینده فعال</div>
          </div>
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl text-center">
            <div className="text-lg font-black text-primary">{formatPrice(totalSales)}</div>
            <div className="text-xs text-primary/70 mt-1">فروش (تومان)</div>
          </div>
        </div>

        {/* پیش‌بینی فروش */}
        <div className="bg-secondary-dark text-white p-6 rounded-2xl mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">🔮 پیش‌بینی فروش ماه آینده</h3>
            <p className="text-sm text-white/60">بر اساس میانگین فروش ماه‌های گذشته</p>
          </div>
          <div className="text-left">
            <div className="text-3xl font-black text-accent">{formatPrice(Math.round(forecast))}</div>
            <div className="text-xs text-white/50 mt-1">تومان</div>
          </div>
        </div>

        {/* جدول سفارش‌ها */}
        <h3 className="text-lg font-bold text-secondary mb-4">📦 سفارش‌های هفته گذشته</h3>
        
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted bg-gray-50 rounded-xl border border-gray-100">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">در این هفته سفارشی تایید نشده است.</p>
          </div>
        ) : (
          <table className="w-full text-right text-sm border-collapse mb-8">
            <thead>
              <tr className="bg-gray-50 text-muted border-b border-gray-200">
                <th className="p-3">تاریخ</th>
                <th className="p-3">نماینده</th>
                <th className="p-3">محصول</th>
                <th className="p-3">تعداد</th>
                <th className="p-3">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="p-3 text-muted">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>
                  <td className="p-3 font-bold text-secondary">{order.dealer.user.name}</td>
                  <td className="p-3 text-muted">{order.product.name}</td>
                  <td className="p-3">{order.quantity.toLocaleString("fa-IR")} متر</td>
                  <td className="p-3 font-bold text-primary">{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* دکمه چاپ */}
        <div className="mt-8 flex justify-center print:hidden gap-4">
          <PrintButton text="چاپ گزارش هفتگی" />
          <Link href="/panel" className="rounded-xl border-2 border-gray-200 px-6 py-2.5 text-sm font-bold text-secondary hover:bg-gray-50">
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    </div>
  );
}