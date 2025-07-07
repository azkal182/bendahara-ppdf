import type { DefaultSession } from 'next-auth'
import type { JWT as DefaultJWT } from '@auth/core/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      role: string
      name: string
      divisionId: string | null
      divisionName: string | null
    } & DefaultSession['user']
  }
}

declare module 'next-auth' {
  interface User {
    id: string
    username: string
    name: string
    role: string
    divisionId: string | null
    divisionName: string | null
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    name: string
    username: string
    role: string
    divisionId: string | null
    divisionName: string | null
  }
}
