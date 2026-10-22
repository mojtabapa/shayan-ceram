import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    // ساخت کد ۶ رقمی
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // اعتبار ۲ دقیقه

    // ذخیره در دیتابیس (برای سادگی، فعلاً روی OTP)
    await prisma.otp.upsert({
      where: { userId: user.id },
      update: { codeHash: otpCode, expiresAt, attempts: 0 },
      create: { userId: user.id, codeHash: otpCode, expiresAt, attempts: 0 },
    });

    // شبیه‌سازی ارسال پیامک (در کنسول چاپ می‌شود)
    console.log(`\n📱 [SMS Mock] کد تایید برای ${user.name}: ${otpCode}\n`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}