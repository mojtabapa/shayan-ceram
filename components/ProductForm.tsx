"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  
  const [stocks, setStocks] = useState({
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0
  });

  const [discounts, setDiscounts] = useState({
    grade2: 10, grade3: 20, grade4: 30, grade5: 40, grade6: 50
  });

  const handleStockChange = (grade: string, val: number) => {
    setStocks(prev => ({ ...prev, [grade]: val }));
  };

  const handleDiscountChange = (grade: string, val: number) => {
    setDiscounts(prev => ({ ...prev, [grade]: val }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!width || !length) {
      setError("لطفاً عرض و طول را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const data = {
      code: formData.get("code"),
      name: formData.get("name"),
      brand: formData.get("brand"),
      glaze: formData.get("glaze"),
      bodyMaterial: formData.get("bodyMaterial"),
      size: `${width}×${length}`,
      price: Number(formData.get("price")),
      minStock: Number(formData.get("minStock")),
      discountPercent: Number(formData.get("discountPercent")),
      stock: stocks,
      grade2Discount: Number(discounts.grade2),
      grade3Discount: Number(discounts.grade3),
      grade4Discount: Number(discounts.grade4),
      grade5Discount: Number(discounts.grade5),
      grade6Discount: Number(discounts.grade6),
      published: true,
      imageUrl: "/images/logo.png",
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "خطایی رخ داد");
        setLoading(false);
        return;
      }
      router.push("/panel/products");
      router.refresh();
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">کد محصول</label>
          <input name="code" required placeholder="مثلاً: M1001" className="input-field text-left" dir="ltr" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">نام طرح (محصول)</label>
          <input name="name" required placeholder="مثلاً: مرمر" className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">برند</label>
          <input name="brand" placeholder="مثلاً: شایان" className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">لعاب</label>
          <input name="glaze" placeholder="مثلاً: مات یا براق" className="input-field" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-secondary">جنس بدنه</label>
          <input name="bodyMaterial" placeholder="مثلاً: خاک قرمز یا پرسلان" className="input-field" />
        </div>
        
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-secondary">سایز (سانتی‌متر)</label>
          <div className="flex items-center gap-3">
            <input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="عرض" required type="number" className="input-field text-left flex-1" />
            <span className="text-2xl font-bold text-muted">×</span>
            <input value={length} onChange={(e) => setLength(e.target.value)} placeholder="طول" required type="number" className="input-field text-left flex-1" />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-secondary">موجودی به تفکیک درجه (متر مربع)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(g => (
              <div key={g} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <span className="text-sm font-bold text-secondary w-14">درجه {g}</span>
                <input 
                  type="number" 
                  min="0" 
                  value={stocks[g as unknown as keyof typeof stocks]} 
                  onChange={(e) => handleStockChange(g.toString(), Number(e.target.value))}
                  className="input-field text-left py-1 px-2 h-9" 
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 border-t pt-4 mt-2">
          <label className="mb-2 block text-sm font-bold text-secondary">درصد کاهش قیمت نسبت به درجه ۱ (برای درجات ۲ تا ۶)</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[2, 3, 4, 5, 6].map(g => (
              <div key={g} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-secondary w-14">درجه {g}</span>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={discounts[`grade${g}` as unknown as keyof typeof discounts]} 
                  onChange={(e) => handleDiscountChange(`grade${g}`, Number(e.target.value))}
                  className="input-field text-left py-1 px-2 h-9" 
                  dir="ltr"
                />
                <span className="text-xs text-muted">%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">قیمت پایه درجه ۱ (تومان)</label>
          <input name="price" type="number" required min="0" placeholder="450000" className="input-field text-left" dir="ltr" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">حداقل موجودی کل (هشدار)</label>
          <input name="minStock" type="number" required min="0" defaultValue="100" className="input-field text-left" dir="ltr" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-secondary">درصد تخفیف ویژه (۰ تا ۱۰۰)</label>
          <input name="discountPercent" type="number" required min="0" max="100" defaultValue="0" className="input-field text-left" dir="ltr" />
        </div>
      </div>

      {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">⚠️ {error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary px-8 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : "ذخیره محصول"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-xl border-2 border-gray-200 px-6 py-2.5 text-sm font-bold text-secondary hover:bg-gray-50">
          انصراف
        </button>
      </div>
    </form>
  );
}