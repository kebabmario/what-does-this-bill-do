import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bill1 = await prisma.bill.upsert({
    where: { externalId: "HB-101-2026" },
    update: {},
    create: {
      externalId: "HB-101-2026",
      jurisdiction: "US-CA",
      title: "Clean Water Infrastructure Grant Program",
      summary: "Creates a state grant program for local water system upgrades.",
      status: "In Committee",
      introducedAt: new Date("2026-02-10"),
      lastActionAt: new Date("2026-03-01"),
      sourceUrl: "https://example.gov/bills/hb-101-2026",
    },
  });

  await prisma.billVersion.createMany({
    data: [
      {
        billId: bill1.id,
        versionLabel: "Introduced",
        textContent:
          "Section 1. Establishes the Clean Water Infrastructure Grant Program...",
        publishedAt: new Date("2026-02-10"),
        sourceUrl: "https://example.gov/bills/hb-101-2026/text/introduced",
      },
      {
        billId: bill1.id,
        versionLabel: "Amended Committee Draft",
        textContent:
          "Section 1. Establishes the Clean Water Infrastructure Grant Program with updated eligibility...",
        publishedAt: new Date("2026-03-01"),
        sourceUrl: "https://example.gov/bills/hb-101-2026/text/amended",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.billStatusEvent.createMany({
    data: [
      {
        billId: bill1.id,
        status: "Introduced",
        eventDate: new Date("2026-02-10"),
        description: "Bill introduced in House.",
        sourceUrl: "https://example.gov/bills/hb-101-2026/actions",
      },
      {
        billId: bill1.id,
        status: "In Committee",
        eventDate: new Date("2026-03-01"),
        description: "Referred to Water & Environment Committee.",
        sourceUrl: "https://example.gov/bills/hb-101-2026/actions",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.bill.upsert({
    where: { externalId: "SB-77-2026" },
    update: {},
    create: {
      externalId: "SB-77-2026",
      jurisdiction: "US-CA",
      title: "School Cybersecurity Standards Act",
      summary: "Requires baseline cybersecurity controls for K-12 districts.",
      status: "Passed Senate",
      introducedAt: new Date("2026-01-20"),
      lastActionAt: new Date("2026-03-15"),
      sourceUrl: "https://example.gov/bills/sb-77-2026",
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });