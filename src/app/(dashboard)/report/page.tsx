// import React from 'react'

// import { Typography } from '@mui/material'

// import { getMonthlyDivisionBills } from '@/actions/monthly-division-bill-action'
// import MonthlyBillPageView from '@/features/monthly-bill/monthly-bill-page-view'

// const ReportPage = async () => {
//   const data = await getMonthlyDivisionBills(2025, 6)

//   console.log('Data fetched for report page:', data)

//   return (
//     <div>
//       <Typography variant='h3' gutterBottom>
//         Report Page
//       </Typography>
//       <Typography variant='body1'>
//         Ini adalah halaman laporan tempat Anda dapat melihat berbagai laporan dan analitik.
//       </Typography>
//       <MonthlyBillPageView data={data} />
//     </div>
//   )
// }

// export default ReportPage

// app/(dashboard)/report/page.tsx

import { Typography } from '@mui/material'

import MonthlyBillPageView from '@/features/monthly-bill/monthly-bill-page-view'

const ReportPage = () => {
  return (
    <div>
      <Typography variant='h3' gutterBottom>
        Tagihan
      </Typography>
      <div className='mt-4'>
        <MonthlyBillPageView />
      </div>
    </div>
  )
}

export default ReportPage
