import Link from "next/link";
import { activePct, finalPrice, formatPrice, getTotalStock } from "@/lib/pricing";

interface Product {
  id: string;
  code: string;
  name: string;
  size: string;
  imageUrl: string;
  price: number;
  stock: any;
  discountPercent: number;
  discountEndsAt: Date | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const pct = activePct(product);
  const final = finalPrice(product.price, pct);
  const totalStock = getTotalStock(product.stock);
  const outOfStock = totalStock <= 0;
  const isLogoImage = product.imageUrl.includes("logo");
  const isPriceSet = product.price > 0;

  const stockObj = typeof product.stock === "object" && product.stock !== null ? product.stock : {};
  const availableGrades = Object.entries(stockObj)
    .filter(([_, count]) => Number(count) > 0)
    .map(([grade, count]) => ({ grade, count: Number(count) }));

  return (
    <Link
      href={isPriceSet ? `/product/${product.id}` : "#"}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 ${isPriceSet ? 'hover:shadow-card-hover hover:-translate-y-1' : 'opacity-80'}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {isLogoImage ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark p-4">
            <img src={product.imageUrl} alt={product.name} className="h-3/4 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
          </div>
        ) : (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        )}

        {isPriceSet && pct > 0 && (
          <span className="absolute right-2 top-2 z-10 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white shadow-lg md:text-sm">
            {pct.toLocaleString("fa-IR")}٪
          </span>
        )}

        {!isPriceSet && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <span className="rounded-lg bg-orange-500 text-white px-3 py-1.5 text-sm font-bold">در انتظار قیمت</span>
          </div>
        )}

        {isPriceSet && outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-bold text-primary">ناموجود</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3 md:gap-2 md:p-4">
        <div className="text-[10px] text-muted md:text-xs">کد: {product.code}</div>
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-secondary transition-colors group-hover:text-primary md:text-base">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted md:text-sm">
          <span>📐</span>
          <span>سایز {product.size}</span>
        </div>

        <div className="mt-2 border-t border-gray-100 pt-2">
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted md:text-xs">
            <span>موجودی:</span>
            <span className="font-bold text-secondary">{totalStock.toLocaleString("fa-IR")} متر</span>
          </div>
          {availableGrades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {availableGrades.map((g) => (
                <span key={g.grade} className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-secondary border border-gray-100">
                  درجه {g.grade}: {g.count.toLocaleString("fa-IR")}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-2">
          {isPriceSet ? (
            pct > 0 ? (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted line-through md:text-xs">{formatPrice(product.price)} تومان</span>
                <span className="text-base font-black text-primary md:text-lg">
                  {formatPrice(final)}
                  <span className="mr-1 text-[10px] font-normal text-muted md:text-xs">تومان</span>
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-secondary md:text-lg">
                {formatPrice(product.price)}
                <span className="mr-1 text-[10px] font-normal text-muted md:text-xs">تومان</span>
              </span>
            )
          ) : (
            <span className="text-sm font-bold text-orange-500">قیمت‌گذاری نشده</span>
          )}
        </div>
      </div>
    </Link>
  );
}