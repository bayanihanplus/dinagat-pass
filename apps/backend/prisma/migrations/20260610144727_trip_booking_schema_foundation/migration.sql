-- CreateEnum
CREATE TYPE "TripBookingIntentStatus" AS ENUM ('DRAFT', 'REQUESTED', 'PENDING_OPERATOR_MATCH', 'PENDING_CONFIRMATION', 'READY_FOR_PAYMENT', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TripBookingFulfillmentDecisionStatus" AS ENUM ('PENDING', 'ELIGIBLE', 'SELECTED', 'REJECTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "TripBookingPaymentReadinessStatus" AS ENUM ('NOT_READY', 'READY', 'PAYMENT_PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TripBookingVoucherReadinessStatus" AS ENUM ('NOT_READY', 'READY', 'ISSUED', 'VOIDED');

-- CreateTable
CREATE TABLE "TripBookingIntent" (
    "id" TEXT NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "productType" "TripBookingProductType" NOT NULL,
    "sourceChannel" "TripBookingSourceChannel" NOT NULL,
    "pricingMode" "TripBookingPricingMode" NOT NULL,
    "status" "TripBookingIntentStatus" NOT NULL DEFAULT 'DRAFT',
    "travelerUserId" TEXT,
    "requestedByUserId" TEXT,
    "operatorRegistryId" TEXT,
    "commercialTermsId" TEXT,
    "operatorTermsAcceptanceId" TEXT,
    "title" TEXT NOT NULL,
    "destinationName" TEXT,
    "routeCode" TEXT,
    "serviceDate" TIMESTAMP(3),
    "paxCount" INTEGER NOT NULL DEFAULT 1,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "estimatedAmount" DECIMAL(12,2),
    "confirmedAmount" DECIMAL(12,2),
    "travelerRequestJson" JSONB,
    "pricingSnapshotJson" JSONB,
    "fulfillmentSnapshotJson" JSONB,
    "sourceAttributionJson" JSONB,
    "metadata" JSONB,
    "backendOwned" BOOLEAN NOT NULL DEFAULT true,
    "frontendMayOnlyRequestIntent" BOOLEAN NOT NULL DEFAULT true,
    "fakeBookingAllowed" BOOLEAN NOT NULL DEFAULT false,
    "flatOperatorListAllowed" BOOLEAN NOT NULL DEFAULT false,
    "commercialTermsAcceptanceRequired" BOOLEAN NOT NULL DEFAULT true,
    "governedOperatorFulfillmentRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "requestedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "TripBookingIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBookingFulfillmentDecision" (
    "id" TEXT NOT NULL,
    "tripBookingIntentId" TEXT NOT NULL,
    "operatorRegistryId" TEXT NOT NULL,
    "status" "TripBookingFulfillmentDecisionStatus" NOT NULL DEFAULT 'PENDING',
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "fairnessScore" INTEGER NOT NULL DEFAULT 0,
    "categoryMatchScore" INTEGER NOT NULL DEFAULT 0,
    "riskPenaltyScore" INTEGER NOT NULL DEFAULT 0,
    "commercialTermsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "capabilityMatched" BOOLEAN NOT NULL DEFAULT false,
    "pricingOrRequestModeReady" BOOLEAN NOT NULL DEFAULT false,
    "availabilityOrRequestWindowReady" BOOLEAN NOT NULL DEFAULT false,
    "noUnresolvedComplianceIssue" BOOLEAN NOT NULL DEFAULT false,
    "governedExposureEligible" BOOLEAN NOT NULL DEFAULT false,
    "decisionReason" TEXT,
    "decisionSnapshotJson" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "selectedAt" TIMESTAMP(3),
    "supersededAt" TIMESTAMP(3),

    CONSTRAINT "TripBookingFulfillmentDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBookingPaymentReadiness" (
    "id" TEXT NOT NULL,
    "tripBookingIntentId" TEXT NOT NULL,
    "status" "TripBookingPaymentReadinessStatus" NOT NULL DEFAULT 'NOT_READY',
    "paymentProvider" TEXT,
    "paymentIntentReference" TEXT,
    "currencyCode" TEXT NOT NULL DEFAULT 'PHP',
    "amountDue" DECIMAL(12,2),
    "amountPaid" DECIMAL(12,2),
    "readinessReason" TEXT,
    "paymentSnapshotJson" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readyAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "TripBookingPaymentReadiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBookingVoucherReadiness" (
    "id" TEXT NOT NULL,
    "tripBookingIntentId" TEXT NOT NULL,
    "status" "TripBookingVoucherReadinessStatus" NOT NULL DEFAULT 'NOT_READY',
    "voucherCode" TEXT,
    "qrPayloadRef" TEXT,
    "boardingQrReady" BOOLEAN NOT NULL DEFAULT false,
    "manifestReady" BOOLEAN NOT NULL DEFAULT false,
    "movementRecordRequired" BOOLEAN NOT NULL DEFAULT false,
    "voucherSnapshotJson" JSONB,
    "qrSnapshotJson" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readyAt" TIMESTAMP(3),
    "issuedAt" TIMESTAMP(3),
    "voidedAt" TIMESTAMP(3),

    CONSTRAINT "TripBookingVoucherReadiness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingIntent_bookingCode_key" ON "TripBookingIntent"("bookingCode");

-- CreateIndex
CREATE INDEX "TripBookingIntent_bookingCode_idx" ON "TripBookingIntent"("bookingCode");

-- CreateIndex
CREATE INDEX "TripBookingIntent_status_idx" ON "TripBookingIntent"("status");

-- CreateIndex
CREATE INDEX "TripBookingIntent_productType_idx" ON "TripBookingIntent"("productType");

-- CreateIndex
CREATE INDEX "TripBookingIntent_sourceChannel_idx" ON "TripBookingIntent"("sourceChannel");

-- CreateIndex
CREATE INDEX "TripBookingIntent_operatorRegistryId_idx" ON "TripBookingIntent"("operatorRegistryId");

-- CreateIndex
CREATE INDEX "TripBookingIntent_commercialTermsId_idx" ON "TripBookingIntent"("commercialTermsId");

-- CreateIndex
CREATE INDEX "TripBookingIntent_operatorTermsAcceptanceId_idx" ON "TripBookingIntent"("operatorTermsAcceptanceId");

-- CreateIndex
CREATE INDEX "TripBookingIntent_serviceDate_idx" ON "TripBookingIntent"("serviceDate");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentDecision_tripBookingIntentId_idx" ON "TripBookingFulfillmentDecision"("tripBookingIntentId");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentDecision_operatorRegistryId_idx" ON "TripBookingFulfillmentDecision"("operatorRegistryId");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentDecision_status_idx" ON "TripBookingFulfillmentDecision"("status");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentDecision_commercialTermsAccepted_idx" ON "TripBookingFulfillmentDecision"("commercialTermsAccepted");

-- CreateIndex
CREATE INDEX "TripBookingFulfillmentDecision_governedExposureEligible_idx" ON "TripBookingFulfillmentDecision"("governedExposureEligible");

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingPaymentReadiness_tripBookingIntentId_key" ON "TripBookingPaymentReadiness"("tripBookingIntentId");

-- CreateIndex
CREATE INDEX "TripBookingPaymentReadiness_status_idx" ON "TripBookingPaymentReadiness"("status");

-- CreateIndex
CREATE INDEX "TripBookingPaymentReadiness_paymentIntentReference_idx" ON "TripBookingPaymentReadiness"("paymentIntentReference");

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingVoucherReadiness_tripBookingIntentId_key" ON "TripBookingVoucherReadiness"("tripBookingIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "TripBookingVoucherReadiness_voucherCode_key" ON "TripBookingVoucherReadiness"("voucherCode");

-- CreateIndex
CREATE INDEX "TripBookingVoucherReadiness_status_idx" ON "TripBookingVoucherReadiness"("status");

-- CreateIndex
CREATE INDEX "TripBookingVoucherReadiness_voucherCode_idx" ON "TripBookingVoucherReadiness"("voucherCode");

-- CreateIndex
CREATE INDEX "TripBookingVoucherReadiness_boardingQrReady_idx" ON "TripBookingVoucherReadiness"("boardingQrReady");

-- CreateIndex
CREATE INDEX "TripBookingVoucherReadiness_manifestReady_idx" ON "TripBookingVoucherReadiness"("manifestReady");

-- AddForeignKey
ALTER TABLE "TripBookingFulfillmentDecision" ADD CONSTRAINT "TripBookingFulfillmentDecision_tripBookingIntentId_fkey" FOREIGN KEY ("tripBookingIntentId") REFERENCES "TripBookingIntent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBookingPaymentReadiness" ADD CONSTRAINT "TripBookingPaymentReadiness_tripBookingIntentId_fkey" FOREIGN KEY ("tripBookingIntentId") REFERENCES "TripBookingIntent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBookingVoucherReadiness" ADD CONSTRAINT "TripBookingVoucherReadiness_tripBookingIntentId_fkey" FOREIGN KEY ("tripBookingIntentId") REFERENCES "TripBookingIntent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
