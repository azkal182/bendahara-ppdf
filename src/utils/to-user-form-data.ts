import type { ResponseUserWithDivision } from '@/actions/user-action'
import type { UserFormData } from '@/schemas/user-schema'

export const toUserFormData = (user: ResponseUserWithDivision): UserFormData => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    password: user.password,
    role: user.role,
    divisionId: user.divisionId
  }
}
