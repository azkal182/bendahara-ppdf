'use client'
import React, { useState } from 'react'

import { Button, Card, CardContent } from '@mui/material'
import Typography from '@mui/material/Typography'

import type { PusatTransactionItem } from '@/actions/pusat-action'
import { useAuthStore } from '@/stores/auth-store'
import PusatTransactionTable from './components/division-transaction-table'

interface PusatTransactionPageViewProps {
  data: PusatTransactionItem[]
}

const PusatTransactionPageView = ({ data }: PusatTransactionPageViewProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { session } = useAuthStore()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <Typography variant='h4'>Transaksi</Typography>
      <Card className={'mt-4'}>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <Button startIcon={<i className='tabler-plus' />} variant={'contained'}>
              Tambah
            </Button>
            <Button startIcon={<i className='tabler-plus' />} variant={'contained'}>
              Setoran Divisi
            </Button>
          </div>
          <div className={'mt-4'}>
            <PusatTransactionTable data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PusatTransactionPageView
