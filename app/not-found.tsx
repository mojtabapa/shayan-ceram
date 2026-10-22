import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center bg-bglight px-4 py-16">
        <div className="text-center">
          <div className="mb-6 text-8xl">🔍</div>
          <h1 className="mb-3 text-4xl font-black text-secondary md:text-5xl">
            ۴۰۴
          </h1>
          <h2 className="mb-3 text-xl font-bold text-secondary md:text-2xl">
            صفحه مورد نظر پیدا نشد
          </h2>
          <p className="mb-8 text-sm text-muted md:text-base">
            ممکنه آدرس اشتباه باشه یا صفحه حذف شده باشه
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:bg-primary-dark hover:-translate-y-0.5"
            >
              <span>🏠</span>
              <span>بازگشت به خانه</span>
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-secondary px-6 py-3.5 font-bold text-secondary transition-all hover:bg-secondary hover:text-white"
            >
              <span>🛍️</span>
              <span>مشاهده محصولات</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}