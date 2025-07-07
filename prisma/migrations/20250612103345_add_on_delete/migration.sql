-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "TransferToCentral" DROP CONSTRAINT "TransferToCentral_fromDivisionId_fkey";

-- DropForeignKey
ALTER TABLE "TransferToCentral" DROP CONSTRAINT "TransferToCentral_fromTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "TransferToCentral" DROP CONSTRAINT "TransferToCentral_toTransactionId_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferToCentral" ADD CONSTRAINT "TransferToCentral_fromDivisionId_fkey" FOREIGN KEY ("fromDivisionId") REFERENCES "Division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferToCentral" ADD CONSTRAINT "TransferToCentral_fromTransactionId_fkey" FOREIGN KEY ("fromTransactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferToCentral" ADD CONSTRAINT "TransferToCentral_toTransactionId_fkey" FOREIGN KEY ("toTransactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
