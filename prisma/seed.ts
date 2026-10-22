import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 شروع seed...");

  // ============ کاربران ============
  const users: [string, string, Role][] = [
    ["ceo", "مدیرعامل", "CEO"],
    ["salesmanager", "مدیر فروش", "SALES_MANAGER"],
    ["sales", "پرسنل فروش", "SALES_STAFF"],
    ["warehouse", "انباردار", "WAREHOUSE"],
    ["accounting", "حسابدار", "ACCOUNTING"],
    ["designer", "طراح", "DESIGNER"],
    ["dealer", "نماینده نمونه", "DEALER"],
  ];

  const passwordHash = await bcrypt.hash("Demo@1234", 10);

  for (const [username, name, role] of users) {
    await prisma.user.upsert({
      where: { username },
      update: {},
      create: { username, name, role, phone: "09120000000", passwordHash },
    });
  }
  console.log("✅ کاربران ساخته شدن");

  // ============ پروفایل نماینده برای کاربر dealer ============
  const dealerUser = await prisma.user.findUnique({ where: { username: "dealer" } });
  
  if (dealerUser) {
    await prisma.dealer.upsert({
      where: { userId: dealerUser.id },
      update: {},
      create: {
        userId: dealerUser.id,
        company: "فروشگاه کاشی نمونه",
        nationalId: "0012345678",
        status: "ACTIVE", // فعال برای تست
      },
    });
    console.log("✅ پروفایل نمایندگی برای کاربر dealer ساخته شد");
  }

  // ============ محصولات نمونه (با درجه‌بندی) ============
  const products = [
    {
      code: "P-001", name: "سرامیک مرمرنما شایان", size: "60×60", imageUrl: "/images/products/ceramic-01.jpg", price: 450000, minStock: 100, published: true, discountPercent: 15, discountEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      stock: { "1": 200, "2": 150, "3": 100, "4": 30, "5": 10, "6": 10 }
    },
    {
      code: "P-002", name: "پرسلان فوق براق شایان", size: "80×80", imageUrl: "/images/products/porcelain-01.jpg", price: 780000, minStock: 80, published: true, discountPercent: 20, discountEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      stock: { "1": 120, "2": 100, "3": 50, "4": 30, "5": 10, "6": 10 }
    },
    {
      code: "P-003", name: "کاشی دیواری گلدار", size: "30×60", imageUrl: "/images/products/tile-01.jpg", price: 320000, minStock: 150, published: true, discountPercent: 0, discountEndsAt: null,
      stock: { "1": 400, "2": 300, "3": 100, "4": 50, "5": 0, "6": 0 }
    },
    {
      code: "P-004", name: "سرامیک مات ضد لغزش", size: "60×60", imageUrl: "/images/products/ceramic-02.jpg", price: 520000, minStock: 100, published: true, discountPercent: 10, discountEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      stock: { "1": 100, "2": 80, "3": 30, "4": 0, "5": 0, "6": 0 }
    },
    {
      code: "P-005", name: "پرسلان کف چوبی", size: "20×120", imageUrl: "/images/products/wood-01.jpg", price: 950000, minStock: 60, published: true, discountPercent: 25, discountEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      stock: { "1": 80, "2": 50, "3": 30, "4": 20, "5": 0, "6": 0 }
    },
    {
      code: "P-006", name: "کاشی دیواری ساده سفید", size: "25×40", imageUrl: "/images/products/tile-02.jpg", price: 180000, minStock: 200, published: true, discountPercent: 0, discountEndsAt: null,
      stock: { "1": 500, "2": 400, "3": 200, "4": 100, "5": 0, "6": 0 }
    },
    {
      code: "P-007", name: "سرامیک طرح سنگ", size: "60×120", imageUrl: "/images/products/stone-01.jpg", price: 890000, minStock: 50, published: true, discountPercent: 12, discountEndsAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      stock: { "1": 40, "2": 30, "3": 15, "4": 10, "5": 0, "6": 0 }
    },
    {
      code: "P-008", name: "پرسلان دکوراتیو", size: "80×80", imageUrl: "/images/products/porcelain-02.jpg", price: 720000, minStock: 80, published: true, discountPercent: 0, discountEndsAt: null,
      stock: { "1": 10, "2": 5, "3": 0, "4": 0, "5": 0, "6": 0 }
    },
    {
      code: "P-009", name: "کاشی آشپزخانه رنگی", size: "30×30", imageUrl: "/images/products/kitchen-01.jpg", price: 250000, minStock: 120, published: true, discountPercent: 8, discountEndsAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      stock: { "1": 300, "2": 200, "3": 100, "4": 40, "5": 0, "6": 0 }
    },
    {
      code: "P-010", name: "سرامیک حمام ضد آب", size: "40×40", imageUrl: "/images/products/bathroom-01.jpg", price: 340000, minStock: 100, published: true, discountPercent: 18, discountEndsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      stock: { "1": 200, "2": 150, "3": 50, "4": 30, "5": 0, "6": 0 }
    },
    {
      code: "P-011", name: "پرسلان نما بیرونی", size: "60×120", imageUrl: "/images/products/facade-01.jpg", price: 1100000, minStock: 40, published: true, discountPercent: 0, discountEndsAt: null,
      stock: { "1": 40, "2": 20, "3": 10, "4": 5, "5": 0, "6": 0 }
    },
    {
      code: "P-012", name: "کاشی استخر", size: "25×25", imageUrl: "/images/products/pool-01.jpg", price: 290000, minStock: 100, published: true, discountPercent: 22, discountEndsAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      stock: { "1": 180, "2": 120, "3": 50, "4": 30, "5": 0, "6": 0 }
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: product as any,
      create: product as any,
    });
  }
  console.log(`✅ ${products.length} محصول با درجه‌بندی ساخته/آپدیت شدند`);

  console.log("🎉 seed با موفقیت تموم شد!");
}

main()
  .catch((e) => {
    console.error("❌ خطا:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });