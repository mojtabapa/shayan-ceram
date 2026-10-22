"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCheckPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // آپلود عکس
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setImageUrl(data.url);
      else setError(data.error);
    } catch (err) {
      setError("خطا در آپلود عکس");
    } finally {
      setUploading(false);
    }
  }

  // ثبت چک (با استعلام)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) return setError("لطفاً تصویر چک را آپلود کنید");
    
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const dueDate = formData.get("dueDate");

    try {
      // ۱. اول استعلام می‌کنیم
      const inquiryRes = await fetch("/api/check-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, amount }),
      });

      const inquiryData = await inquiryRes.json();

      if (!inquiryRes.ok || !inquiryData.success) {
        // اگر استعلام رد شد، ثبت نمی‌کنیم
        setError(inquiryData.message || "استعلام چک با شکست مواجه شد.");
        setLoading(false);
        return;
      }

      // ۲. اگر استعلام اوکی بود، ثبت می‌کنیم
      const res = await fetch("/api/checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, dueDate, imageUrl }),
      });

      if (res.ok) {
        setSuccess("✅ استعلام موفق بود و چک ثبت شد. در حال انتقال...");
        setTimeout(() => {
          router.push("/panel/checks");
          router.refresh();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">💳 ثبت چک جدید</h1>
        <p className="mt-1 text-sm text-muted">ابتدا تصویر چک را آپلود کرده و سپس ثبت کنید. چک شما به صورت خودکار استعلام می‌شود.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
        
        {/* آپلود عکس */}
        <div>
          <label className="mb-2 block text-sm font-bold text-secondary">تصویر چک</label>
          <div className="flex items-center gap-4">
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="پیش‌نمایش" className="h-20 w-32 rounded-lg object-cover border" />
            )}
            <label className="cursor-pointer rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary">
              {uploading ? "در حال آپلود..." : "📸 انتخاب عکس چک"}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">مبلغ چک (تومان)</label>
          <input name="amount" type="number" required min="1" placeholder="مثلاً 50000000" className="input-field text-left" dir="ltr" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-secondary">تاریخ سررسید</label>
          <input name="dueDate" type="date" required className="input-field text-left" dir="ltr" />
        </div>

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">⚠️ {error}</div>}
        {success && <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">{success}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading || uploading} className="btn-primary px-8 py-3 disabled:opacity-50">
            {loading ? "در حال استعلام..." : "🔍 استعلام و ثبت چک"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-bold text-secondary hover:bg-gray-50">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}