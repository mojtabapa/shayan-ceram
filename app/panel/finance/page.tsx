import { prisma } from "@/lib/prisma";
import ChecksTable from "@/components/ChecksTable";

export default async function PanelFinancePage() {
  const checks = await prisma.check.findMany({
    include: {
      dealer: {
        include: {
          user: { select: { name: true } }
        }
      }
    },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">💰 مدیریت مالی و چک‌ها</h1>
        <p className="mt-1 text-sm text-muted">لیست چک‌های دریافتی از نمایندگان</p>
      </div>
      <ChecksTable checks={checks} />
    </div>
  );
}