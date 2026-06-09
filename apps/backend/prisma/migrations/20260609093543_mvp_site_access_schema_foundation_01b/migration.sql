-- CreateEnum
CREATE TYPE "SiteAccessPointType" AS ENUM ('LGU_SITE', 'TOURISM_SITE', 'PORT_TERMINAL', 'BARANGAY_ACCESS_POINT', 'ACCOMMODATION_CHECK_IN', 'OPERATOR_CHECK_IN', 'MERCHANT_CHECK_IN', 'TRANSPORT_CHECK_IN', 'TRAIL_STOP', 'EVENT_GATE', 'OTHER');

-- CreateEnum
CREATE TYPE "SiteAccessOwnerType" AS ENUM ('LGU', 'PROVINCIAL_TOURISM', 'DOT', 'BARANGAY', 'COMMUNITY', 'PRIVATE_PARTNER', 'LOCAL_OPERATOR', 'ACCOMMODATION', 'MERCHANT', 'MIXED');

-- CreateEnum
CREATE TYPE "SiteAccessQrPurpose" AS ENUM ('SITE_CONTEXT', 'ACCESS_CHECK_IN', 'PAYMENT_CONTEXT', 'STAMP_VALIDATION', 'ARRIVAL_LOG', 'OPERATOR_SERVICE_CHECK_IN', 'ACCOMMODATION_CHECK_IN', 'MERCHANT_CHECK_IN', 'EVENT_ENTRY');

-- CreateEnum
CREATE TYPE "SiteAccessFeeRuleType" AS ENUM ('NONE', 'STANDARD', 'RESIDENT_RATE', 'DISCOUNTED', 'EXEMPT', 'SENIOR_RATE', 'CHILD_RATE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SiteAccessFeeCollectionMode" AS ENUM ('NOT_COLLECTED', 'CASH_ON_SITE', 'ONLINE_PREPAY', 'COUNTER_PAYMENT', 'PARTNER_COLLECTED', 'GOVERNMENT_COLLECTED', 'MIXED');

-- CreateEnum
CREATE TYPE "SiteAccessEligibilityType" AS ENUM ('PUBLIC', 'RESIDENT', 'NON_RESIDENT', 'SENIOR', 'CHILD', 'STUDENT', 'PWD', 'LGU_STAFF', 'OPERATOR_STAFF', 'APPROVED_PARTNER', 'CUSTOM');

-- AlterTable
ALTER TABLE "SiteAccessPoint" ADD COLUMN     "barangayId" TEXT,
ADD COLUMN     "destinationSiteId" TEXT,
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "latitude" DECIMAL(10,7),
ADD COLUMN     "longitude" DECIMAL(10,7),
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "municipalityId" TEXT,
ADD COLUMN     "operatorRegistryId" TEXT,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "ownerType" "SiteAccessOwnerType" NOT NULL DEFAULT 'LGU',
ADD COLUMN     "pointType" "SiteAccessPointType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "publicSummary" TEXT;

-- CreateTable
CREATE TABLE "SiteAccessQrDefinition" (
    "id" TEXT NOT NULL,
    "siteAccessPointId" TEXT NOT NULL,
    "purpose" "SiteAccessQrPurpose" NOT NULL,
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "label" TEXT NOT NULL,
    "qrSlug" TEXT NOT NULL,
    "description" TEXT,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteAccessQrDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteAccessFeeRule" (
    "id" TEXT NOT NULL,
    "siteAccessPointId" TEXT NOT NULL,
    "ruleType" "SiteAccessFeeRuleType" NOT NULL,
    "eligibilityType" "SiteAccessEligibilityType" NOT NULL DEFAULT 'PUBLIC',
    "collectionMode" "SiteAccessFeeCollectionMode" NOT NULL DEFAULT 'NOT_COLLECTED',
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "label" TEXT NOT NULL,
    "amount" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "requiresVerification" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteAccessFeeRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteAccessQrDefinition_qrSlug_key" ON "SiteAccessQrDefinition"("qrSlug");

-- CreateIndex
CREATE INDEX "SiteAccessQrDefinition_siteAccessPointId_idx" ON "SiteAccessQrDefinition"("siteAccessPointId");

-- CreateIndex
CREATE INDEX "SiteAccessQrDefinition_purpose_idx" ON "SiteAccessQrDefinition"("purpose");

-- CreateIndex
CREATE INDEX "SiteAccessQrDefinition_status_idx" ON "SiteAccessQrDefinition"("status");

-- CreateIndex
CREATE INDEX "SiteAccessFeeRule_siteAccessPointId_idx" ON "SiteAccessFeeRule"("siteAccessPointId");

-- CreateIndex
CREATE INDEX "SiteAccessFeeRule_ruleType_idx" ON "SiteAccessFeeRule"("ruleType");

-- CreateIndex
CREATE INDEX "SiteAccessFeeRule_eligibilityType_idx" ON "SiteAccessFeeRule"("eligibilityType");

-- CreateIndex
CREATE INDEX "SiteAccessFeeRule_collectionMode_idx" ON "SiteAccessFeeRule"("collectionMode");

-- CreateIndex
CREATE INDEX "SiteAccessFeeRule_status_idx" ON "SiteAccessFeeRule"("status");

-- AddForeignKey
ALTER TABLE "SiteAccessPoint" ADD CONSTRAINT "SiteAccessPoint_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAccessPoint" ADD CONSTRAINT "SiteAccessPoint_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAccessPoint" ADD CONSTRAINT "SiteAccessPoint_destinationSiteId_fkey" FOREIGN KEY ("destinationSiteId") REFERENCES "DestinationSite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAccessPoint" ADD CONSTRAINT "SiteAccessPoint_operatorRegistryId_fkey" FOREIGN KEY ("operatorRegistryId") REFERENCES "LocalOperatorRegistryRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAccessQrDefinition" ADD CONSTRAINT "SiteAccessQrDefinition_siteAccessPointId_fkey" FOREIGN KEY ("siteAccessPointId") REFERENCES "SiteAccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAccessFeeRule" ADD CONSTRAINT "SiteAccessFeeRule_siteAccessPointId_fkey" FOREIGN KEY ("siteAccessPointId") REFERENCES "SiteAccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
