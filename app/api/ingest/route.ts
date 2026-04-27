import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = context?.params?.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid bill id" }, { status: 400 });
    }

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { publishedAt: "desc" },
        },
        statusEvents: {
          orderBy: { eventDate: "desc" },
        },
      },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error: any) {
    console.error("GET /api/bills/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill", details: String(error?.message || error) },
      { status: 500 }
    );
  }
}