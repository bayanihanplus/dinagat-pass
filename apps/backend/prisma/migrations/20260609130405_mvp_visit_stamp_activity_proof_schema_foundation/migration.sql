-- CreateEnum
CREATE TYPE "VisitStampSourceType" AS ENUM ('SITE_ACCESS_SCAN', 'BOOKING_COMPLETION', 'STAFF_VALIDATION', 'MANUAL_GOVERNANCE_REVIEW', 'SYSTEM_EVENT', 'PARTNER_EVENT');

-- CreateEnum
CREATE TYPE "ActivityProofStatus" AS ENUM ('DRAFT', 'RECORDED', 'VERIFIED', 'REJECTED', 'REVOKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActivityProofType" AS ENUM ('SITE_ACCESS_SCAN', 'VISIT_STAMP', 'BOOKING_ATTENDANCE', 'TRAIL_PROGRESS', 'STAFF_VALIDATION', 'GOVERNANCE_REVIEW');

-- CreateEnum
CREATE TYPE "ActivityProofEvidenceType" AS ENUM ('QR_SCAN', 'STAFF_CONFIRMATION', 'SYSTEM_EVENT', 'PHOTO_REFERENCE', 'DOCUMENT_REFERENCE', 'EXTERNAL_REFERENCE');

-- CreateEnum
CREATE TYPE "VisitStampProofStatus" AS ENUM ('DRAFT', 'EARNED', 'VERIFIED', 'REVOKED', 'EXPIRED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "ScanEvent" ADD COLUMN     "activityProofMetadata" JSONB,
ADD COLUMN     "activityProofRecordedAt" TIMESTAMP(3),
ADD COLUMN     "activityProofStatus" "ActivityProofStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "VisitStamp" ADD COLUMN     "proofMetadata" JSONB,
ADD COLUMN     "proofRecordedAt" TIMESTAMP(3),
ADD COLUMN     "proofReferenceHash" TEXT,
ADD COLUMN     "proofRevokedAt" TIMESTAMP(3),
ADD COLUMN     "proofVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "sourceType" "VisitStampSourceType" NOT NULL DEFAULT 'SITE_ACCESS_SCAN',
ADD COLUMN     "stampStatus" "VisitStampProofStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "ActivityProofRecord" (
    "id" TEXT NOT NULL,
    "proofCode" TEXT NOT NULL,
    "travelerId" TEXT,
    "passId" TEXT,
    "siteAccessPointId" TEXT,
    "scanEventId" TEXT,
    "visitStampId" TEXT,
    "bookingId" TEXT,
    "proofType" "ActivityProofType" NOT NULL,
    "status" "ActivityProofStatus" NOT NULL DEFAULT 'DRAFT',
    "occurredAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,
    "sourceReferenceHash" TEXT,
    "governanceNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityProofRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityProofEvidence" (
    "id" TEXT NOT NULL,
    "proofRecordId" TEXT NOT NULL,
    "evidenceCode" TEXT NOT NULL,
    "evidenceType" "ActivityProofEvidenceType" NOT NULL,
    "status" "ActivityProofStatus" NOT NULL DEFAULT 'DRAFT',
    "evidenceReferenceHash" TEXT,
    "capturedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityProofEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityProofRecord_proofCode_key" ON "ActivityProofRecord"("proofCode");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_travelerId_idx" ON "ActivityProofRecord"("travelerId");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_passId_idx" ON "ActivityProofRecord"("passId");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_siteAccessPointId_idx" ON "ActivityProofRecord"("siteAccessPointId");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_scanEventId_idx" ON "ActivityProofRecord"("scanEventId");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_visitStampId_idx" ON "ActivityProofRecord"("visitStampId");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_bookingId_idx" ON "ActivityProofRecord"("bookingId");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_proofType_idx" ON "ActivityProofRecord"("proofType");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_status_idx" ON "ActivityProofRecord"("status");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_occurredAt_idx" ON "ActivityProofRecord"("occurredAt");

-- CreateIndex
CREATE INDEX "ActivityProofRecord_verifiedAt_idx" ON "ActivityProofRecord"("verifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityProofEvidence_evidenceCode_key" ON "ActivityProofEvidence"("evidenceCode");

-- CreateIndex
CREATE INDEX "ActivityProofEvidence_proofRecordId_idx" ON "ActivityProofEvidence"("proofRecordId");

-- CreateIndex
CREATE INDEX "ActivityProofEvidence_evidenceType_idx" ON "ActivityProofEvidence"("evidenceType");

-- CreateIndex
CREATE INDEX "ActivityProofEvidence_status_idx" ON "ActivityProofEvidence"("status");

-- CreateIndex
CREATE INDEX "ActivityProofEvidence_capturedAt_idx" ON "ActivityProofEvidence"("capturedAt");

-- CreateIndex
CREATE INDEX "ActivityProofEvidence_verifiedAt_idx" ON "ActivityProofEvidence"("verifiedAt");

-- AddForeignKey
ALTER TABLE "ActivityProofEvidence" ADD CONSTRAINT "ActivityProofEvidence_proofRecordId_fkey" FOREIGN KEY ("proofRecordId") REFERENCES "ActivityProofRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
