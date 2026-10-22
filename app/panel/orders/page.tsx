import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/OrdersTable";

export default async function PanelOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      dealer: {
        include: {
          user: { select: { name: true } }
        }
      },
      product: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">🚚 مدیریت سفارش‌ها</h1>
        <p className="mt-1 text-sm text-muted">لیست سفارش‌های ثبت شده توسط نمایندگان</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}