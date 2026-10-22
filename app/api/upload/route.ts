import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!user || !["CEO", "SALES_MANAGER", "WAREHOUSE"].includes(user.role)) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "فایلی ارسال نشده" }, { status: 400 });
    }

    // بررسی فرمت عکس
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "فرمت عکس مجاز نیست (فقط JPG, PNG, WEBP)" }, { status: 400 });
    }

    // بررسی حجم فایل (حداکثر ۲ مگابایت)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم عکس نباید بیشتر از ۲ مگابایت باشد" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ساخت نام یکتا برای عکس
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `product-${Date.now()}.${ext}`;
    
    // مسیر ذخیره (public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // اطمینان از وجود پوشه
    await mkdir(uploadDir, { recursive: true });
    
    // ذخیره فایل
    await writeFile(path.join(uploadDir, fileName), buffer);

    // برگرداندن آدرس عکس برای ذخیره در دیتابیس
    return NextResponse.json({ url: `/uploads/${fileName}` });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در آپلود عکس" }, { status: 500 });
  }
}