'use server'
import prisma from '@/lib/prisma'
import type { TransferToCentralInput } from '@/schemas/transfer-to-central-schema'
import { transferToCentralSchema } from '@/schemas/transfer-to-central-schema'

export type PusatTransactionItem = {
  id: string
  date: Date
  description: string
  credit: number | null
  debit: number | null
  balance: number
  userId: string
  accountId: string
}

export const getTransactionsCentral = async (): Promise<PusatTransactionItem[]> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          isCentral: true
        }
      },
      include: {
        account: true,
        user: true,
        division: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    let runningBalance = 0

    const formatted: PusatTransactionItem[] = transactions.map(tx => {
      const credit = tx.type === 'INCOME' ? tx.amount : null
      const debit = tx.type === 'EXPENSE' ? tx.amount : null

      if (tx.type === 'INCOME') {
        runningBalance += tx.amount
      } else {
        runningBalance -= tx.amount
      }

      return {
        id: tx.id,
        date: tx.date,
        description: tx.description,
        credit,
        debit,
        balance: runningBalance,
        userId: tx.userId,
        accountId: tx.accountId
      }
    })

    return formatted
  } catch (error) {
    console.error('Error fetching division transactions:', error)

    return []
  }
}

export async function createTransferFromDivisionToCentral(input: TransferToCentralInput): Promise<{
  success: boolean
  message: string
}> {
  const parsed = transferToCentralSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    }
  }

  const payload = parsed.data

  console.log(JSON.stringify(payload, null, 2))

  try {
    await prisma.$transaction(async tx => {
      const division = await tx.division.findUnique({
        where: { id: payload.divisionId },
        include: { expenseAccount: true }
      })

      console.log('[DEBUG] Division:', division)

      if (!division || !division.expenseAccount) {
        console.warn('[WARN] Division or expense account not found')

        return {
          success: false,
          message: 'Divisi atau akun pengeluaran tidak ditemukan'
        }
      }

      const centralIncomeAccount = await tx.account.findFirst({
        where: {
          isCentral: true,
          type: 'INCOME'
        }
      })

      console.log('[DEBUG] Central Income Account:', centralIncomeAccount)

      if (!centralIncomeAccount) {
        console.warn('[WARN] Central income account not found')

        return {
          success: false,
          message: 'Akun pemasukan pusat tidak ditemukan'
        }
      }

      const existingBill = await tx.monthlyDivisionBill.findFirst({
        where: {
          divisionId: division.id,
          year: payload.year,
          month: payload.month
        }
      })

      console.log('[DEBUG] Existing Monthly Bill:', existingBill)

      if (!existingBill) {
        return {
          success: false,
          message: 'Tagihan bulanan tidak ditemukan untuk divisi dan periode ini'
        }
      }

      if (existingBill.status === 'PAID') {
        return {
          success: false,
          message: 'Tagihan bulanan sudah dibayar'
        }
      }

      const fromTransaction = await tx.transaction.create({
        data: {
          accountId: division.expenseAccount.id,
          divisionId: division.id,
          amount: payload.amount,
          description: payload.description || 'Setoran ke pusat',
          type: 'EXPENSE',
          userId: payload.userId
        }
      })

      console.log('[DEBUG] From Transaction:', fromTransaction)

      const toTransaction = await tx.transaction.create({
        data: {
          accountId: centralIncomeAccount.id,
          amount: payload.amount,
          description: `Penerimaan dari ${division.name}`,
          type: 'INCOME',
          userId: payload.userId
        }
      })

      console.log('[DEBUG] To Transaction:', toTransaction)

      const transfer = await tx.transferToCentral.create({
        data: {
          fromDivisionId: division.id,
          amount: payload.amount,
          date: new Date(),
          description: payload.description,
          fromTransactionId: fromTransaction.id,
          toTransactionId: toTransaction.id
        }
      })

      console.log('[DEBUG] Transfer Record:', transfer)

      const updatedBill = await tx.monthlyDivisionBill.update({
        where: {
          id: existingBill.id
        },
        data: {
          status: 'PAID',
          transferId: transfer.id
        }
      })

      console.log('[DEBUG] Updated Monthly Bill:', updatedBill)
    })

    return {
      success: true,
      message: 'Transfer berhasil dan tagihan ditandai lunas'
    }
  } catch (err) {
    console.error('[Transfer Error]', err)

    return {
      success: false,
      message: err instanceof Error ? err.message : 'Terjadi kesalahan tak terduga'
    }
  }
}
