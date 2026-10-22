import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PanelSidebar from "@/components/PanelSidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bglight">
      {/* این کامپوننت هم منوی موبایل داره هم سایدبار دسکتاپ */}
      <PanelSidebar user={{ name: user.name, role: user.role }} />
      
      {/* محتوای صفحات */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}