'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material'

import Paper from '@mui/material/Paper'

import IconButton from '@mui/material/IconButton'

import toast from 'react-hot-toast'

import type { ResponseDivision } from '@/actions/divisi-action'
import { deleteDivisi } from '@/actions/divisi-action'
import DeleteConfirm from '@/features/divisi/components/delete-confirm'

interface Props {
  divisions: ResponseDivision[]

  // onEditAction: (user: ResponseUserWithDivision) => void
}

export default function DivisionTable({ divisions }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogTitle, setDialogTitle] = useState<string | undefined>()
  const [dialogDesc, setDialogDesc] = useState<string | undefined>()
  const router = useRouter()

  const handleOpenDialog = (id: string, name: string) => {
    setDialogTitle('Konfirmasi Penghapusan')
    setDialogDesc(`Apakah kamu yakin ingin menghapus data dengan nama "${name}"? Tindakan ini tidak dapat dibatalkan.`)
    setSelectedId(id)
    setDeleteDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedId(null)
  }

  const handleConfirmDelete = (id: string) => {
    deleteDivisi(id).then(response => {
      if (response.success) {
        toast.success(response?.message ? response.message : 'division deleted successfully.')
        handleCloseDialog()
        router.refresh()
      } else {
        toast.error('division delete failed')
      }
    })
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {divisions.map((division, index) => (
              <TableRow key={division.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{division.name}</TableCell>
                <TableCell>
                  <IconButton aria-label='edit' color={'primary'}>
                    <i className='tabler-edit' />
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    color={'error'}
                    onClick={() => handleOpenDialog(division.id, division.name)}
                  >
                    <i className='tabler-trash' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirm
        open={deleteDialogOpen}
        title={dialogTitle}
        description={dialogDesc}
        id={selectedId ?? ''}
        onConfirm={handleConfirmDelete}
        onCloseAction={handleCloseDialog}
      />
    </>
  )
}
