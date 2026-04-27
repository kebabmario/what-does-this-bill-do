import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const bills = await prisma.bill.findMany({
    orderBy: { lastActionAt: "desc" },
    select: {
      id: true,
      externalId: true,
      title: true,
      status: true,
      jurisdiction: true,
      introducedAt: true,
      lastActionAt: true,
      sourceUrl: true,
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-2">Bills</h1>
      <p className="text-sm text-gray-600 mb-6">
        Track legislation in plain language.
      </p>

      <div className="space-y-4">
        {bills.map((bill) => (
          <Link
            key={bill.id}
            href={`/bills/${bill.id}`}
            className="block rounded-xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">{bill.externalId}</p>
                <h2 className="text-lg font-semibold">{bill.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {bill.jurisdiction} • {bill.status}
                </p>
              </div>
              <div className="text-xs text-gray-500 text-right">
                <p>Last action</p>
                <p>
                  {bill.lastActionAt
                    ? new Date(bill.lastActionAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {bills.length === 0 && (
          <p className="text-sm text-gray-500">No bills found.</p>
        )}
      </div>
    </main>
  );
}