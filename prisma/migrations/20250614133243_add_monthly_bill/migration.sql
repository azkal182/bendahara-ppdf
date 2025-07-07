-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateTable
CREATE TABLE "MonthlyDivisionBill" (
    "id" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "BillStatus" NOT NULL,
    "transferId" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyDivisionBill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyDivisionBill_transferId_key" ON "MonthlyDivisionBill"("transferId");

-- CreateIndex
CREATE INDEX "MonthlyDivisionBill_status_idx" ON "MonthlyDivisionBill"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyDivisionBill_divisionId_year_month_key" ON "MonthlyDivisionBill"("divisionId", "year", "month");

-- AddForeignKey
ALTER TABLE "MonthlyDivisionBill" ADD CONSTRAINT "MonthlyDivisionBill_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyDivisionBill" ADD CONSTRAINT "MonthlyDivisionBill_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "TransferToCentral"("id") ON DELETE SET NULL ON UPDATE CASCADE;
