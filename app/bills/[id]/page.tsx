import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      versions: { orderBy: { publishedAt: "desc" } },
      statusEvents: { orderBy: { eventDate: "desc" } },
    },
  });

  if (!bill) notFound();

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <Link href="/bills" className="text-sm text-blue-600 hover:underline">
        ← Back to bills
      </Link>

      <section className="rounded-xl border p-5">
        <p className="text-xs text-gray-500">{bill.externalId}</p>
        <h1 className="text-2xl font-bold mt-1">{bill.title}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {bill.jurisdiction} • {bill.status}
        </p>
        {bill.summary && <p className="mt-4 text-gray-800">{bill.summary}</p>}
      </section>
    </main>
  );
}