import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { otpCode } = body;

    // چک کد OTP
    const otp = await prisma.otp.findUnique({ where: { userId: user.id } });

    if (!otp || otp.expiresAt < new Date() || otp.attempts >= 5) {
      return NextResponse.json({ error: "کد منقضی شده یا تلاش بیش از حد" }, { status: 400 });
    }

    if (otp.codeHash !== otpCode) {
      await prisma.otp.update({
        where: { userId: user.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json({ error: "کد وارد شده اشتباه است" }, { status: 400 });
    }

    // پاک کردن OTP پس از استفاده
    await prisma.otp.delete({ where: { userId: user.id } });

    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer) return NextResponse.json({ error: "نماینده یافت نشد" }, { status: 404 });

    // ساخت قرارداد جدید
    const contract = await prisma.contract.create({
      data: {
        dealerId: dealer.id,
        version: "1.0",
        approved: true,
        signature: {
          create: {
            imageData: "signed-digitally", // فعلاً به صورت دیجیتال
            otpVerified: true,
            ip: req.headers.get("x-forwarded-for") || "unknown",
            deviceHash: "web-browser",
            clausesAccepted: { all: true },
            readSeconds: 120,
          },
        },
      },
    });

    return NextResponse.json({ success: true, contractId: contract.id });
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}