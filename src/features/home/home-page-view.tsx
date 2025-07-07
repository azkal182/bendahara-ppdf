'use client'
import React from 'react'

import { Typography } from '@mui/material'

import { useAuthStore } from '@/stores/auth-store'

const HomePageView = () => {
  const { session, status } = useAuthStore()

  if (status === 'loading') return null
  const role = session!.user!.role

  if (role !== 'DIVISI') {
    return (
      <div className='flex items-center justify-center'>
        <Typography variant='h1'>Welcome To {session?.user.name}</Typography>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center '>
      <Typography variant='h1'>Welcome To {session?.user.name}</Typography>
    </div>
  )
}

export default HomePageView
