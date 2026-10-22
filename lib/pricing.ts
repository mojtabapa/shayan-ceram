export const activePct = (p: {
  discountPercent: number;
  discountEndsAt: Date | null;
}): number => {
  if (p.discountPercent <= 0) return 0;
  if (p.discountEndsAt && p.discountEndsAt < new Date()) return 0;
  return p.discountPercent;
};

export const finalPrice = (price: number, pct: number): number => {
  return Math.round((price * (100 - pct)) / 100);
};

export const formatPrice = (n: number): string => {
  return n.toLocaleString("fa-IR");
};

export const priceToman = (n: number): string => {
  return `${n.toLocaleString("fa-IR")} تومان`;
};

// محاسبه مجموع موجودی از آبجکت درجه‌ها
export const getTotalStock = (stock: any): number => {
  if (typeof stock === "number") return stock; // برای سازگاری با دیتای قدیمی
  if (!stock) return 0;
  return Object.values(stock).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
};