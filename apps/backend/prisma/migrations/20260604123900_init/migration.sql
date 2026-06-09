-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TRAVELER', 'OPERATOR_OWNER', 'OPERATOR_STAFF', 'LGU_USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ExperienceFamilyCode" AS ENUM ('BLUE_LAGOON_PANGABANGAN', 'LAKE_BABABU_BASILISA_GEOSITE', 'DINAGAT_ISLAND_HOPPING', 'LORETO_BONSAI_FOREST_ECO', 'SAN_JOSE_MYSTICAL_CULTURE', 'COMMUNITY_FOOD_LOCAL_COMMERCE', 'ADVENTURE_CAVE_LAGOON_ECO', 'RETURN_VISITOR_CONTINUITY');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('DINAGAT_PARTNER_TOUR', 'DINAGAT_CURATED_EXPERIENCE_TRAIL', 'BUILD_YOUR_OWN_DINAGAT_TRAIL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('DRAFT', 'REQUESTED', 'OPERATOR_REVIEW', 'OPERATOR_ACCEPTED', 'OPERATOR_REJECTED', 'PAYMENT_READY', 'PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentReadinessStatus" AS ENUM ('NOT_READY', 'REQUIRES_OPERATOR_CONFIRMATION', 'READY_FOR_PAYMENT', 'PAYMENT_STARTED', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'REFUND_REQUIRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "QrStatus" AS ENUM ('NOT_ISSUED', 'ISSUED', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ScanEventStatus" AS ENUM ('CREATED', 'VALIDATED', 'REJECTED', 'DUPLICATE', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "VisitStampStatus" AS ENUM ('NOT_ELIGIBLE', 'ELIGIBLE_FROM_SCAN', 'ISSUED', 'REVOKED');

-- CreateEnum
CREATE TYPE "OperatorApprovalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OperatorCapabilityStatus" AS ENUM ('NOT_REQUESTED', 'REQUESTED', 'APPROVED', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "MarketplaceExposureStatus" AS ENUM ('HIDDEN', 'ELIGIBLE', 'EXPOSED', 'CAPPED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SiteAccessPointStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SourceAttributionType" AS ENUM ('DIRECT', 'LGU', 'OPERATOR', 'OTA_PARTNER', 'HOTEL_DESK', 'TRAVEL_AGENCY', 'COMMUNITY_PARTNER', 'ADMIN_CREATED');

-- CreateEnum
CREATE TYPE "AuditActionType" AS ENUM ('CREATE', 'UPDATE', 'APPROVE', 'REJECT', 'SUSPEND', 'REVOKE', 'VALIDATE_QR', 'ISSUE_STAMP', 'CHANGE_PAYMENT_READINESS', 'CHANGE_MARKETPLACE_EXPOSURE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelerPass" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "qrStatus" "QrStatus" NOT NULL DEFAULT 'NOT_ISSUED',
    "qrPublicCode" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelerPass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "publicCode" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "approvalStatus" "OperatorApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorCapability" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "familyCode" "ExperienceFamilyCode" NOT NULL,
    "status" "OperatorCapabilityStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "approvedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperatorCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceProduct" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT,
    "familyCode" "ExperienceFamilyCode" NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "shortSummary" TEXT NOT NULL,
    "isBookable" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "passId" TEXT,
    "productId" TEXT NOT NULL,
    "operatorId" TEXT,
    "sourceAttributionId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "paymentReadinessStatus" "PaymentReadinessStatus" NOT NULL DEFAULT 'NOT_READY',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operatorReviewedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteAccessPoint" (
    "id" TEXT NOT NULL,
    "publicCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SiteAccessPointStatus" NOT NULL DEFAULT 'DRAFT',
    "locationLabel" TEXT,
    "actionContext" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteAccessPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSiteAccessPoint" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "siteAccessPointId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSiteAccessPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanEvent" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "passId" TEXT,
    "bookingId" TEXT,
    "siteAccessPointId" TEXT NOT NULL,
    "status" "ScanEventStatus" NOT NULL DEFAULT 'CREATED',
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejectionReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitStamp" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "passId" TEXT NOT NULL,
    "bookingId" TEXT,
    "scanEventId" TEXT,
    "siteAccessPointId" TEXT NOT NULL,
    "status" "VisitStampStatus" NOT NULL DEFAULT 'NOT_ELIGIBLE',
    "issuedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitStamp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceExposure" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "productId" TEXT,
    "status" "MarketplaceExposureStatus" NOT NULL DEFAULT 'HIDDEN',
    "score" INTEGER NOT NULL DEFAULT 0,
    "reason" TEXT,
    "exposedAt" TIMESTAMP(3),
    "cappedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceExposure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceAttribution" (
    "id" TEXT NOT NULL,
    "type" "SourceAttributionType" NOT NULL,
    "sourceCode" TEXT,
    "sourceName" TEXT,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceAttribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actionType" "AuditActionType" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TravelerProfile_userId_key" ON "TravelerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TravelerProfile_publicCode_key" ON "TravelerProfile"("publicCode");

-- CreateIndex
CREATE UNIQUE INDEX "TravelerPass_qrPublicCode_key" ON "TravelerPass"("qrPublicCode");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_publicCode_key" ON "Operator"("publicCode");

-- CreateIndex
CREATE UNIQUE INDEX "OperatorCapability_operatorId_familyCode_key" ON "OperatorCapability"("operatorId", "familyCode");

-- CreateIndex
CREATE UNIQUE INDEX "SiteAccessPoint_publicCode_key" ON "SiteAccessPoint"("publicCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSiteAccessPoint_productId_siteAccessPointId_key" ON "ProductSiteAccessPoint"("productId", "siteAccessPointId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitStamp_scanEventId_key" ON "VisitStamp"("scanEventId");

-- AddForeignKey
ALTER TABLE "TravelerProfile" ADD CONSTRAINT "TravelerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerPass" ADD CONSTRAINT "TravelerPass_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "TravelerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operator" ADD CONSTRAINT "Operator_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorCapability" ADD CONSTRAINT "OperatorCapability_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceProduct" ADD CONSTRAINT "ExperienceProduct_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "TravelerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_passId_fkey" FOREIGN KEY ("passId") REFERENCES "TravelerPass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ExperienceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_sourceAttributionId_fkey" FOREIGN KEY ("sourceAttributionId") REFERENCES "SourceAttribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSiteAccessPoint" ADD CONSTRAINT "ProductSiteAccessPoint_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ExperienceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSiteAccessPoint" ADD CONSTRAINT "ProductSiteAccessPoint_siteAccessPointId_fkey" FOREIGN KEY ("siteAccessPointId") REFERENCES "SiteAccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "TravelerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_passId_fkey" FOREIGN KEY ("passId") REFERENCES "TravelerPass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_siteAccessPointId_fkey" FOREIGN KEY ("siteAccessPointId") REFERENCES "SiteAccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitStamp" ADD CONSTRAINT "VisitStamp_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "TravelerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitStamp" ADD CONSTRAINT "VisitStamp_passId_fkey" FOREIGN KEY ("passId") REFERENCES "TravelerPass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitStamp" ADD CONSTRAINT "VisitStamp_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitStamp" ADD CONSTRAINT "VisitStamp_scanEventId_fkey" FOREIGN KEY ("scanEventId") REFERENCES "ScanEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitStamp" ADD CONSTRAINT "VisitStamp_siteAccessPointId_fkey" FOREIGN KEY ("siteAccessPointId") REFERENCES "SiteAccessPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceExposure" ADD CONSTRAINT "MarketplaceExposure_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceExposure" ADD CONSTRAINT "MarketplaceExposure_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ExperienceProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
