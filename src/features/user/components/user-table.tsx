'use client'

import { Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer } from '@mui/material'

import Paper from '@mui/material/Paper'

import type { ResponseUserWithDivision } from '@/actions/user-action'

interface Props {
  users: ResponseUserWithDivision[]
  onEditAction: (user: ResponseUserWithDivision) => void
}

export default function UserTable({ users, onEditAction }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Division</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user?.division?.name || '-'}</TableCell>
              <TableCell>
                <Button onClick={() => onEditAction(user)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
