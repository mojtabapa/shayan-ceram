"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [price, setPrice] = useState<string>(product.price > 0 ? product.price.toString() : "");
  
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [aiLayoutImageUrl, setAiLayoutImageUrl] = useState(product.aiLayoutImageUrl || "");
  const [liveImageUrl, setLiveImageUrl] = useState(product.liveImageUrl || "");

  const [discounts, setDiscounts] = useState({
    grade2: product.grade2Discount, 
    grade3: product.grade3Discount, 
    grade4: product.grade4Discount, 
    grade5: product.grade5Discount, 
    grade6: product.grade6Discount
  });

  const handleDiscountChange = (grade: string, val: number) => {
    setDiscounts(prev => ({ ...prev, [grade]: val }));
  };

  const uploadImage = async (file: File, setUrl: (url: string) => void, setUploading: (val: boolean) => void) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setUrl(data.url);
      else setError(data.error);
    } catch (err) {
      setError("خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  };

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingAi, setUploadingAi] = useState(false);
  const [uploadingLive, setUploadingLive] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      setError("لطفاً قیمت را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number(price),
          imageUrl,
          aiLayoutImageUrl,
          liveImageUrl,
          grade2Discount: Number(discounts.grade2),
          grade3Discount: Number(discounts.grade3),
          grade4Discount: Number(discounts.grade4),
          grade5Discount: Number(discounts.grade5),
          grade6Discount: Number(discounts.grade6),
          published: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در ذخیره");
      }
      
      router.push("/panel/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* بخش آپلود عکس‌ها */}
      <div className="grid gap-6 sm:grid-cols-3 border-b pb-6">
        
        {/* عکس کاتالوگی */}
        <div>
          <label className="mb-2 block text-sm font-bold text-secondary">عکس کاتالوگی (اصلی)</label>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl text-muted">🖼️</div>
              )}
            </div>
            <label className="w-full cursor-pointer rounded-xl border-2 border-gray-200 py-2 text-center text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary">
              {uploadingMain ? "در حال آپلود..." : "انتخاب عکس"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setImageUrl, setUploadingMain)} />
            </label>
          </div>
        </div>

        {/* عکس چیدمان AI */}
        <div>
          <label className="mb-2 block text-sm font-bold text-secondary">عکس چیدمان (AI)</label>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
              {aiLayoutImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aiLayoutImageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl text-muted">🎨</div>
              )}
            </div>
            <label className="w-full cursor-pointer rounded-xl border-2 border-gray-200 py-2 text-center text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary">
              {uploadingAi ? "در حال آپلود..." : "انتخاب عکس"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setAiLayoutImageUrl, setUploadingAi)} />
            </label>
          </div>
        </div>

        {/* عکس زنده */}
        <div>
          <label className="mb-2 block text-sm font-bold text-secondary">عکس زنده (واقعی)</label>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
              {liveImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={liveImageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl text-muted">📸</div>
              )}
            </div>
            <label className="w-full cursor-pointer rounded-xl border-2 border-gray-200 py-2 text-center text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary">
              {uploadingLive ? "در حال آپلود..." : "انتخاب عکس"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setLiveImageUrl, setUploadingLive)} />
            </label>
          </div>
        </div>

      </div>

      {/* قیمت */}
      <div>
        <label className="mb-1.5 block text-sm font-bold text-secondary">قیمت پایه درجه ۱ (تومان)</label>
        <input type="number" required min="1" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="مثلاً 450000" className="input-field text-left" dir="ltr" />
      </div>

      {/* درصد درجات */}
      <div className="border-t pt-4 mt-2">
        <label className="mb-2 block text-sm font-bold text-secondary">درصد کاهش قیمت نسبت به درجه ۱ (برای درجات ۲ تا ۶)</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[2, 3, 4, 5, 6].map(g => (
            <div key={g} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-secondary w-14">درجه {g}</span>
              <input type="number" min="0" max="100" value={discounts[`grade${g}` as unknown as keyof typeof discounts]} onChange={(e) => handleDiscountChange(`grade${g}`, Number(e.target.value))} className="input-field text-left py-1 px-2 h-9" dir="ltr" />
              <span className="text-xs text-muted">%</span>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">⚠️ {error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading || uploadingMain || uploadingAi || uploadingLive} className="btn-primary px-8 disabled:opacity-50">
          {loading ? "در حال ذخیره..." : "ذخیره و انتشار"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-xl border-2 border-gray-200 px-6 py-2.5 text-sm font-bold text-secondary hover:bg-gray-50">
          انصراف
        </button>
      </div>
    </form>
  );
}