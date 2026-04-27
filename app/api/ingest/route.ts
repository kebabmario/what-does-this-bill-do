import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toDateOrNull(v?: string | null) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = `Bearer ${process.env.INGEST_SECRET}`;
    if (!process.env.INGEST_SECRET || authHeader !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = process.env.PROVIDER_API_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Missing PROVIDER_API_KEY in environment" },
        { status: 500 }
      );
    }

    // 118th congress, first 50 bills
    const url =
      `https://api.congress.gov/v3/bill/118?limit=50&offset=0&api_key=${encodeURIComponent(
        key
      )}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { error: "Provider request failed", status: res.status, details: body.slice(0, 400) },
        { status: 502 }
      );
    }

    const json = await res.json();
    const bills: any[] = json?.bills ?? [];

    let created = 0;
    let updated = 0;

    for (const b of bills) {
      const type = String(b.type || "").toUpperCase(); // hr, s, hjres...
      const number = String(b.number || "");
      const congress = String(b.congress || "118");
      const externalId = `${type}-${number}-${congress}`;

      const title =
        b.title ||
        b.latestTitle?.title ||
        `${type} ${number}`;

      const latestActionText =
        b.latestAction?.text || "Introduced";

      const latestActionDate =
        b.latestAction?.actionDate || null;

      const sourceUrl =
        b.url || `https://www.congress.gov/bill/${congress}th-congress/${type.toLowerCase()}-bill/${number}`;

      const existing = await prisma.bill.findUnique({
        where: { externalId },
        select: { id: true },
      });

      await prisma.bill.upsert({
        where: { externalId },
        create: {
          externalId,
          jurisdiction: "US-FED",
          title: String(title),
          summary: null,
          status: String(latestActionText),
          introducedAt: toDateOrNull(b.introducedDate || null),
          lastActionAt: toDateOrNull(latestActionDate),
          sourceUrl: String(sourceUrl),
        },
        update: {
          title: String(title),
          status: String(latestActionText),
          introducedAt: toDateOrNull(b.introducedDate || null),
          lastActionAt: toDateOrNull(latestActionDate),
          sourceUrl: String(sourceUrl),
        },
      });

      if (existing) updated++;
      else created++;
    }

    return NextResponse.json({
      ok: true,
      totalFetched: bills.length,
      created,
      updated,
    });
  } catch (error: any) {
    console.error("POST /api/ingest error:", error);
    return NextResponse.json(
      { error: "Ingest failed", details: String(error?.message || error) },
      { status: 500 }
    );
  }
}