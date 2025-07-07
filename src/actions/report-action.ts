'use server'

import type { Prisma } from '@prisma/client'

import prisma from '@/lib/prisma'

export type ReportResponse = Prisma.TransactionGetPayload<{
  include: {
    division: true
    account: true
    user: true
    toTransfer: true
    fromTransfer: true
  }
}>

export const getReport = async (): Promise<ReportResponse[]> => {
  try {
    const reports = await prisma.transaction.findMany({
      where: {
        AND: [
          {
            user: {
              role: 'PUSAT'
            }
          },
          {
            account: {
              isCentral: true
            }
          }
        ]
      },
      include: {
        division: true,
        account: true,
        user: true,
        toTransfer: true,
        fromTransfer: true
      }
    })

    console.log(JSON.stringify(reports, null, 2))

    return reports
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw error
  }
}
