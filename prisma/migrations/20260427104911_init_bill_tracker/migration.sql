-- CreateTable
CREATE TABLE "public"."Bill" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "status" TEXT NOT NULL,
    "introducedAt" TIMESTAMP(3),
    "lastActionAt" TIMESTAMP(3),
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillVersion" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "versionLabel" TEXT NOT NULL,
    "textContent" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillStatusEvent" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "description" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_externalId_key" ON "public"."Bill"("externalId");

-- CreateIndex
CREATE INDEX "Bill_jurisdiction_status_idx" ON "public"."Bill"("jurisdiction", "status");

-- CreateIndex
CREATE INDEX "Bill_lastActionAt_idx" ON "public"."Bill"("lastActionAt");

-- CreateIndex
CREATE INDEX "BillVersion_billId_publishedAt_idx" ON "public"."BillVersion"("billId", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BillVersion_billId_versionLabel_key" ON "public"."BillVersion"("billId", "versionLabel");

-- CreateIndex
CREATE INDEX "BillStatusEvent_billId_eventDate_idx" ON "public"."BillStatusEvent"("billId", "eventDate");

-- AddForeignKey
ALTER TABLE "public"."BillVersion" ADD CONSTRAINT "BillVersion_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillStatusEvent" ADD CONSTRAINT "BillStatusEvent_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
