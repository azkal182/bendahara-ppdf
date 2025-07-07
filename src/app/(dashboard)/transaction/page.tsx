import React from 'react'

import { getTransactionsCentral } from '@/actions/pusat-action'
import PusatTransactionPageView from '@/features/transaction/pusat/pusat-transaction-page-view'

const page = async () => {
  const data = await getTransactionsCentral()

  console.log(JSON.stringify(data, null, 2))

  return <PusatTransactionPageView data={data} />
}

export default page
