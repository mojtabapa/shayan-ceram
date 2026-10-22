import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ContractSigner from "@/components/ContractSigner";

export default async function MyContractPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role !== "DEALER") redirect("/panel");

  const dealer = await prisma.dealer.findUnique({ where: { userId: user.id } });
  if (!dealer) return <div className="p-6 text-center text-muted">اطلاعات نماینده یافت نشد.</div>;

  const contract = await prisma.contract.findFirst({
    where: { dealerId: dealer.id },
    include: { signature: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-secondary md:text-3xl">📝 قرارداد نمایندگی</h1>
        <p className="mt-1 text-sm text-muted">متن قرارداد را مطالعه و امضا کنید</p>
      </div>

      {contract?.signature ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center shadow-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-700 mb-2">قرارداد شما امضا شده است</h2>
          <p className="text-sm text-green-600">
            تاریخ امضا: {new Date(contract.signature.signedAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
      ) : (
        <ContractSigner />
      )}
    </div>
  );
}