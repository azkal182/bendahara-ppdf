'use client'
import React, { useEffect } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import Box from '@mui/material/Box'

import type { DivisionSchemaInput } from '@/schemas/division-schema'
import { DivisionSchema } from '@/schemas/division-schema'
import CustomTextField from '@core/components/mui/TextField'

interface DivisionDialogProps {
  open: boolean
  onCloseAction: () => void
  onSubmitAction: (data: DivisionSchemaInput) => void
  initialData?: DivisionSchemaInput
}

const DivisionDialog = ({ open, onCloseAction, onSubmitAction, initialData }: DivisionDialogProps) => {
  const formDivision = useForm<DivisionSchemaInput>({
    resolver: zodResolver(DivisionSchema),
    defaultValues: initialData || {
      name: ''
    }
  })

  const onDivisionSubmit = (data: DivisionSchemaInput) => {
    onSubmitAction(data)
  }

  const handleClose = () => {
    formDivision.reset()
    onCloseAction()
  }

  useEffect(() => {
    if (initialData) {
      formDivision.reset(initialData)
    } else {
      formDivision.reset({
        name: '',
        id: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, formDivision.reset])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <DialogTitle>tambah</DialogTitle>
      <DialogContent>
        <Box
          id={'form-division'}
          component={'form'}
          onSubmit={formDivision.handleSubmit(onDivisionSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <Controller
            control={formDivision.control}
            name={'name'}
            render={({ field, fieldState }) => (
              <CustomTextField
                label='Name'
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder='Placeholder'
                autoComplete='off'
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAction}>Cancel</Button>
        <Button type={'submit'} form={'form-division'} variant='contained'>
          cretae
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DivisionDialog
