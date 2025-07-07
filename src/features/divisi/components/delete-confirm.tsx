import React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

interface DeleteConfirmProps {
  open: boolean
  onConfirm: (id: string) => void
  onCloseAction: () => void
  title?: string
  description?: string
  id: string
}

const DeleteConfirm = ({
  open,
  title = 'Apakah kamu yakin ingin menghapus?',
  description = 'Tindakan ini tidak dapat dibatalkan. Data cashflow akan hilang secara permanen.',
  onConfirm,
  onCloseAction,
  id
}: DeleteConfirmProps) => {
  return (
    <Dialog open={open} onClose={onCloseAction}>
      <DialogTitle variant='h5'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAction}>Batal</Button>
        <Button onClick={() => onConfirm(id)} variant='contained' color='error'>
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirm
