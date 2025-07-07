'use client'

import { useEffect } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Box from '@mui/material/Box'

import { userFormSchema, type UserFormData } from '@/schemas/user-schema'
import CustomTextField from '@core/components/mui/TextField'
import type { ResponseDivision } from '@/actions/divisi-action'

interface Props {
  open: boolean
  onCloseAction: () => void
  onSubmitAction: (data: UserFormData) => void
  initialData?: UserFormData
  divisions: ResponseDivision[]
}

export default function UserDialog({ open, onCloseAction, onSubmitAction, initialData, divisions }: Props) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData || {
      username: '',
      name: '',
      password: '',
      role: undefined,
      divisionId: undefined
    }
  })

  useEffect(() => {
    if (initialData) {
      console.log('initialData', initialData)
      form.reset(initialData)
    } else {
      form.reset({
        username: '',
        name: '',
        password: '',
        role: undefined,
        divisionId: undefined
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, form.reset])

  const formOnSubmit = (data: UserFormData) => {
    console.log('Submitted Data:', data)
    onSubmitAction(data)
  }

  const handleClose = () => {
    form.reset()
    onCloseAction()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{initialData ? 'Edit User' : 'Create User'}</DialogTitle>
      <DialogContent>
        <Box
          id={'form-user'}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
          component={'form'}
          onSubmit={form.handleSubmit(formOnSubmit)}
        >
          <Controller
            control={form.control}
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

          <Controller
            control={form.control}
            name={'username'}
            render={({ field, fieldState }) => (
              <CustomTextField
                label='Username'
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder='Placeholder'
                autoComplete='off'
              />
            )}
          />

          <Controller
            control={form.control}
            name={'password'}
            render={({ field, fieldState }) => (
              <CustomTextField
                sx={{ display: initialData ? 'none' : '' }}
                label='Password'
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                placeholder='Placeholder'
                autoComplete='off'
                type={'password'}
              />
            )}
          />

          <Controller
            control={form.control}
            name={'role'}
            render={({ field, fieldState }) => (
              <CustomTextField
                {...field}
                select
                fullWidth
                label='Role'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || undefined)}
              >
                <MenuItem value={undefined}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value='PUSAT'>PUSAT</MenuItem>
                <MenuItem value='DIVISI'>DIVISI</MenuItem>
              </CustomTextField>
            )}
          />

          <Controller
            control={form.control}
            name={'divisionId'}
            render={({ field, fieldState }) => (
              <CustomTextField
                {...field}
                select
                fullWidth
                label='Divisi'
                placeholder={'Pilih Divisi'}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || undefined)}
              >
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>

                {divisions?.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAction}>Cancel</Button>
        <Button type={'submit'} form={'form-user'} variant='contained'>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
