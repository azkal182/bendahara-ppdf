import React, { useState } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material'

import toast from 'react-hot-toast'

import type { MonthlyDivisionBillResponse } from '@/actions/monthly-division-bill-action'
import { toRupiah } from '@/utils/to-rupiah'
import { useAuthStore } from '@/stores/auth-store'
import CustomTextField from '@/@core/components/mui/TextField'
import { createTransferFromDivisionToCentral } from '@/actions/pusat-action'

interface MonthlyBillTableProps {
  data: MonthlyDivisionBillResponse[]
  monthAndYear?: boolean
}

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

const MonthlyBillTable = ({ data, monthAndYear = false }: MonthlyBillTableProps) => {
  const { session } = useAuthStore()
  const [selectedBill, setSelectedBill] = useState<MonthlyDivisionBillResponse | null>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handlePayment = (data: MonthlyDivisionBillResponse) => {
    setSelectedBill(data)
    setDialogOpen(true)

    // const form = {
    //   divisionId: data.id,
    //   amount: data.amount,
    //   userId: session!.user!.id,
    //   year: data.year,
    //   month: data.month
    // }

    // console.log(JSON.stringify(form))
  }

  const onSubmitPayment = () => {
    if (selectedBill !== null) {
      const form = {
        divisionId: selectedBill!.divisionId,
        amount: selectedBill!.amount,
        userId: session!.user!.id,
        year: selectedBill!.year,
        month: selectedBill!.month
      }

      createTransferFromDivisionToCentral(form).then(response => {
        if (response.success) {
          toast.success(response?.message ? response.message : 'payment created successfully.')
          setDialogOpen(false)
          window.location.reload()
        } else {
          toast.error('payment created failed')
        }
      })
    }
  }

  return (
    <div className='w-full overflow-x-auto'>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Nama Divisi</TableCell>
            {monthAndYear && <TableCell>Bulan</TableCell>}
            <TableCell>Jumlah</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                {index + 1}
              </TableCell>
              <TableCell>{item.divisionName}</TableCell>
              {monthAndYear && <TableCell>{`${months[item.month]} - ${item.year}`}</TableCell>}
              <TableCell>{toRupiah(item.amount)}</TableCell>
              <TableCell>
                {item.status === 'PAID' ? (
                  <span className='bg-green-300 dark:bg-green-800 text-xs px-1.5 py-0.5 rounded-full'>Lunas</span>
                ) : (
                  <span className='bg-red-300 dark:bg-red-800 text-xs px-1.5 py-0.5 rounded-full'>Belum</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handlePayment(item)}
                  disabled={item.status === 'PAID'}
                  size='small'
                  variant='contained'
                >
                  Bayar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen}>
        <DialogTitle>Bayar</DialogTitle>
        <DialogContent>
          <CustomTextField disabled fullWidth label='Divisi' value={selectedBill?.divisionName} aria-readonly />
          <CustomTextField
            disabled
            fullWidth
            label='Bulan'
            value={selectedBill ? months[selectedBill?.month] : ''}
            aria-readonly
          />
          <CustomTextField disabled fullWidth label='Tahun' value={selectedBill?.year} aria-readonly />
          <CustomTextField
            fullWidth
            label='Jumlah'
            value={selectedBill ? toRupiah(selectedBill?.amount) : ''}
            aria-readonly
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant='outlined'>
            Batal
          </Button>
          <Button variant='contained' onClick={onSubmitPayment}>
            Bayar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MonthlyBillTable
