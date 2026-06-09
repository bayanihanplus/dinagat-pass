/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `AuthSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionTokenHash]` on the table `AuthSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionTokenHash` to the `AuthSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AuthSession_sessionToken_key";

-- AlterTable
ALTER TABLE "AuthSession" DROP COLUMN "sessionToken",
ADD COLUMN     "sessionTokenHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthSession_sessionTokenHash_key" ON "AuthSession"("sessionTokenHash");
