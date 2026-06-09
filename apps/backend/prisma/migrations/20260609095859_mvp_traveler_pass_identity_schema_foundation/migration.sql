/*
  Warnings:

  - A unique constraint covering the columns `[identityPublicCode]` on the table `TravelerPass` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TravelerPassIdentityStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'REVOKED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TravelerPassQrCredentialStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ROTATED', 'REVOKED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TravelerPassQrCredentialPurpose" AS ENUM ('TRAVELER_IDENTITY', 'SITE_ACCESS_SCAN', 'BOOKING_CONTEXT', 'STAFF_VALIDATION', 'GOVERNANCE_AUDIT');

-- CreateEnum
CREATE TYPE "TravelerIdentityClaimType" AS ENUM ('EMAIL', 'PHONE', 'NAME_REFERENCE', 'DOCUMENT_REFERENCE', 'MANUAL_GOVERNANCE_REFERENCE', 'EXTERNAL_REFERENCE');

-- CreateEnum
CREATE TYPE "TravelerIdentityClaimStatus" AS ENUM ('DRAFT', 'CLAIMED', 'VERIFIED', 'REJECTED', 'REVOKED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "TravelerPass" ADD COLUMN     "identityIssuedAt" TIMESTAMP(3),
ADD COLUMN     "identityMetadata" JSONB,
ADD COLUMN     "identityPublicCode" TEXT,
ADD COLUMN     "identityRevokedAt" TIMESTAMP(3),
ADD COLUMN     "identityStatus" "TravelerPassIdentityStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "TravelerPassQrCredential" (
    "id" TEXT NOT NULL,
    "passId" TEXT NOT NULL,
    "credentialCode" TEXT NOT NULL,
    "status" "TravelerPassQrCredentialStatus" NOT NULL DEFAULT 'DRAFT',
    "purpose" "TravelerPassQrCredentialPurpose" NOT NULL DEFAULT 'TRAVELER_IDENTITY',
    "qrTokenHash" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "rotationReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelerPassQrCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelerIdentityClaim" (
    "id" TEXT NOT NULL,
    "travelerId" TEXT NOT NULL,
    "passId" TEXT,
    "claimType" "TravelerIdentityClaimType" NOT NULL,
    "status" "TravelerIdentityClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "claimReferenceHash" TEXT,
    "verificationNotes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,
    "revokedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelerIdentityClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelerPassQrCredential_credentialCode_key" ON "TravelerPassQrCredential"("credentialCode");

-- CreateIndex
CREATE INDEX "TravelerPassQrCredential_passId_idx" ON "TravelerPassQrCredential"("passId");

-- CreateIndex
CREATE INDEX "TravelerPassQrCredential_status_idx" ON "TravelerPassQrCredential"("status");

-- CreateIndex
CREATE INDEX "TravelerPassQrCredential_purpose_idx" ON "TravelerPassQrCredential"("purpose");

-- CreateIndex
CREATE INDEX "TravelerPassQrCredential_issuedAt_idx" ON "TravelerPassQrCredential"("issuedAt");

-- CreateIndex
CREATE INDEX "TravelerPassQrCredential_expiresAt_idx" ON "TravelerPassQrCredential"("expiresAt");

-- CreateIndex
CREATE INDEX "TravelerIdentityClaim_travelerId_idx" ON "TravelerIdentityClaim"("travelerId");

-- CreateIndex
CREATE INDEX "TravelerIdentityClaim_passId_idx" ON "TravelerIdentityClaim"("passId");

-- CreateIndex
CREATE INDEX "TravelerIdentityClaim_claimType_idx" ON "TravelerIdentityClaim"("claimType");

-- CreateIndex
CREATE INDEX "TravelerIdentityClaim_status_idx" ON "TravelerIdentityClaim"("status");

-- CreateIndex
CREATE INDEX "TravelerIdentityClaim_verifiedAt_idx" ON "TravelerIdentityClaim"("verifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TravelerPass_identityPublicCode_key" ON "TravelerPass"("identityPublicCode");

-- AddForeignKey
ALTER TABLE "TravelerPassQrCredential" ADD CONSTRAINT "TravelerPassQrCredential_passId_fkey" FOREIGN KEY ("passId") REFERENCES "TravelerPass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerIdentityClaim" ADD CONSTRAINT "TravelerIdentityClaim_travelerId_fkey" FOREIGN KEY ("travelerId") REFERENCES "TravelerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerIdentityClaim" ADD CONSTRAINT "TravelerIdentityClaim_passId_fkey" FOREIGN KEY ("passId") REFERENCES "TravelerPass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
