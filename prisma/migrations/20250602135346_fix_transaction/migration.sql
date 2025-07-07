/*
  Warnings:

  - You are about to drop the column `transactionId` on the `TransferToCentral` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fromTransactionId]` on the table `TransferToCentral` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[toTransactionId]` on the table `TransferToCentral` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromTransactionId` to the `TransferToCentral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toTransactionId` to the `TransferToCentral` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TransferToCentral" DROP CONSTRAINT "TransferToCentral_transactionId_fkey";

-- DropIndex
DROP INDEX "TransferToCentral_transactionId_key";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransferToCentral" DROP COLUMN "transactionId",
ADD COLUMN     "fromTransactionId" TEXT NOT NULL,
ADD COLUMN     "toTransactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TransferToCentral_fromTransactionId_key" ON "TransferToCentral"("fromTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferToCentral_toTransactionId_key" ON "TransferToCentral"("toTransactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferToCentral" ADD CONSTRAINT "TransferToCentral_fromTransactionId_fkey" FOREIGN KEY ("fromTransactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferToCentral" ADD CONSTRAINT "TransferToCentral_toTransactionId_fkey" FOREIGN KEY ("toTransactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
