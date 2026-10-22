import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ثبت چک جدید (توسط نماینده)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "فقط نمایندگان می‌توانند چک ثبت کنند" }, { status: 403 });
    }

    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer || dealer.status !== "ACTIVE") {
      return NextResponse.json({ error: "حساب نمایندگی شما فعال نیست" }, { status: 403 });
    }

    const body = await req.json();
    
    await prisma.check.create({
      data: {
        dealerId: dealer.id,
        amount: Number(body.amount),
        dueDate: new Date(body.dueDate),
        imageUrl: body.imageUrl,
        status: "RECEIVED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// تغییر وضعیت چک (توسط حسابدار)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "ACCOUNTING"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { checkId, status } = body;

    if (!checkId || !["CLEARED", "BOUNCED"].includes(status)) {
      return NextResponse.json({ error: "اطلاعات نامعتبر" }, { status: 400 });
    }

    await prisma.check.update({
      where: { id: checkId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}