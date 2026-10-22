"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InventoryUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage("");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      
      try {
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csvData: text }),
        });

        const data = await res.json();
        
        if (res.ok) {
          setMessage(`✅ ${data.message}`);
          router.refresh();
          setFile(null);
        } else {
          setMessage(`⚠️ ${data.error}`);
        }
      } catch (error) {
        setMessage("⚠️ خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-secondary">📤 بروزرسانی گروهی موجودی</h3>
      <p className="mb-4 text-sm text-muted">
        فایل اکسل (CSV) خود را با دو ستون <strong>«کد محصول»</strong> و <strong>«موجودی جدید»</strong> آپلود کنید.
      </p>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-secondary file:mr-4 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-primary hover:file:bg-primary/20"
        />
        
        <button
          type="submit"
          disabled={!file || loading}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {loading ? "در حال آپلود..." : "آپلود و بروزرسانی"}
        </button>
      </form>

      {message && (
        <div className={`mt-4 rounded-xl p-3 text-center text-sm font-medium ${message.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
}