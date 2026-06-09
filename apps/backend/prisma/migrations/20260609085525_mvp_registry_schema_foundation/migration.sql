-- CreateEnum
CREATE TYPE "RegistryRecordStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GovernanceOwnerType" AS ENUM ('LGU', 'PROVINCIAL_TOURISM', 'DOT', 'COMMUNITY', 'PRIVATE_PARTNER', 'MIXED');

-- CreateEnum
CREATE TYPE "DestinationSiteType" AS ENUM ('BEACH', 'ISLAND', 'PORT_TERMINAL', 'MUNICIPAL_HALL', 'BARANGAY_HALL', 'TOURISM_OFFICE', 'ACCOMMODATION', 'FOOD_MERCHANT', 'TRANSPORT_NODE', 'CULTURE_SITE', 'NATURE_SITE', 'DIVE_SITE', 'SURF_SITE', 'TRAIL_STOP', 'VIEW_DECK', 'WATERFALL', 'CAVE', 'OTHER');

-- CreateTable
CREATE TABLE "Municipality" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provinceName" TEXT NOT NULL DEFAULT 'Dinagat Islands',
    "regionName" TEXT NOT NULL DEFAULT 'Caraga',
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "governanceOwnerType" "GovernanceOwnerType" NOT NULL DEFAULT 'PROVINCIAL_TOURISM',
    "governanceOwnerName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barangay" (
    "id" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "governanceOwnerType" "GovernanceOwnerType" NOT NULL DEFAULT 'LGU',
    "governanceOwnerName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barangay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationSite" (
    "id" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "barangayId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteType" "DestinationSiteType" NOT NULL,
    "status" "RegistryRecordStatus" NOT NULL DEFAULT 'DRAFT',
    "governanceOwnerType" "GovernanceOwnerType" NOT NULL DEFAULT 'LGU',
    "governanceOwnerName" TEXT,
    "publicSummary" TEXT,
    "internalNotes" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DestinationSite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_code_key" ON "Municipality"("code");

-- CreateIndex
CREATE INDEX "Municipality_status_idx" ON "Municipality"("status");

-- CreateIndex
CREATE INDEX "Municipality_governanceOwnerType_idx" ON "Municipality"("governanceOwnerType");

-- CreateIndex
CREATE INDEX "Barangay_municipalityId_idx" ON "Barangay"("municipalityId");

-- CreateIndex
CREATE INDEX "Barangay_status_idx" ON "Barangay"("status");

-- CreateIndex
CREATE INDEX "Barangay_governanceOwnerType_idx" ON "Barangay"("governanceOwnerType");

-- CreateIndex
CREATE UNIQUE INDEX "Barangay_municipalityId_code_key" ON "Barangay"("municipalityId", "code");

-- CreateIndex
CREATE INDEX "DestinationSite_municipalityId_idx" ON "DestinationSite"("municipalityId");

-- CreateIndex
CREATE INDEX "DestinationSite_barangayId_idx" ON "DestinationSite"("barangayId");

-- CreateIndex
CREATE INDEX "DestinationSite_siteType_idx" ON "DestinationSite"("siteType");

-- CreateIndex
CREATE INDEX "DestinationSite_status_idx" ON "DestinationSite"("status");

-- CreateIndex
CREATE INDEX "DestinationSite_governanceOwnerType_idx" ON "DestinationSite"("governanceOwnerType");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationSite_municipalityId_code_key" ON "DestinationSite"("municipalityId", "code");

-- AddForeignKey
ALTER TABLE "Barangay" ADD CONSTRAINT "Barangay_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationSite" ADD CONSTRAINT "DestinationSite_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DestinationSite" ADD CONSTRAINT "DestinationSite_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
