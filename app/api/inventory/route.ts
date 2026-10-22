import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "WAREHOUSE"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { csvData } = body;

    if (!csvData) return NextResponse.json({ error: "داده‌ای یافت نشد" }, { status: 400 });

    const lines = csvData.trim().split(/\r?\n/);
    const headers = lines[0].split(/[,;\t]/).map((h: string) => h.trim().toLowerCase());
    
    const codeIndex = headers.findIndex((h: string) => h.includes("کد"));
    const planNameIndex = headers.findIndex((h: string) => h.includes("نام طرح") || h.includes("طرح"));
    const brandIndex = headers.findIndex((h: string) => h.includes("برند"));
    const glazeIndex = headers.findIndex((h: string) => h.includes("لعاب"));
    const sizeIndex = headers.findIndex((h: string) => h.includes("سایز"));
    const bodyIndex = headers.findIndex((h: string) => h.includes("جنس بدنه") || h.includes("بدنه"));
    
    if (codeIndex === -1) {
      return NextResponse.json({ error: "ستون «کد» در فایل پیدا نشد" }, { status: 400 });
    }

    const gradeIndices: Record<string, number> = {};
    for (let g = 1; g <= 6; g++) {
      const idx = headers.findIndex((h: string) => 
        h.includes(`موجودی درجه ${g}`) || 
        h.includes(`درجه ${g}`) ||
        h.includes(`grade ${g}`) ||
        h === `${g}`
      );
      if (idx !== -1) gradeIndices[g.toString()] = idx;
    }

    if (Object.keys(gradeIndices).length === 0) {
      return NextResponse.json({ error: "هیچ ستونی برای موجودی درجه‌ها پیدا نشد" }, { status: 400 });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; 

      const cols = line.split(/[,;\t]/).map((c: string) => c.trim());
      const code = cols[codeIndex];

      if (code) {
        const newStock: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 };
        for (const [gradeStr, colIdx] of Object.entries(gradeIndices)) {
          const val = parseInt(cols[colIdx], 10);
          if (!isNaN(val)) newStock[gradeStr] = val;
        }

        const planName = planNameIndex !== -1 ? cols[planNameIndex] : "نامشخص";
        const brand = brandIndex !== -1 ? cols[brandIndex] : "نامشخص";
        const glaze = glazeIndex !== -1 ? cols[glazeIndex] : "نامشخص";
        const size = sizeIndex !== -1 ? cols[sizeIndex] : "نامشخص";
        const bodyMaterial = bodyIndex !== -1 ? cols[bodyIndex] : "نامشخص";

        const existingProduct = await prisma.product.findUnique({ where: { code } });

        if (existingProduct) {
          await prisma.product.update({
            where: { code },
            data: { 
              stock: newStock as any,
              name: planName !== "نامشخص" ? planName : existingProduct.name,
              brand: brand !== "نامشخص" ? brand : existingProduct.brand,
              glaze: glaze !== "نامشخص" ? glaze : existingProduct.glaze,
              size: size !== "نامشخص" ? size : existingProduct.size,
              bodyMaterial: bodyMaterial !== "نامشخص" ? bodyMaterial : existingProduct.bodyMaterial,
            },
          });
          updatedCount++;
        } else {
          await prisma.product.create({
            data: {
              code,
              name: planName !== "نامشخص" ? planName : "محصول جدید",
              brand: brand !== "نامشخص" ? brand : null,
              glaze: glaze !== "نامشخص" ? glaze : null,
              size: size !== "نامشخص" ? size : "نامشخص",
              bodyMaterial: bodyMaterial !== "نامشخص" ? bodyMaterial : null,
              price: 0,
              minStock: 100,
              published: true, // 👈 این تغییر کرد! حالا محصول جدیدمستقیماً منتشر میشه
              stock: newStock as any,
              imageUrl: "/images/logo.png",
            },
          });
          createdCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `تعداد ${updatedCount} محصول آپدیت شد و تعداد ${createdCount} محصول جدید ساخته و منتشر شد.`
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطای سرور در پردازش فایل" }, { status: 500 });
  }
}