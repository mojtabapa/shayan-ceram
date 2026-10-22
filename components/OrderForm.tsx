"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/pricing";

interface OrderFormProps {
  productId: string;
  stock: any;
  price: number;
  discountPercent: number;
  grade2Discount: number;
  grade3Discount: number;
  grade4Discount: number;
  grade5Discount: number;
  grade6Discount: number;
}

export default function OrderForm({ 
  productId, stock, price, discountPercent, 
  grade2Discount, grade3Discount, grade4Discount, grade5Discount, grade6Discount 
}: OrderFormProps) {
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState("1");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const numQuantity = Number(quantity) || 1;
  
  const stockObj = typeof stock === "object" && stock !== null ? stock : {};
  const availableStock = Number(stockObj[selectedGrade]) || 0;

  const getGradeDiscount = (grade: string) => {
    if (grade === "2") return grade2Discount;
    if (grade === "3") return grade3Discount;
    if (grade === "4") return grade4Discount;
    if (grade === "5") return grade5Discount;
    if (grade === "6") return grade6Discount;
    return 0;
  };

  const gradeDiscount = getGradeDiscount(selectedGrade);
  const basePriceWithSpecialDiscount = price - (price * discountPercent / 100);
  const finalUnitPrice = basePriceWithSpecialDiscount - (basePriceWithSpecialDiscount * gradeDiscount / 100);
  const totalPrice = finalUnitPrice * numQuantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity("");
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    if (num > availableStock) {
      setQuantity(availableStock);
    } else {
      setQuantity(num);
    }
  };

  async function handleOrder() {
    if (numQuantity < 1 || numQuantity > availableStock) {
      setMessage("⚠️ تعداد وارد شده معتبر نیست یا موجودی کافی نیست.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, grade: selectedGrade, quantity: numQuantity }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ سفارش با موفقیت ثبت شد.");
        router.refresh();
      } else {
        setMessage(`⚠️ ${data.error}`);
      }
    } catch (error) {
      setMessage("⚠️ خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-secondary">انتخاب درجه کاشی</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map(g => {
            const gStock = Number(stockObj[g]) || 0;
            const isOut = gStock === 0;
            return (
              <button
                key={g}
                onClick={() => setSelectedGrade(g.toString())}
                disabled={isOut}
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 transition-all ${
                  selectedGrade === g.toString()
                    ? "border-primary bg-primary/5 shadow-sm"
                    : isOut 
                    ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-primary/50"
                }`}
              >
                <span className={`text-sm font-bold ${selectedGrade === g.toString() ? 'text-primary' : 'text-secondary'}`}>
                  درجه {g}
                </span>
                <span className="text-[10px] text-muted mt-1">
                  {isOut ? "ناموجود" : `${gStock} متر`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-secondary">
          تعداد درخواستی (حداکثر {availableStock} متر مربع)
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => numQuantity > 1 && setQuantity(numQuantity - 1)}
            disabled={numQuantity <= 1}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 text-xl font-bold text-secondary transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
          >
            -
          </button>
          
          <input
            type="number"
            min="1"
            max={availableStock}
            value={quantity}
            onChange={handleInputChange}
            className="input-field h-12 flex-1 text-center text-lg font-black"
          />
          
          <button
            type="button"
            onClick={() => numQuantity < availableStock && setQuantity(numQuantity + 1)}
            disabled={numQuantity >= availableStock}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-gray-200 text-xl font-bold text-secondary transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
          >
            +
          </button>
        </div>
        <p className="mt-1.5 text-xs text-muted">
          می‌توانید عدد را مستقیماً تایپ کنید یا از دکمه‌ها استفاده کنید.
        </p>
      </div>

      <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted">قیمت هر متر مربع (درجه {selectedGrade}):</span>
          <span className="font-bold text-secondary">{formatPrice(finalUnitPrice)} تومان</span>
        </div>
        <div className="flex items-center justify-between text-base border-t border-gray-200 pt-2 mt-2">
          <span className="font-bold text-secondary">مبلغ کل:</span>
          <span className="font-black text-primary">{formatPrice(totalPrice)} تومان</span>
        </div>
      </div>
      
      <button
        onClick={handleOrder}
        disabled={loading || numQuantity < 1 || availableStock === 0}
        className="btn-primary w-full py-4 text-base md:text-lg disabled:opacity-50"
      >
        {loading ? "در حال ثبت سفارش..." : "🛒 ثبت سفارش"}
      </button>
      
      {message && (
        <div className={`rounded-xl p-3 text-center text-sm font-medium ${message.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
}