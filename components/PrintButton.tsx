"use client";

export default function PrintButton({ text = "چاپ پیش‌فاکتور" }: { text?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary px-8 py-3 text-sm flex items-center gap-2"
    >
      <span>🖨️</span>
      <span>{text}</span>
    </button>
  );
}