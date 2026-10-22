import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, company, nationalId, username, password } = body;

    // اعتبارسنجی
    if (!name || !phone || !company || !nationalId || !username || !password) {
      return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "رمز عبور باید حداقل ۸ کاراکتر باشد" }, { status: 400 });
    }

    // چک تکراری بودن نام کاربری
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: "این نام کاربری قبلاً استفاده شده است" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ایجاد کاربر و نماینده در یک تراکنش
    await prisma.user.create({
      data: {
        username,
        name,
        phone,
        passwordHash,
        role: "DEALER",
        dealer: {
          create: {
            company,
            nationalId,
            status: "PENDING",
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: "ثبت‌نام با موفقیت انجام شد" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}