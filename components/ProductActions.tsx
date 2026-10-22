"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/pricing";

interface ProductActionsProps {
  productId: string;
  productName: string;
  price: number;
  finalPrice: number;
  discountPct: number;
  stock: number;
}

export default function ProductActions({
  productId,
  productName,
  price,
  finalPrice,
  discountPct,
  stock,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = stock <= 0;

  const totalPrice = finalPrice * quantity;

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const handleOrder = () => {
    alert(
      `✅ سفارش شما ثبت شد!\n\n` +
        `محصول: ${productName}\n` +
        `تعداد: ${quantity} عدد\n` +
        `مبلغ کل: ${formatPrice(totalPrice)} تومان\n\n` +
        `به‌زودی با شما تماس می‌گیریم.`
    );
  };

  return (
    <div className="space-y-4">
      {/* قیمت */}
      <div className="rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-bglight p-4 md:p-5">
        {discountPct > 0 ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-white">
                {discountPct.toLocaleString("fa-IR")}٪ تخفیف
              </span>
              <span className="text-sm text-muted line-through">
                {formatPrice(price)} تومان
              </span>
            </div>
            <div className="text-2xl font-black text-primary md:text-3xl">
              {formatPrice(finalPrice)}
              <span className="mr-2 text-sm font-normal text-muted md:text-base">
                تومان
              </span>
            </div>
          </div>
        ) : (
          <div className="text-2xl font-black text-secondary md:text-3xl">
            {formatPrice(price)}
            <span className="mr-2 text-sm font-normal text-muted md:text-base">
              تومان
            </span>
          </div>
        )}
      </div>

      {/* تعداد */}
      {!outOfStock && (
        <div className="rounded-2xl border-2 border-gray-100 bg-white p-4 md:p-5">
          <div className="mb-3 text-sm font-bold text-secondary md:text-base">
            تعداد سفارش
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={decreaseQty}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-200 text-xl font-bold text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="کاهش"
              >
                −
              </button>
              <span className="min-w-[60px] text-center text-xl font-black text-secondary">
                {quantity.toLocaleString("fa-IR")}
              </span>
              <button
                onClick={increaseQty}
                disabled={quantity >= stock}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-200 text-xl font-bold text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="افزایش"
              >
                +
              </button>
            </div>
            <div className="text-left">
              <div className="text-xs text-muted md:text-sm">موجودی</div>
              <div className="text-sm font-bold text-secondary md:text-base">
                {stock.toLocaleString("fa-IR")} عدد
              </div>
            </div>
          </div>

          {/* مبلغ کل */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-sm text-muted md:text-base">مبلغ کل:</span>
            <span className="text-lg font-black text-primary md:text-xl">
              {formatPrice(totalPrice)}{" "}
              <span className="text-xs font-normal text-muted md:text-sm">
                تومان
              </span>
            </span>
          </div>
        </div>
      )}

      {/* دکمه سفارش */}
      <button
        onClick={handleOrder}
        disabled={outOfStock}
        className={`w-full rounded-2xl px-6 py-4 text-base font-bold text-white shadow-lg transition-all md:text-lg ${
          outOfStock
            ? "cursor-not-allowed bg-gray-400"
            : "bg-gradient-to-l from-primary to-primary-dark hover:shadow-xl hover:-translate-y-0.5"
        }`}
      >
        {outOfStock ? (
          <span>❌ ناموجود</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🛒</span>
            <span>ثبت سفارش</span>
          </span>
        )}
      </button>

      {/* دکمه تماس */}
      <a
        href="tel:09394576300"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary px-6 py-3.5 text-sm font-bold text-secondary transition-all hover:bg-secondary hover:text-white md:text-base"
      >
        <span>📞</span>
        <span>تماس برای مشاوره</span>
      </a>

      {/* ویژگی‌های کوچیک */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-1 text-xl">🚚</div>
          <div className="text-[10px] text-muted md:text-xs">ارسال سریع</div>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-1 text-xl">🛡️</div>
          <div className="text-[10px] text-muted md:text-xs">ضمانت کیفیت</div>
        </div>
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-1 text-xl">💰</div>
          <div className="text-[10px] text-muted md:text-xs">قیمت مناسب</div>
        </div>
      </div>
    </div>
  );
}