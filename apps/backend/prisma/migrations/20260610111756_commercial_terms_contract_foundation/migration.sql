-- CreateEnum
CREATE TYPE "CommercialTermsType" AS ENUM ('OPERATOR_MARKETPLACE_PARTICIPATION', 'TRIP_BOOKING_FULFILLMENT', 'SITE_ACCESS_FULFILLMENT', 'PAYMENT_AND_CANCELLATION', 'SOURCE_ATTRIBUTION', 'QR_AND_STAMP_COMPLIANCE');

-- CreateEnum
CREATE TYPE "TermsAcceptanceStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'REVOKED', 'SUPERSEDED');

-- CreateTable
CREATE TABLE "CommercialTerms" (
    "id" TEXT NOT NULL,
    "type" "CommercialTermsType" NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "status" "TermsAcceptanceStatus" NOT NULL DEFAULT 'DRAFT',
    "effectiveAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),
    "createdByUserId" TEXT,
    "approvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommercialTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorTermsAcceptance" (
    "id" TEXT NOT NULL,
    "commercialTermsId" TEXT NOT NULL,
    "operatorRegistryId" TEXT NOT NULL,
    "acceptedByUserId" TEXT,
    "status" "TermsAcceptanceStatus" NOT NULL DEFAULT 'ACTIVE',
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "acceptanceSnapshotJson" JSONB,
    "sourceIp" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatorTermsAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommercialTerms_type_idx" ON "CommercialTerms"("type");

-- CreateIndex
CREATE INDEX "CommercialTerms_status_idx" ON "CommercialTerms"("status");

-- CreateIndex
CREATE INDEX "CommercialTerms_effectiveAt_idx" ON "CommercialTerms"("effectiveAt");

-- CreateIndex
CREATE INDEX "CommercialTerms_createdByUserId_idx" ON "CommercialTerms"("createdByUserId");

-- CreateIndex
CREATE INDEX "CommercialTerms_approvedByUserId_idx" ON "CommercialTerms"("approvedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialTerms_type_version_key" ON "CommercialTerms"("type", "version");

-- CreateIndex
CREATE INDEX "OperatorTermsAcceptance_commercialTermsId_idx" ON "OperatorTermsAcceptance"("commercialTermsId");

-- CreateIndex
CREATE INDEX "OperatorTermsAcceptance_operatorRegistryId_idx" ON "OperatorTermsAcceptance"("operatorRegistryId");

-- CreateIndex
CREATE INDEX "OperatorTermsAcceptance_acceptedByUserId_idx" ON "OperatorTermsAcceptance"("acceptedByUserId");

-- CreateIndex
CREATE INDEX "OperatorTermsAcceptance_status_idx" ON "OperatorTermsAcceptance"("status");

-- CreateIndex
CREATE INDEX "OperatorTermsAcceptance_acceptedAt_idx" ON "OperatorTermsAcceptance"("acceptedAt");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorTermsAcceptance_commercialTermsId_operatorRegistryI_key" ON "OperatorTermsAcceptance"("commercialTermsId", "operatorRegistryId");
