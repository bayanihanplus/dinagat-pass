-- CreateTable
CREATE TABLE "ExperienceFamilyRegistry" (
    "id" TEXT NOT NULL,
    "code" "ExperienceFamilyCode" NOT NULL,
    "title" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceFamilyRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemRecord" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceFamilyRegistry_code_key" ON "ExperienceFamilyRegistry"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SystemRecord_key_key" ON "SystemRecord"("key");
