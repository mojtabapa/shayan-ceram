import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || user.role !== "DEALER") {
      return NextResponse.json({ error: "فقط نمایندگان می‌توانند سفارش ثبت کنند" }, { status: 403 });
    }

    const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (!dealer || dealer.status !== "ACTIVE") {
      return NextResponse.json({ error: "حساب نمایندگی شما فعال نیست" }, { status: 403 });
    }

    const body = await req.json();
    const { productId, grade, quantity } = body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });

    const stockObj = typeof product.stock === "object" && product.stock !== null ? product.stock : {};
    const availableStock = Number(stockObj[grade]) || 0;

    if (availableStock < quantity) {
      return NextResponse.json({ error: "موجودی کافی برای این درجه وجود ندارد" }, { status: 400 });
    }

    let gradeDiscount = 0;
    if (grade === "2") gradeDiscount = product.grade2Discount;
    if (grade === "3") gradeDiscount = product.grade3Discount;
    if (grade === "4") gradeDiscount = product.grade4Discount;
    if (grade === "5") gradeDiscount = product.grade5Discount;
    if (grade === "6") gradeDiscount = product.grade6Discount;

    const basePriceWithSpecialDiscount = product.price - (product.price * product.discountPercent / 100);
    const finalUnitPrice = basePriceWithSpecialDiscount - (basePriceWithSpecialDiscount * gradeDiscount / 100);
    const total = Math.round(finalUnitPrice * quantity);

    await prisma.order.create({
      data: {
        dealerId: dealer.id,
        productId,
        quantity,
        grade,
        total,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}