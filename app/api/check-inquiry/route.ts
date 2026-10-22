import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { imageUrl, amount } = body;

    if (!imageUrl || !amount) {
      return NextResponse.json({ error: "اطلاعات چک ناقص است" }, { status: 400 });
    }

    // 🔌 اینجا بعداً به سرویس شاهکار وصل میشیم
    // الان یه شبیه‌سازی (Mock) می‌کنیم:
    // اگر مبلغ چک به عدد 13 ختم بشه، فرض می‌کنیم چک برگشتی است
    // در غیر این صورت، استعلام موفق است

    const isBounced = amount.toString().endsWith("13");
    
    // شبیه‌سازی تاخیر شبکه (1.5 ثانیه)
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isBounced) {
      return NextResponse.json({ 
        success: false, 
        message: "❌ استعلام چک با شکست مواجه شد. این چک دارای سابقه برگشت است و قابل ثبت نیست." 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "✅ استعلام چک موفق بود. چک در سیستم ثبت شد." 
    });

  } catch (error) {
    return NextResponse.json({ error: "خطای سرور در استعلام چک" }, { status: 500 });
  }
}