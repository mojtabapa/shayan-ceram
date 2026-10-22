import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, getTotalStock } from "@/lib/pricing";
import IranMap from "@/components/IranMap";

export default async function PanelPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  // آمار کلی
  const totalProducts = await prisma.product.count();
  const totalDealers = await prisma.dealer.count();
  const totalOrders = await prisma.order.count();
  
  const approvedOrders = await prisma.order.findMany({
    where: { status: { in: ["APPROVED", "LOADED", "DELIVERED"] } },
    select: { total: true },
  });
  const totalSales = approvedOrders.reduce((sum, order) => sum + order.total, 0);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      dealer: { include: { user: { select: { name: true } } } },
      product: { select: { name: true } },
    },
  });

  const allProducts = await prisma.product.findMany({ select: { id: true, name: true, stock: true, minStock: true } });
  const lowStockProducts = allProducts.filter(p => {
    const total = getTotalStock(p.stock);
    return total > 0 && total <= p.minStock;
  });

  // ============ محاسبه آمار استانی ============
  const dealers = await prisma.dealer.findMany({
    include: {
      orders: {
        where: { status: { in: ["APPROVED", "LOADED", "DELIVERED"] } },
        select: { quantity: true }
      }
    }
  });

  const provinceStats: Record<string, { totalMeters: number; dealersCount: number }> = {};

  dealers.forEach(dealer => {
    const provinceName = dealer.province || "نامشخص";
    const totalMeters = dealer.orders.reduce((sum, o) => sum + o.quantity, 0);

    if (!provinceStats[provinceName]) {
      provinceStats[provinceName] = { totalMeters: 0, dealersCount: 0 };
    }
    provinceStats[provinceName].totalMeters += totalMeters;
    provinceStats[provinceName].dealersCount += 1;
  });

  // تعیین وضعیت بر اساس میزان فروش
  const mapData = Object.entries(provinceStats).map(([name, stats]) => {
    let status: "good" | "average" | "weak" | "none" = "none";
    if (stats.totalMeters > 1000) status = "good";
    else if (stats.totalMeters > 300) status = "average";
    else if (stats.totalMeters > 0) status = "weak";
    
    return { name, ...stats, status };
  });

  return (
    <div className="space-y-8">
      {/* هدر خوش‌آمدگویی و دکمه گزارش */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-secondary md:text-3xl">
            خوش آمدید، {user?.name} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
            خلاصه‌ای از وضعیت فروشگاه در یک نگاه
          </p>
        </div>
        
        {/* دکمه گزارش هفتگی */}
        <a
          href="/print/weekly"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-secondary-light hover:-translate-y-0.5 w-full md:w-auto"
        >
          <span>📊</span>
          <span>مشاهده گزارش هفتگی</span>
        </a>
      </div>

      {/* کارت‌های آمار اصلی */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted mb-1">کل محصولات</div>
              <div className="text-2xl font-black text-secondary">{totalProducts.toLocaleString("fa-IR")}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">🛍️</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted mb-1">نمایندگان</div>
              <div className="text-2xl font-black text-secondary">{totalDealers.toLocaleString("fa-IR")}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">👥</div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted mb-1">کل سفارش‌ها</div>
              <div className="text-2xl font-black text-secondary">{totalOrders.toLocaleString("fa-IR")}</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">📦</div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80 mb-1">فروش کل</div>
              <div className="text-xl font-black">{formatPrice(totalSales)}</div>
              <div className="text-xs text-white/60 mt-1">تومان</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">💰</div>
          </div>
        </div>
      </div>

      {/* نقشه ایران */}
      <IranMap data={mapData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-secondary">📦 آخرین سفارش‌ها</h2>
            <Link href="/panel/orders" className="text-sm font-bold text-primary hover:underline">مشاهده همه</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">هنوز سفارشی ثبت نشده است.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
                  <div>
                    <div className="text-sm font-bold text-secondary">{order.dealer.user.name}</div>
                    <div className="text-xs text-muted">{order.product.name}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-primary">{formatPrice(order.total)}</div>
                    <div className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-secondary mb-4">⚠️ هشدار موجودی</h2>
          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-sm text-muted">موجودی همه محصولات در وضعیت مناسبی است.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-orange-50 border border-orange-100 p-3">
                  <span className="text-sm font-bold text-secondary">{p.name}</span>
                  <span className="text-xs font-bold text-orange-600">{getTotalStock(p.stock)} متر</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}