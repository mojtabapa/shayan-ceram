import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// آپدیت کامل (مثل قیمت و درصدهای درجه)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "SALES_MANAGER", "WAREHOUSE"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    
    await prisma.product.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// تغییر وضعیت انتشار
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "SALES_MANAGER", "WAREHOUSE"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    
    await prisma.product.update({
      where: { id: params.id },
      data: { published: body.published },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

// حذف محصول
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "SALES_MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در حذف محصول. ممکن است این محصول در سفارشات استفاده شده باشد." }, { status: 500 });
  }
}