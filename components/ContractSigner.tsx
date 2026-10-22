"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContractSigner() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: خواندن، 2: تایید متن، 3: OTP
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // متن قرارداد
  const clauses = [
    { title: "موضوع قرارداد", body: "نماینده متعهد می‌شود محصولات کاشی کارخانه را در محدوده توافق‌شده عرضه و بفروشد و کارخانه محصول را با کیفیت اعلام‌شده تحویل دهد." },
    { title: "مدت قرارداد", body: "قرارداد از تاریخ امضا به مدت یک سال شمسی معتبر است و در صورت رضایت طرفین قابل تمدید است." },
    { title: "قیمت و تخفیف", body: "قیمت‌ها طبق لیست رسمی کارخانه است. هرگونه تخفیف فقط با تایید کتبی مدیر فروش معتبر است." },
    { title: "پرداخت و چک", body: "پرداخت‌ها نقدی یا با چک صیادی معتبر انجام می‌شود. چک برگشتی موجب تعلیق فوری سفارش‌های جدید می‌شود." },
    { title: "تحویل کالا", body: "کالا پس از تایید سفارش و تسویه شرایط مالی بارگیری می‌شود و گیرنده موظف است تحویل را تایید کند." },
    { title: "کیفیت و مرجوعی", body: "ایرادات کیفی ظرف هفت روز از تحویل و با ارائه تصویر و شماره بچ اعلام می‌شود. کالای نصب‌شده قابل مرجوع نیست." },
    { title: "محدوده فعالیت", body: "نماینده فقط در منطقه تعیین‌شده حق عرضه دارد و نباید با نام کارخانه تبلیغ گمراه‌کننده انجام دهد." },
    { title: "محرمانگی", body: "اطلاعات قیمت، مشتریان و شرایط تجاری محرمانه است و افشای آن ممنوع است." },
    { title: "فسخ و تعلیق", body: "در صورت نقض تعهدات، کارخانه می‌تواند همکاری را تعلیق یا فسخ کند و مانده حساب‌ها باید تسویه شود." },
    { title: "حل اختلاف", body: "اختلافات ابتدا از راه مذاکره و در صورت عدم توافق از طریق مراجع قضایی صالح محل کارخانه حل می‌شود." },
  ];

  async function handleSendOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contracts/otp", { method: "POST" });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setError(data.error || "خطا در ارسال کد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otpCode.length !== 6) {
      setError("کد پیامک شده باید ۶ رقم باشد");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contracts/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpCode }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setError(data.error || "کد وارد شده اشتباه است");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center shadow-sm">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-green-700 mb-2">قرارداد با موفقیت امضا شد!</h2>
        <p className="text-sm text-green-600">در حال به‌روزرسانی صفحه...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
      
      {/* مرحله ۱: خواندن متن */}
      {step === 1 && (
        <>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
            {clauses.map((clause, i) => (
              <div key={i} className="space-y-1">
                <h4 className="text-sm font-bold text-secondary">{i + 1}. {clause.title}</h4>
                <p className="text-sm text-muted leading-relaxed text-justify">{clause.body}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="btn-primary w-full py-3">
            متن را خوانده‌ام و موافقم
          </button>
        </>
      )}

      {/* مرحله ۲: تایید */}
      {step === 2 && (
        <div className="text-center space-y-4 py-8">
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-lg font-bold text-secondary">آماده امضای قرارداد هستید؟</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            با کلیک روی دکمه زیر، یک کد تایید ۶ رقمی به شماره موبایل شما ارسال می‌شود. با وارد کردن آن، قرارداد شما امضا شده و معتبر خواهد بود.
          </p>
          <button onClick={handleSendOtp} disabled={loading} className="btn-primary px-8 py-3 disabled:opacity-50">
            {loading ? "در حال ارسال کد..." : "ارسال کد تایید"}
          </button>
          <button onClick={() => setStep(1)} className="text-sm text-muted hover:text-primary block mx-auto mt-2">
            بازگشت به متن قرارداد
          </button>
        </div>
      )}

      {/* مرحله ۳: وارد کردن OTP */}
      {step === 3 && (
        <div className="text-center space-y-4 py-8">
          <div className="text-5xl mb-4">📱</div>
          <h3 className="text-lg font-bold text-secondary">کد تایید را وارد کنید</h3>
          <p className="text-sm text-muted">کد ۶ رقمی به شماره موبایل شما ارسال شد.</p>
          
          <div className="max-w-xs mx-auto">
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="------"
              className="input-field text-center text-2xl font-black tracking-[0.5em]"
              dir="ltr"
            />
          </div>

          <button onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 6} className="btn-primary px-8 py-3 disabled:opacity-50">
            {loading ? "در حال تایید..." : "تایید و امضای نهایی"}
          </button>
        </div>
      )}

      {error && <div className="rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-700">⚠️ {error}</div>}
    </div>
  );
}