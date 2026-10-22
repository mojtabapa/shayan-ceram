import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    // فقط مدیرعامل و مدیر فروش اجازه دارن
    if (!user || !["CEO", "SALES_MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { dealerId, status } = body;

    if (!dealerId || !["ACTIVE", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "اطلاعات نامعتبر" }, { status: 400 });
    }

    await prisma.dealer.update({
      where: { id: dealerId },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}