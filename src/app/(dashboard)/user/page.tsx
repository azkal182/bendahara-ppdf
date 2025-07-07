import React from 'react'

import { getUsers } from '@/actions/user-action'
import UserPageView from '@/features/user/user-page'
import { getDivisi } from '@/actions/divisi-action'

const UserPage = async () => {
  const users = await getUsers()
  const divisions = await getDivisi()

  return (
    <div>
      <UserPageView users={users} divisions={divisions} />
    </div>
  )
}

export default UserPage
