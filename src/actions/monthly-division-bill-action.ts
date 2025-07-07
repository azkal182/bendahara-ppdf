'use server'

import prisma from '@/lib/prisma'

export type MonthlyDivisionBillResponse = {
  id: string
  year: number
  month: number
  amount: number
  status: 'UNPAID' | 'PAID'
  createdAt: Date
  paidAt: Date | null
  divisionName: string
  divisionId: string
}

export const getMonthlyDivisionBills = async (year: number, month: number): Promise<MonthlyDivisionBillResponse[]> => {
  try {
    const bills = await prisma.monthlyDivisionBill.findMany({
      where: {
        year,
        month
      },
      include: {
        division: true
      }
    })

    const formattedBills = bills.map(bill => ({
      id: bill.id,
      year: bill.year,
      month: bill.month,
      amount: bill.amount,
      status: bill.status,
      createdAt: bill.createdAt,
      paidAt: bill.paidAt,
      divisionName: bill.division.name,
      divisionId: bill.divisionId
    }))

    return formattedBills
  } catch (error) {
    console.error('Error fetching monthly division bills:', error)
    throw error
  }
}

export const getMonthlyBillsByDivisionId = async (divisionId: string): Promise<MonthlyDivisionBillResponse[]> => {
  try {
    const result = await prisma.monthlyDivisionBill.findMany({
      where: {
        divisionId
      },
      include: {
        division: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 12
    })

    const formattedBills = result.reverse().map(bill => ({
      id: bill.id,
      year: bill.year,
      month: bill.month,
      amount: bill.amount,
      status: bill.status,
      createdAt: bill.createdAt,
      paidAt: bill.paidAt,
      divisionName: bill.division.name,
      divisionId: bill.divisionId
    }))

    return formattedBills
  } catch (error) {
    console.error('Error fetching monthly bills by division ID:', error)

    return []
  }
}
