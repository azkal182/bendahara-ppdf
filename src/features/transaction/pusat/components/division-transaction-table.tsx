import React from 'react'

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'

import { toRupiah } from '@/utils/to-rupiah'
import type { PusatTransactionItem } from '@/actions/pusat-action'

interface PusatTransactionTableProps {
  data: PusatTransactionItem[]
}

const PusatTransactionTable = ({ data }: PusatTransactionTableProps) => {
  return (
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>Tanggal</TableCell>
          <TableCell>Keterangan</TableCell>
          <TableCell>Pemasukan</TableCell>
          <TableCell>Pengeluaran</TableCell>
          <TableCell>Saldo</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component='th' scope='row'>
              {index + 1}
            </TableCell>
            <TableCell>{format(item.date, 'PPP', { locale: id })}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.credit ? toRupiah(item.credit) : '-'}</TableCell>
            <TableCell>{item.debit ? toRupiah(item.debit) : '-'}</TableCell>
            <TableCell>{item.balance ? toRupiah(item.balance) : '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PusatTransactionTable
