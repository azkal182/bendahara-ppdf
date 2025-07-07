'use client'

import { CircularProgress } from '@mui/material'

export default function FullPageLoading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80'>
      <div className='flex flex-col items-center gap-4'>
        <CircularProgress />
        <p className='text-gray-700 dark:text-gray-200 text-sm font-medium'>Loading...</p>
      </div>
    </div>
  )
}
