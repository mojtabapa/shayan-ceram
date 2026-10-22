"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { siteConfig } from "@/config/site.config";
import { useState } from "react";

interface PanelSidebarProps {
  user: {
    name: string;
    role: string;
  };
}

export default function PanelSidebar({ user }: PanelSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // منوهای اختصاصی بر اساس نقش
  const menuItems = [
    { href: "/panel", label: "داشبورد", icon: "📊", roles: ["CEO", "SALES_MANAGER", "SALES_STAFF", "WAREHOUSE", "ACCOUNTING", "DESIGNER", "DEALER"] },
    { href: "/panel/products", label: "مدیریت محصولات", icon: "📦", roles: ["CEO", "SALES_MANAGER", "WAREHOUSE"] },
    { href: "/panel/inventory", label: "انبار", icon: "🏭", roles: ["CEO", "WAREHOUSE"] },
    { href: "/panel/orders", label: "همه سفارش‌ها", icon: "🚚", roles: ["CEO", "SALES_MANAGER", "SALES_STAFF", "WAREHOUSE"] },
    
    // منوی اختصاصی نماینده
    { href: "/panel/my-orders", label: "سفارش‌های من", icon: "📦", roles: ["DEALER"] },
    { href: "/panel/contract", label: "قرارداد من", icon: "📝", roles: ["DEALER"] },
    { href: "/panel/checks", label: "چک‌های من", icon: "💰", roles: ["DEALER"] },
    
    { href: "/panel/dealers", label: "نمایندگان", icon: "👥", roles: ["CEO", "SALES_MANAGER"] },
    { href: "/panel/finance", label: "مالی و چک‌ها", icon: "💰", roles: ["CEO", "ACCOUNTING"] },
    { href: "/catalog", label: "مشاهده کاتالوگ", icon: "🛍️", roles: ["CEO", "SALES_MANAGER", "SALES_STAFF", "WAREHOUSE", "ACCOUNTING", "DESIGNER", "DEALER"] },
  ];

  const allowedMenus = menuItems.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {/* هدر و منوی موبایل */}
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white p-4 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img src={siteConfig.logoPath} alt="" className="h-8 w-auto" />
            <div className="text-sm font-bold text-secondary">{siteConfig.brandNameShort}</div>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg border-2 border-gray-200 p-2 text-secondary">
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-b border-gray-100 bg-white p-3 absolute w-full z-10 shadow-md">
            <nav className="flex flex-col space-y-1">
              {allowedMenus.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    pathname === item.href ? "bg-primary/10 font-bold text-primary" : "text-secondary hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="mt-2 flex w-full items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600">
                <span className="text-lg">🚪</span>
                <span>خروج از حساب</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* سایدبار دسکتاپ */}
      <aside className="hidden w-64 flex-col border-l border-gray-100 bg-white shadow-sm h-screen sticky top-0 md:flex shrink-0">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5">
          <img src={siteConfig.logoPath} alt="" className="h-10 w-auto" />
          <div>
            <div className="text-sm font-bold text-secondary">{siteConfig.brandNameShort}</div>
            <div className="text-[10px] text-muted">پنل کاربری</div>
          </div>
        </div>

        <div className="border-b border-gray-100 p-5 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-bold text-secondary">{user.name}</div>
              <div className="text-xs text-muted mt-0.5">
                {user.role === "CEO" && "مدیرعامل"}
                {user.role === "SALES_MANAGER" && "مدیر فروش"}
                {user.role === "SALES_STAFF" && "پرسنل فروش"}
                {user.role === "WAREHOUSE" && "انباردار"}
                {user.role === "ACCOUNTING" && "حسابدار"}
                {user.role === "DESIGNER" && "طراح"}
                {user.role === "DEALER" && "نماینده"}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {allowedMenus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                pathname === item.href ? "bg-primary/10 font-bold text-primary" : "text-secondary hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50">
            <span className="text-lg">🚪</span>
            <span>خروج از حساب</span>
          </button>
        </div>
      </aside>
    </>
  );
}