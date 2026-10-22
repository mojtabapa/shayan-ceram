import { prisma } from "@/lib/prisma";
import DealersTable from "@/components/DealersTable";

export default async function PanelDealersPage() {
  const dealers = await prisma.dealer.findMany({
    include: {
      user: {
        select: {
          name: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">
          👥 مدیریت نمایندگان
        </h1>
        <p className="mt-1 text-sm text-muted">
          لیست نمایندگان ثبت‌نام شده و وضعیت تایید آن‌ها
        </p>
      </div>

      <DealersTable dealers={dealers} />
    </div>
  );
}