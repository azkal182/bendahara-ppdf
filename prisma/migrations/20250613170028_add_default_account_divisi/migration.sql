/*
  Warnings:

  - A unique constraint covering the columns `[incomeAccountId]` on the table `Division` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expenseAccountId]` on the table `Division` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "divisionId" TEXT;

-- AlterTable
ALTER TABLE "Division" ADD COLUMN     "expenseAccountId" TEXT,
ADD COLUMN     "incomeAccountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Division_incomeAccountId_key" ON "Division"("incomeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Division_expenseAccountId_key" ON "Division"("expenseAccountId");

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_incomeAccountId_fkey" FOREIGN KEY ("incomeAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_expenseAccountId_fkey" FOREIGN KEY ("expenseAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE SET NULL ON UPDATE CASCADE;
