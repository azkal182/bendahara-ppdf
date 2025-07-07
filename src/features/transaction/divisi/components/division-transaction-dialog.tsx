import React, { useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material'

import Box from '@mui/material/Box'

import { subDays, eachDayOfInterval } from 'date-fns'
import { id } from 'date-fns/locale'

import type { DivisionTransactionFormInput } from '@/schemas/division-transaction-schema'
import { divisionTransactionFormSchema } from '@/schemas/division-transaction-schema'
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/lib/styles/AppReactDatepicker'

interface DivisionTransactionDialogProps {
  open: boolean
  onCloseAction: () => void
  onSubmitAction: (data: DivisionTransactionFormInput) => void
  initialData?: DivisionTransactionFormInput
}

const DivisionTransactionDialog = ({
  open,
  onCloseAction,
  onSubmitAction,
  initialData
}: DivisionTransactionDialogProps) => {
  const form = useForm<DivisionTransactionFormInput>({
    resolver: zodResolver(divisionTransactionFormSchema),
    defaultValues: initialData || {
      date: new Date(),
      description: '',
      amount: 0,
      type: 'INCOME'
    }
  })

  const today = new Date()
  const sevenDaysAgo = subDays(today, 7)

  const includeDates = eachDayOfInterval({
    start: sevenDaysAgo,
    end: today
  })

  const onSubmit = (data: DivisionTransactionFormInput) => {
    onSubmitAction(data)
  }

  const handleClose = () => {
    form.reset()
    onCloseAction()
  }

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    } else {
      form.reset({
        date: new Date(),
        description: '',
        amount: 0,
        type: 'INCOME'
      })
    }
  }, [initialData, form.reset])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <DialogTitle>tambah</DialogTitle>
      <DialogContent>
        <Box
          id={'form-division-transaction'}
          component={'form'}
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <Controller
            control={form.control}
            name={'date'}
            render={({ field }) => (
              <AppReactDatepicker
                onChange={date => field.onChange(date)}
                selected={field.value}
                id='include-dates'
                customInput={<CustomTextField label='Tanggal' fullWidth />}
                includeDates={includeDates}
                withPortal
                locale={id}
                dateFormat={'dd-MMMM-yyyy'}
              />
            )}
          />
          <Controller
            control={form.control}
            name={'description'}
            render={({ field, fieldState }) => (
              <CustomTextField
                label='Keterangan'
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder='Keterangan'
                autoComplete='off'
              />
            )}
          />
          <Controller
            control={form.control}
            name={'amount'}
            render={({ field, fieldState }) => (
              <CustomTextField
                label='Jumlah'
                type={'number'}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder='Rp. xxx.xxx'
                autoComplete='off'
              />
            )}
          />
          <Controller
            control={form.control}
            name={'type'}
            render={({ field, fieldState }) => (
              <CustomTextField
                label='Tipe'
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder='Rp. xxx.xxx'
                select
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || undefined)}
              >
                <MenuItem value={'INCOME'}>PEMASUKAN</MenuItem>
                <MenuItem value={'EXPENSE'}>PENGELUARAN</MenuItem>
              </CustomTextField>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAction}>Cancel</Button>
        <Button type={'submit'} form={'form-division-transaction'} variant='contained'>
          cretae
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DivisionTransactionDialog
