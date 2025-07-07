import React from 'react'

import { getDivisi } from '@/actions/divisi-action'
import DivisiPageView from '@/features/divisi/divisi-page-view'

const page = async () => {
  const data = await getDivisi()

  return (
    <div>
      <DivisiPageView divisions={data} />
    </div>
  )
}

export default page
