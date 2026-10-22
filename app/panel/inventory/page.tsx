import { prisma } from "@/lib/prisma";
import InventoryTable from "@/components/InventoryTable";
import InventoryUploader from "@/components/InventoryUploader";

export default async function PanelInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { code: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">🏭 مدیریت انبار</h1>
        <p className="mt-1 text-sm text-muted">مشاهده و بروزرسانی موجودی محصولات</p>
      </div>

      {/* بخش آپلود فایل */}
      <InventoryUploader />

      {/* جدول موجودی */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-secondary">📦 موجودی فعلی انبار</h2>
        <InventoryTable products={products} />
      </div>
    </div>
  );
}