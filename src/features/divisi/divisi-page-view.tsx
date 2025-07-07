'use client'
import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent } from '@mui/material'

import Typography from '@mui/material/Typography'

import toast from 'react-hot-toast'

import type { ResponseDivision } from '@/actions/divisi-action'
import { createDivision, updateDivision } from '@/actions/divisi-action'
import DivisionTable from '@/features/divisi/components/division-table'
import DivisionDialog from '@/features/divisi/components/division-dialog'
import type { DivisionSchemaInput } from '@/schemas/division-schema'

interface DivisiPageViewProps {
  divisions: ResponseDivision[]
}

const DivisiPageView = ({ divisions }: DivisiPageViewProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDivision, setEditingDivision] = useState<DivisionSchemaInput | undefined>()
  const router = useRouter()

  const handleCreate = () => {
    setEditingDivision(undefined)
    setDialogOpen(true)
  }

  const onSubmitDialog = (form: DivisionSchemaInput): void => {
    if (form.id) {
      updateDivision(form).then(response => {
        if (response.success) {
          toast.success(response?.message ? response.message : 'user update successfully.')
          setDialogOpen(false)
          router.refresh()
        } else {
          toast.error('user created failed')
        }
      })
    } else {
      createDivision(form).then(response => {
        if (response.success) {
          toast.success(response?.message ? response.message : 'user created successfully.')
          setDialogOpen(false)
          router.refresh()
        } else {
          toast.error('user created failed')
        }
      })
    }
  }

  return (
    <div>
      <Typography variant='h4'>Divisi</Typography>
      <Card className={'mt-4'}>
        <CardContent>
          <div>
            <Button startIcon={<i className='tabler-plus' />} variant={'contained'} onClick={handleCreate}>
              Tambah
            </Button>
          </div>
          <div className={'mt-4'}>
            <DivisionTable divisions={divisions} />
          </div>
        </CardContent>
      </Card>

      <DivisionDialog open={dialogOpen} onCloseAction={() => setDialogOpen(false)} onSubmitAction={onSubmitDialog} />
    </div>
  )
}

export default DivisiPageView
