import { compare } from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

import prisma from '@/lib/prisma'
import { LoginSchema } from '@/schemas/login-schema'

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        username: {
          type: 'text'
        },
        password: {
          type: 'password'
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, req) {
        const validateFields = LoginSchema.safeParse(credentials)

        if (validateFields.success) {
          const { username, password } = validateFields.data

          const user = await prisma.user.findUnique({
            where: {
              username
            },
            include: {
              division: true
            }
          })

          console.log('User found:', user ? JSON.stringify(user) : 'No user found')

          if (!user) return null

          const passwordMatch = await compare(password, user.password)

          if (passwordMatch)
            return {
              username: user.username,
              name: user.name,
              id: user.id,
              role: user.role,
              divisionId: user.divisionId,
              divisionName: user?.division?.name ?? null
            }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/login' // signin page
  },
  callbacks: {
    async jwt({ token, user }) {
      // `user` hanya tersedia saat login, jadi kita tambahkan ID ke token di sini

      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
        token.name = user.name
        token.divisionId = user.divisionId
        token.divisionName = user?.divisionName
      }

      //   console.log('JWT Callback:', { token, user });
      return token
    },
    async session({ session, token }) {
      // Menyertakan ID dari token ke session
      if (session.user && token?.id) {
        session.user.id = String(token.id)
        session.user.username = token.username as string
        session.user.role = token.role as string
        session.user.divisionId = token.divisionId
        session.user.divisionName = token?.divisionName as string
      }

      return session
    }
  }
} satisfies NextAuthConfig

export default authConfig
