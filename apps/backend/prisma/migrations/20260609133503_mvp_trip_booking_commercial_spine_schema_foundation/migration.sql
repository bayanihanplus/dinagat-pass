-- CreateEnum
CREATE TYPE "TripBookingCommercialStatus" AS ENUM ('DRAFT', 'REQUESTED', 'QUOTED', 'CONFIRMED', 'READY_FOR_PAYMENT', 'PAYMENT_PENDING', 'PAID', 'PARTIALLY_PAID', 'FULFILLMENT_PENDING', 'FULFILLED', 'CANCELLED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TripBookingProductType" AS ENUM ('SITE_ACCESS', 'TOUR', 'TRANSPORT', 'ACCOMMODATION', 'GUIDE_SERVICE', 'ACTIVITY', 'PACKAGE', 'ADD_ON', 'OTHER');

-- CreateEnum
CREATE TYPE "TripBookingSourceChannel" AS ENUM ('DIRECT_TRAVELER', 'LGU_DESK', 'TOURISM_OFFICE', 'HOTEL_DESK', 'TRAVEL_PARTNER', 'OTA_INTAKE', 'STAFF_CREATED', 'SYSTEM_CREATED');

-- CreateEnum
CREATE TYPE "TripBookingPricingMode" AS ENUM ('FIXED_PRICE', 'PER_PAX', 'PER_UNIT', 'REQUEST_TO_CONFIRM', 'GOVERNED_RATE', 'PARTNER_QUOTE', 'FREE');

-- CreateEnum
CREATE TYPE "TripBookingFulfillmentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING_ASSIGNMENT', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REASSIGNED', 'FAILED');

-- CreateEnum
CREATE TYPE "TripBookingPaymentStatus" AS ENUM ('NOT_REQUIRED', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUND_PENDING', 'REFUNDED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "commercialMetadata" JSONB,
ADD COLUMN     "commercialPaymentStatus" "TripBookingPaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "commercialPricingMode" "TripBookingPricingMode",
ADD COLUMN     "commercialSourceChannel" "TripBookingSourceChannel",
ADD COLUMN     "commercialStatus" "TripBookingCommercialStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "TripBookingCommercialRecord" (
    "id" TEXT NOT NULL,
    "commercialCode" TEXT NOT NULL,
    "bookingId" TEXT,
    "travelerId" TEXT,
    "passId" TEXT,
    "sourceChannel" "TripBookingSourceChannel" NOT NULL,
    "productType" "TripBookingProductType" NOT NULL,
    "pricingMode" "TripBookingPricingMode" NOT NULL,
    "commercialStatus" "TripBookingCommercialStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentStatus" "TripBookingPaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "fulfillmentStatus" "TripBookingFulfillmentStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "assignedOperatorRegistryId" TEXT,
    "sourcePartnerName" TEXT,
    "sourceReferenceHash" TEXT,
    "quotedAmountCents" INTEGER,
    "confirmedAmountCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "paxCount" INTEGER,
    "requestedForDate" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "governanceNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripBookingCommercialRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBookingLineItem" (
    "id" TEXT NOT NULL,
    "commercialRecordId" TEXT NOT NULL,
    "lineItemCode" TEXT NOT NULL,
    "productType" "TripBookingProductType" NOT NULL,
    "pricingMode" "TripBookingPricingMode" NOT NULL,
    "title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitAmountCents" INTEGER,
    "totalAmountCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'PHP',
    "governanceNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripBookingLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBookingFulfillmentRecord" (
    "id" TEXT NOT NULL,
    "commercialRecordId" TEXT NOT NULL,
    "fulfillmentCode" TEXT NOT NULL,
    "fulfillmentStatus" "TripBookingFulfillmentStatus" NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    "assignedOperatorRegistryId" TEXT,
    "assignedByUserId" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "reassignedAt" TIMESTAMP(3),
    "fulfillmentReferenceHash" TEXT,
    "governanceNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripBookingFulfillmentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingCommercialRecord_commercialCode_key" ON "TripBookingCommercialRecord"("commercialCode");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_bookingId_idx" ON "TripBookingCommercialRecord"("bookingId");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_travelerId_idx" ON "TripBookingCommercialRecord"("travelerId");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_passId_idx" ON "TripBookingCommercialRecord"("passId");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_sourceChannel_idx" ON "TripBookingCommercialRecord"("sourceChannel");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_productType_idx" ON "TripBookingCommercialRecord"("productType");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_pricingMode_idx" ON "TripBookingCommercialRecord"("pricingMode");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_commercialStatus_idx" ON "TripBookingCommercialRecord"("commercialStatus");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_paymentStatus_idx" ON "TripBookingCommercialRecord"("paymentStatus");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_fulfillmentStatus_idx" ON "TripBookingCommercialRecord"("fulfillmentStatus");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_assignedOperatorRegistryId_idx" ON "TripBookingCommercialRecord"("assignedOperatorRegistryId");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_requestedForDate_idx" ON "TripBookingCommercialRecord"("requestedForDate");

-- CreateIndex
CREATE INDEX "TripBookingCommercialRecord_confirmedAt_idx" ON "TripBookingCommercialRecord"("confirmedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingLineItem_lineItemCode_key" ON "TripBookingLineItem"("lineItemCode");

-- CreateIndex
CREATE INDEX "TripBookingLineItem_commercialRecordId_idx" ON "TripBookingLineItem"("commercialRecordId");

-- CreateIndex
CREATE INDEX "TripBookingLineItem_productType_idx" ON "TripBookingLineItem"("productType");

-- CreateIndex
CREATE INDEX "TripBookingLineItem_pricingMode_idx" ON "TripBookingLineItem"("pricingMode");

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingFulfillmentRecord_fulfillmentCode_key" ON "TripBookingFulfillmentRecord"("fulfillmentCode");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentRecord_commercialRecordId_idx" ON "TripBookingFulfillmentRecord"("commercialRecordId");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentRecord_fulfillmentStatus_idx" ON "TripBookingFulfillmentRecord"("fulfillmentStatus");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentRecord_assignedOperatorRegistryId_idx" ON "TripBookingFulfillmentRecord"("assignedOperatorRegistryId");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentRecord_assignedByUserId_idx" ON "TripBookingFulfillmentRecord"("assignedByUserId");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentRecord_acceptedAt_idx" ON "TripBookingFulfillmentRecord"("acceptedAt");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentRecord_completedAt_idx" ON "TripBookingFulfillmentRecord"("completedAt");

-- AddForeignKey
ALTER TABLE "TripBookingLineItem" ADD CONSTRAINT "TripBookingLineItem_commercialRecordId_fkey" FOREIGN KEY ("commercialRecordId") REFERENCES "TripBookingCommercialRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBookingFulfillmentRecord" ADD CONSTRAINT "TripBookingFulfillmentRecord_commercialRecordId_fkey" FOREIGN KEY ("commercialRecordId") REFERENCES "TripBookingCommercialRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
