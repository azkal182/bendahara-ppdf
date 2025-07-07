'use client'
import React, { useState } from 'react'

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import DialogCloseButton from '@components/DialogCloseButton'

import type { ReportResponse } from '@/actions/report-action'
import CustomTextField from '@/@core/components/mui/TextField'

type ReportPageProps = {
  data: ReportResponse[]
}

const ReportPageView = ({ data }: ReportPageProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  return (
    <div>
      <Card className='mt-4'>
        <CardContent>
          <div className='flex items-center justify-between mb-4'>
            <Button onClick={handleClickOpen} variant='contained' startIcon={<i className='tabler-plus' />}>
              Setoran divisi
            </Button>
            <div className='w-44'>
              <CustomTextField select fullWidth defaultValue='10' label='Bulan' id='custom-select'>
                <MenuItem value={10}>MARET 2025</MenuItem>
                <MenuItem value={20}>APRIL 2025</MenuItem>
                <MenuItem value={30}>MEI 2025</MenuItem>
              </CustomTextField>
            </div>
          </div>
          <TableContainer sx={{ maxHeight: 440 }} className='mt-4'>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell width={8}>No</TableCell>
                  <TableCell align='center'>Tanggal</TableCell>
                  <TableCell align='left'>description</TableCell>
                  <TableCell align='center'>Pemasukan</TableCell>
                  <TableCell align='center'>Pengeluaran</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell width={8}>{index + 1}</TableCell>
                    <TableCell align='center'>{item.date.toLocaleDateString()}</TableCell>
                    <TableCell align='left'>{item.description}</TableCell>
                    <TableCell align='center'>
                      {item.account.type === 'INCOME'
                        ? Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'idr',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(item.amount)
                        : '-'}
                    </TableCell>
                    <TableCell align='center'>
                      {item.account.type === 'EXPENSE'
                        ? Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'idr',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(item.amount)
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* modal */}
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
        maxWidth='xs'
        fullWidth={true}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Setoran Divisi
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <div>
            <CustomTextField fullWidth={true} label='Jumlah' placeholder='Rp.xxx.xxx' type={'number'} />
            <CustomTextField fullWidth={true} label='Jumlah' placeholder='Rp.xxx.xxx' type={'number'} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='tonal' color='secondary'>
            Close
          </Button>
          <Button onClick={handleClose} variant='contained'>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ReportPageView
