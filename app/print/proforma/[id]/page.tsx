import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import PrintButton from "@/components/PrintButton";

export default async function ProformaPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      dealer: { include: { user: true } },
      product: true,
    },
  });

  if (!order) notFound();

  // ============ محاسبات مالی دقیق ============
  
  // ۱. قیمت واحد (همون قیمت نهایی که مشتری توی کاتالوگ دیده و سفارش داده)
  const unitPrice = order.total / order.quantity;

  // ۲. مبلغ کل بدون مالیات (قیمت واحد × تعداد)
  const subtotal = order.total; 
  
  // ۳. مالیات ۱۰٪
  const vatAmount = subtotal * 0.1;
  
  // ۴. مبلغ نهایی (با مالیات)
  const finalTotal = subtotal + vatAmount;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center print:bg-white print:p-0">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg print:shadow-none print:rounded-none">
        
        {/* هدر فاکتور */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoPath} alt={siteConfig.brandName} className="h-16 w-auto" />
            <div>
              <h1 className="text-xl font-black text-secondary">{siteConfig.brandName}</h1>
              <p className="text-xs text-muted">{siteConfig.address}</p>
              <p className="text-xs text-muted" dir="ltr">{siteConfig.contactPhone1} - {siteConfig.contactMobile}</p>
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-black text-primary">پیش‌فاکتور</h2>
            <p className="text-xs text-muted mt-1">تاریخ: {new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
            <p className="text-xs text-muted">شماره: {order.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        {/* اطلاعات مشتری و فروشنده */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-secondary mb-2 border-b border-gray-200 pb-1">خریدار</h3>
            <p><span className="text-muted">نام:</span> <span className="font-bold">{order.dealer.user.name}</span></p>
            <p><span className="text-muted">شرکت:</span> {order.dealer.company}</p>
            <p><span className="text-muted">موبایل:</span> <span dir="ltr">{order.dealer.user.phone}</span></p>
            <p><span className="text-muted">کد ملی:</span> <span dir="ltr">{order.dealer.nationalId}</span></p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-secondary mb-2 border-b border-gray-200 pb-1">فروشنده</h3>
            <p><span className="text-muted">نام:</span> <span className="font-bold">{siteConfig.brandName}</span></p>
            <p><span className="text-muted">آدرس:</span> {siteConfig.addressShort}</p>
            <p><span className="text-muted">تلفن:</span> <span dir="ltr">{siteConfig.contactPhone1}</span></p>
          </div>
        </div>

        {/* جدول اقلام (بدون تخفیف، چون قیمت واحد خودش با تخفیف حساب شده) */}
        <table className="w-full text-right text-sm mb-6 border-collapse">
          <thead>
            <tr className="bg-secondary-dark text-white">
              <th className="p-2 rounded-r-lg">ردیف</th>
              <th className="p-2">شرح کالا</th>
              <th className="p-2">سایز</th>
              <th className="p-2">درجه</th>
              <th className="p-2">تعداد (متر مربع)</th>
              <th className="p-2">قیمت واحد (تومان)</th>
              <th className="p-2 rounded-l-lg">مبلغ کل (تومان)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="p-3 text-center">۱</td>
              <td className="p-3 font-bold text-secondary">{order.product.name}</td>
              <td className="p-3 text-muted">{order.product.size}</td>
              <td className="p-3 text-muted">درجه {order.grade}</td>
              <td className="p-3 text-center font-bold">{order.quantity.toLocaleString("fa-IR")}</td>
              <td className="p-3 text-muted">{Math.round(unitPrice).toLocaleString("fa-IR")}</td>
              <td className="p-3 font-bold text-primary">{subtotal.toLocaleString("fa-IR")}</td>
            </tr>
          </tbody>
        </table>

        {/* جمع‌بندی مالی */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted">جمع کل (قبل از مالیات):</span>
              <span className="font-bold">{subtotal.toLocaleString("fa-IR")}</span>
            </div>

            <div className="flex justify-between items-center text-blue-600 border-b border-gray-200 pb-2">
              <span>مالیات بر ارزش افزوده (۱۰٪):</span>
              <span className="font-bold">+ {vatAmount.toLocaleString("fa-IR")}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-secondary">مبلغ قابل پرداخت:</span>
              <span className="text-lg font-black text-primary">{finalTotal.toLocaleString("fa-IR")} تومان</span>
            </div>
          </div>
        </div>

        {/* فوتر */}
        <div className="border-t border-gray-200 pt-4 text-center text-xs text-muted">
          <p>این پیش‌فاکتور به منزله فاکتور رسمی نیست و فقط جهت اطلاع از مبالغ صادر شده است.</p>
          <p className="mt-1">جهت هرگونه هماهنگی با شماره {siteConfig.contactMobileDisplay} تماس حاصل فرمایید.</p>
          <p className="mt-2 font-bold">{siteConfig.brandName} - {siteConfig.slogan}</p>
        </div>

        {/* دکمه چاپ */}
        <div className="mt-8 flex justify-center print:hidden">
          <PrintButton />
        </div>
      </div>
    </div>
  );
}