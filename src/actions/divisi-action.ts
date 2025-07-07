'use server'
import { revalidatePath } from 'next/cache'

import type { Prisma, TransactionType } from '@prisma/client'

import prisma from '@/lib/prisma'
import type { DivisionSchemaInput } from '@/schemas/division-schema'
import { DivisionSchema } from '@/schemas/division-schema'
import type { CreateDivisionTransactionInput } from '@/schemas/division-transaction-schema'
import { createDivisionTransactionSchema, DivisionTransactionFormInput } from '@/schemas/division-transaction-schema'

export type ResponseDivision = Prisma.DivisionGetPayload<{}>

export const getDivisi = async (): Promise<ResponseDivision[]> => {
  try {
    return await prisma.division.findMany({})
  } catch (error) {
    console.error('Error fetching divisions:', error)
    throw error
  }
}

export const getDivisiById = async (id: string) => {
  try {
    const division = await prisma.division.findUnique({
      where: { id }
    })

    if (!division) {
      throw new Error(`division with ID ${id} not found`)
    }

    return division
  } catch (error) {
    console.error('Error fetching division by ID:', error)
    throw error
  }
}

export const createDivision = async (data: DivisionSchemaInput) => {
  try {
    const parse = DivisionSchema.safeParse(data)

    if (!parse.success) {
      const formatted = parse.error.flatten()

      return {
        success: false,
        errors: formatted.fieldErrors
      }
    }

    const { name } = parse.data

    await prisma.$transaction(async tx => {
      const division = await tx.division.create({
        data: {
          name: name
        }
      })

      const incomeAccount = await tx.account.create({
        data: {
          name: `Kas Masuk - ${division.name}`,
          type: 'INCOME',
          isCentral: false,
          divisionId: division.id
        }
      })

      const expenseAccount = await tx.account.create({
        data: {
          name: `Kas Keluar - ${division.name}`,
          type: 'EXPENSE',
          isCentral: false,
          divisionId: division.id
        }
      })

      // Update divisi dengan ID akun default
      await tx.division.update({
        where: { id: division.id },
        data: {
          incomeAccountId: incomeAccount.id,
          expenseAccountId: expenseAccount.id
        }
      })
    })

    // await prisma.division.create({
    //   data: {
    //     name
    //   }
    // })

    return {
      success: true,
      message: 'Divisi berhasil dibuat'
    }
  } catch (error) {
    console.error('Error creating division:', error)
    throw error
  }
}

export const updateDivision = async (data: DivisionSchemaInput) => {
  try {
    const parse = DivisionSchema.safeParse(data)

    if (!parse.success) {
      const formatted = parse.error.flatten()

      return {
        success: false,
        errors: formatted.fieldErrors
      }
    }

    const { name, id } = parse.data

    if (!id) {
      return {
        success: false,
        errors: 'id is required'
      }
    }

    await prisma.division.update({
      where: { id },
      data: {
        name
      }
    })

    return {
      success: true,
      message: 'Divisi berhasil di edit'
    }
  } catch (error) {
    console.error('Error updating division:', error)
    throw error
  }
}

export const deleteDivisi = async (id: string) => {
  try {
    await prisma.division.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'Divisi berhasil dihapus'
    }
  } catch (error) {
    console.error('Error deleting division:', error)
    throw error
  }
}

export const getDivisiWithUsers = async () => {
  try {
    return await prisma.division.findMany({
      include: {
        users: true // Include related users
      }
    })
  } catch (error) {
    console.error('Error fetching divisions with users:', error)
    throw error
  }
}

// export const createDivisionTransaction = async (input: CreateDivisionTransactionInput) => {
//   try {
//     const parse = createDivisionTransactionSchema.safeParse(input)
//
//     if (!parse.success) {
//       const formatted = parse.error.flatten()
//
//       return {
//         success: false,
//         errors: formatted.fieldErrors
//       }
//     }
//
//     const { divisionId, userId, amount, description, type, date } = parse.data
//
//     const division = await prisma.division.findUnique({
//       where: { id: divisionId },
//       include: {
//         incomeAccount: true,
//         expenseAccount: true
//       }
//     })
//
//     if (!division) {
//       return {
//         success: false,
//         message: 'Divisi tidak ditemukan.'
//       }
//     }
//
//     const accountId = type === 'INCOME' ? division.incomeAccount?.id : division.expenseAccount?.id
//
//     if (!accountId) {
//       return {
//         success: false,
//         message: `Akun ${type.toLowerCase()} tidak tersedia untuk divisi ini.`
//       }
//     }
//
//     await prisma.transaction.create({
//       data: {
//         accountId,
//         divisionId: division.id,
//         amount,
//         description,
//         type,
//         userId,
//         date: date || new Date()
//       }
//     })
//
//     return {
//       success: true,
//       message: 'Transaksi berhasil dibuat.'
//     }
//   } catch (error: any) {
//     console.error('Gagal membuat transaksi:', error)
//
//     return {
//       success: false,
//       message: 'Terjadi kesalahan pada server.'
//     }
//   }
// }

export type DivisionTransactionItem = {
  id: string
  date: Date
  description: string
  credit: number | null
  debit: number | null
  balance: number
  userId: string
  accountId: string
}

export const getDivisionTransactions = async (divisionId: string): Promise<DivisionTransactionItem[]> => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { divisionId },
      orderBy: { date: 'asc' } // agar running balance benar
    })

    let runningBalance = 0

    const formatted: DivisionTransactionItem[] = transactions.map(tx => {
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

export const createDivisionTransaction = async (input: unknown) => {
  try {
    // Validasi input dengan Zod schema lengkap
    const data = createDivisionTransactionSchema.parse(input)

    const { divisionId, userId, amount, description, type, date } = data

    const division = await prisma.division.findUnique({
      where: { id: divisionId },
      include: {
        incomeAccount: true,
        expenseAccount: true
      }
    })

    if (!division) {
      return {
        success: false,
        message: 'Divisi tidak ditemukan.'
      }
    }

    const accountId = type === 'INCOME' ? division.incomeAccount?.id : division.expenseAccount?.id

    if (!accountId) {
      return {
        success: false,
        message: `Akun ${type.toLowerCase()} tidak tersedia untuk divisi ini.`
      }
    }

    await prisma.transaction.create({
      data: {
        accountId,
        divisionId,
        amount,
        description,
        type,
        userId,
        date: date || new Date()
      }
    })

    revalidatePath('/divisi/transaction')

    return {
      success: true,
      message: 'Transaksi berhasil dibuat.'
    }
  } catch (error: any) {
    console.error('Gagal membuat transaksi:', error)

    return {
      success: false,
      message: error?.message || 'Terjadi kesalahan pada server.'
    }
  }
}
