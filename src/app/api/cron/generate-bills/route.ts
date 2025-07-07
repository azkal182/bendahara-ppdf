import { DateTime } from 'luxon'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const now = DateTime.now().setZone('Asia/Jakarta')

    const tomorrow = now.plus({ days: 1 })

    // if (tomorrow.month !== now.month) {
    const year = now.year
    const month = now.month

    const startOfMonth = DateTime.local(year, month, 1).startOf('day').toUTC()
    const endOfMonth = DateTime.local(year, month, 1).endOf('month').toUTC()

    const divisions = await prisma.division.findMany()

    for (const division of divisions) {
      const existing = await prisma.monthlyDivisionBill.findFirst({
        where: { divisionId: division.id, year, month }
      })

      if (existing) continue

      const incomeSum = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          divisionId: division.id,
          type: 'INCOME',
          date: {
            gte: startOfMonth.toJSDate(),
            lte: endOfMonth.toJSDate()
          }
        }
      })

      const total = incomeSum._sum.amount || 0
      const amount = Math.floor(total * 0.4)

      if (amount > 0) {
        await prisma.monthlyDivisionBill.create({
          data: {
            divisionId: division.id,
            year,
            month,
            amount,
            status: 'UNPAID'
          }
        })

        console.log(`✅ Created bill for ${division.name}: Rp ${amount}`)
      }
    }

    // }

    return new Response(JSON.stringify({ success: true }))
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 })
  }
}
