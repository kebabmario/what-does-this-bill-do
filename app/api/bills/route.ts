import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = Number(searchParams.get("page") || "1");
    const pageSize = 20;

    const where = {
      ...(status ? { status } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { externalId: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        orderBy: { lastActionAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
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
      }),
      prisma.bill.count({ where }),
    ]);

    return NextResponse.json({
      page,
      pageSize,
      total,
      items,
    });
  } catch (error) {
    console.error("GET /api/bills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}