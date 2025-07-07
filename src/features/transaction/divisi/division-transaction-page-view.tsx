'use client'
import React, { useState } from 'react'

import Typography from '@mui/material/Typography'

import { Button, Card, CardContent, Grid } from '@mui/material'

import toast from 'react-hot-toast'

import type { DivisionTransactionItem } from '@/actions/divisi-action'
import { createDivisionTransaction } from '@/actions/divisi-action'

import DivisionTransactionTable from '@/features/transaction/divisi/components/division-transaction-table'
import DivisionTransactionDialog from '@/features/transaction/divisi/components/division-transaction-dialog'
import type { DivisionTransactionFormInput } from '@/schemas/division-transaction-schema'
import { useAuthStore } from '@/stores/auth-store'

interface DivisionTransactionPageViewProps {
  data: DivisionTransactionItem[]
}

const DivisionTransactionPageView = ({ data }: DivisionTransactionPageViewProps) => {
  const { session } = useAuthStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  const calculateTotals = (transactions: typeof data) => {
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach(transaction => {
      if (transaction.credit !== null) {
        totalIncome += transaction.credit
      }

      if (transaction.debit !== null) {
        totalExpense += transaction.debit
      }
    })

    return { totalIncome, totalExpense }
  }

  // Menghitung total pemasukan dan pengeluaran
  const { totalIncome, totalExpense } = calculateTotals(data)

  const tax = totalIncome * 0.4

  const latestTransaction = data[data.length - 1]
  const latestBalance = latestTransaction ? latestTransaction.balance : 0

  const onSubmit = (data: DivisionTransactionFormInput) => {
    createDivisionTransaction({
      ...data,
      userId: session!.user!.id,
      divisionId: session!.user!.divisionId
    }).then(response => {
      if (response.success) {
        toast.success(response?.message ? response.message : 'transaction created successfully.')
        setDialogOpen(false)
      } else {
        toast.error('transaction created failed')
      }
    })
  }

  const handleCreate = () => {
    setDialogOpen(true)
  }

  return (
    <div>
      <Typography variant='h4'>Transaksi</Typography>
      {/* Total Pemasukan dan Pengeluaran */}
      <Grid container spacing={2} className='mt-4'>
        <Grid item xs={12} sm={3}>
          <Card style={{ padding: '16px', borderBottom: '4px solid #2196f3' }}>
            {' '}
            {/* Blue border for balance */}
            <Typography variant='h5' color='textPrimary'>
              Saldo Terakhir
            </Typography>
            <Typography variant='h6'>{latestBalance.toLocaleString()}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card style={{ padding: '16px', borderBottom: '4px solid #4caf50' }}>
            {' '}
            {/* Green border for income */}
            <Typography variant='h5' color='textPrimary'>
              Pemasukan
            </Typography>
            <Typography variant='h6'>{totalIncome.toLocaleString()}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card style={{ padding: '16px', borderBottom: '4px solid #f44336' }}>
            {' '}
            {/* Red border for expenses */}
            <Typography variant='h5' color='textPrimary'>
              Pengeluaran
            </Typography>
            <Typography variant='h6'>{totalExpense.toLocaleString()}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Card style={{ padding: '16px', borderBottom: '4px solid #ff9800' }}>
            {' '}
            {/* Orange border for tax */}
            <Typography variant='h5' color='textPrimary'>
              Pajak (40% Pemasukan)
            </Typography>
            <Typography variant='h6'>{tax.toLocaleString()}</Typography>
          </Card>
        </Grid>
      </Grid>

      <Card className={'mt-4'}>
        <CardContent>
          <div>
            <Button onClick={handleCreate} startIcon={<i className='tabler-plus' />} variant={'contained'}>
              Tambah
            </Button>
          </div>
          <div className={'mt-4'}>
            <DivisionTransactionTable data={data} />
          </div>
        </CardContent>
      </Card>
      <DivisionTransactionDialog
        open={dialogOpen}
        onSubmitAction={onSubmit}
        onCloseAction={() => setDialogOpen(false)}
      />
    </div>
  )
}

export default DivisionTransactionPageView
