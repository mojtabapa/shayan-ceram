import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "SALES_MANAGER", "WAREHOUSE"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    
    const existing = await prisma.product.findUnique({ where: { code: body.code } });
    if (existing) {
      return NextResponse.json({ error: "کد محصول تکراری است" }, { status: 400 });
    }

    await prisma.product.create({
      data: {
        code: body.code,
        name: body.name,
        size: body.size,
        imageUrl: body.imageUrl,
        price: body.price,
        stock: body.stock,
        minStock: body.minStock,
        discountPercent: body.discountPercent,
        published: body.published,
        brand: body.brand || null,
        glaze: body.glaze || null,
        bodyMaterial: body.bodyMaterial || null,
        grade2Discount: body.grade2Discount || 10,
        grade3Discount: body.grade3Discount || 20,
        grade4Discount: body.grade4Discount || 30,
        grade5Discount: body.grade5Discount || 40,
        grade6Discount: body.grade6Discount || 50,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}