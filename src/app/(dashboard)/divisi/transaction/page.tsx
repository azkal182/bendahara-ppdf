import React from 'react'

import { getDivisionTransactions } from '@/actions/divisi-action'
import { auth } from '@/lib/auth'
import NotFoundPage from '@/app/[...not-found]/page'
import DivisionTransactionPageView from '@/features/transaction/divisi/division-transaction-page-view'

const TransactionPage = async () => {
  const session = await auth()

  if (!session?.user.divisionId) return NotFoundPage()

  const data = await getDivisionTransactions(session.user.divisionId)

  console.log(JSON.stringify(data, null, 2))

  return (
    <div>
      <DivisionTransactionPageView data={data} />
    </div>
  )
}

export default TransactionPage
