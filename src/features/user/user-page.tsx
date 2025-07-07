'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button, Card, CardContent } from '@mui/material'

import toast from 'react-hot-toast'

import type { UserFormData } from '@/schemas/user-schema'
import type { ResponseUserWithDivision } from '@/actions/user-action'
import { createUser, updateUser } from '@/actions/user-action'
import UserTable from './components/user-table'
import UserDialog from './components/user-dialog'
import type { ResponseDivision } from '@/actions/divisi-action'
import { toUserFormData } from '@/utils/to-user-form-data'

function UserPageView({ users, divisions }: { users: ResponseUserWithDivision[]; divisions: ResponseDivision[] }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserFormData | undefined>()
  const router = useRouter()

  const handleCreate = () => {
    setEditingUser(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (user: ResponseUserWithDivision) => {
    setEditingUser(toUserFormData(user))
    setDialogOpen(true)
  }

  const handleSubmit = (form: UserFormData) => {
    if (form.id) {
      console.log(JSON.stringify(form))
      updateUser(form).then(response => {
        if (response.success) {
          toast.success(response?.message ? response.message : 'user update successfully.')
          setDialogOpen(false)
          router.refresh()
        } else {
          toast.error('user created failed')
        }
      })
    } else {
      console.log(form)
      createUser(form).then(response => {
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
    <Card className={'overflow-x-auto'}>
      <CardContent>
        <div>
          <Button variant='contained' onClick={handleCreate}>
            + Add User
          </Button>
          <div className={'mt-4'}>
            <UserTable users={users} onEditAction={handleEdit} />
          </div>
          <UserDialog
            divisions={divisions}
            open={dialogOpen}
            onCloseAction={() => {
              setDialogOpen(false)
              setEditingUser(undefined)
            }}
            onSubmitAction={handleSubmit}
            initialData={editingUser}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default UserPageView
