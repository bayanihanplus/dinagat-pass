-- CreateEnum
CREATE TYPE "LocalOperatorProviderType" AS ENUM ('TOUR_OPERATOR', 'TRANSPORT_PROVIDER', 'ACCOMMODATION_PROVIDER', 'FOOD_MERCHANT', 'GUIDE', 'COMMUNITY_ORGANIZATION', 'LGU_OPERATED', 'MIXED_PROVIDER');

-- CreateEnum
CREATE TYPE "LocalOperatorVerificationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LocalOperatorAccreditationStatus" AS ENUM ('NOT_PROVIDED', 'PENDING_REVIEW', 'DOT_ACCREDITED', 'LGU_RECOGNIZED', 'PROVISIONAL', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LocalOperatorCapabilityCategory" AS ENUM ('ISLAND_HOPPING', 'LAND_TOUR', 'WATER_ACTIVITY', 'CULTURE_COMMUNITY', 'FOOD_WELLNESS', 'TRANSPORT_SUPPORT', 'ACCOMMODATION', 'GUIDE_SERVICE', 'SITE_ACCESS_SUPPORT', 'CUSTOM_SERVICE');

-- CreateEnum
CREATE TYPE "LocalOperatorCommercialReadinessStatus" AS ENUM ('NOT_READY', 'PROFILE_ONLY', 'REQUEST_TO_CONFIRM', 'PRICING_READY', 'BOOKING_READY', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "LocalOperatorExposureStatus" AS ENUM ('HIDDEN', 'ELIGIBLE_FOR_REVIEW', 'APPROVED_FOR_EXPOSURE', 'SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "LocalOperatorComplianceSeverity" AS ENUM ('INFO', 'WARNING', 'RESTRICTION', 'SUSPENSION', 'BLOCKER');

-- CreateTable
CREATE TABLE "LocalOperatorRegistryRecord" (
    "id" TEXT NOT NULL,
    "registryCode" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "legalName" TEXT,
    "providerType" "LocalOperatorProviderType" NOT NULL,
    "verificationStatus" "LocalOperatorVerificationStatus" NOT NULL DEFAULT 'DRAFT',
    "accreditationStatus" "LocalOperatorAccreditationStatus" NOT NULL DEFAULT 'NOT_PROVIDED',
    "commercialReadinessStatus" "LocalOperatorCommercialReadinessStatus" NOT NULL DEFAULT 'NOT_READY',
    "exposureStatus" "LocalOperatorExposureStatus" NOT NULL DEFAULT 'HIDDEN',
    "primaryMunicipalityCode" TEXT,
    "primaryBarangayCode" TEXT,
    "contactPersonName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "publicSummary" TEXT,
    "internalNotes" TEXT,
    "termsAcceptedAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "lastReviewedByUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalOperatorRegistryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalOperatorCapabilityRecord" (
    "id" TEXT NOT NULL,
    "operatorRegistryId" TEXT NOT NULL,
    "category" "LocalOperatorCapabilityCategory" NOT NULL,
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "description" TEXT,
    "readinessNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalOperatorCapabilityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalOperatorComplianceRecord" (
    "id" TEXT NOT NULL,
    "operatorRegistryId" TEXT NOT NULL,
    "severity" "LocalOperatorComplianceSeverity" NOT NULL DEFAULT 'INFO',
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "details" TEXT,
    "reason" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalOperatorComplianceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalOperatorRegistryRecord_registryCode_key" ON "LocalOperatorRegistryRecord"("registryCode");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_providerType_idx" ON "LocalOperatorRegistryRecord"("providerType");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_verificationStatus_idx" ON "LocalOperatorRegistryRecord"("verificationStatus");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_accreditationStatus_idx" ON "LocalOperatorRegistryRecord"("accreditationStatus");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_commercialReadinessStatus_idx" ON "LocalOperatorRegistryRecord"("commercialReadinessStatus");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_exposureStatus_idx" ON "LocalOperatorRegistryRecord"("exposureStatus");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_primaryMunicipalityCode_idx" ON "LocalOperatorRegistryRecord"("primaryMunicipalityCode");

-- CreateIndex
CREATE INDEX "LocalOperatorRegistryRecord_primaryBarangayCode_idx" ON "LocalOperatorRegistryRecord"("primaryBarangayCode");

-- CreateIndex
CREATE INDEX "LocalOperatorCapabilityRecord_operatorRegistryId_idx" ON "LocalOperatorCapabilityRecord"("operatorRegistryId");

-- CreateIndex
CREATE INDEX "LocalOperatorCapabilityRecord_category_idx" ON "LocalOperatorCapabilityRecord"("category");

-- CreateIndex
CREATE INDEX "LocalOperatorCapabilityRecord_status_idx" ON "LocalOperatorCapabilityRecord"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LocalOperatorCapabilityRecord_operatorRegistryId_category_key" ON "LocalOperatorCapabilityRecord"("operatorRegistryId", "category");

-- CreateIndex
CREATE INDEX "LocalOperatorComplianceRecord_operatorRegistryId_idx" ON "LocalOperatorComplianceRecord"("operatorRegistryId");

-- CreateIndex
CREATE INDEX "LocalOperatorComplianceRecord_severity_idx" ON "LocalOperatorComplianceRecord"("severity");

-- CreateIndex
CREATE INDEX "LocalOperatorComplianceRecord_status_idx" ON "LocalOperatorComplianceRecord"("status");

-- AddForeignKey
ALTER TABLE "LocalOperatorCapabilityRecord" ADD CONSTRAINT "LocalOperatorCapabilityRecord_operatorRegistryId_fkey" FOREIGN KEY ("operatorRegistryId") REFERENCES "LocalOperatorRegistryRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalOperatorComplianceRecord" ADD CONSTRAINT "LocalOperatorComplianceRecord_operatorRegistryId_fkey" FOREIGN KEY ("operatorRegistryId") REFERENCES "LocalOperatorRegistryRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
