'use server'

import type { Prisma } from '@prisma/client'

import { hash } from 'bcryptjs'

import prisma from '@/lib/prisma'
import type { UserFormData } from '@/schemas/user-schema'
import { userFormSchema } from '@/schemas/user-schema'

export type ResponseUserWithDivision = Prisma.UserGetPayload<{
  include: {
    division: true
  }
}>

export const getUsers = async (): Promise<ResponseUserWithDivision[]> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        division: true // Include division details if needed
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        division: true // Include division details if needed
      }
    })

    if (!user) {
      throw new Error(`User with ID ${id} not found`)
    }

    return user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw error
  }
}

export const createUser = async (form: UserFormData) => {
  try {
    const parse = userFormSchema.safeParse(form)

    if (!parse.success) {
      const formatted = parse.error.flatten()

      return {
        success: false,
        errors: formatted.fieldErrors
      }
    }

    const { username, name, password, role, divisionId } = parse.data

    const hashPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        username,
        name,
        role,
        password: hashPassword,
        ...(divisionId
          ? {
              divisionId: divisionId
            }
          : {})
      }
    })

    return {
      success: true,
      message: 'User berhasil dibuat'
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const updateUser = async (data: UserFormData) => {
  try {
    const parse = userFormSchema.safeParse(data)

    if (!parse.success) {
      const formatted = parse.error.flatten()

      return {
        success: false,
        errors: formatted.fieldErrors
      }
    }

    const { username, name, role, divisionId, id } = parse.data

    if (!id) {
      return {
        success: false,
        errors: 'id is required'
      }
    }

    await prisma.user.update({
      where: { id },
      data: {
        username,
        name,
        role,
        divisionId
      }
    })

    return {
      success: true,
      message: 'User berhasil di edit'
    }
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const deleteUser = async (id: string) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id }
    })

    return deletedUser
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      throw new Error(`User with username ${username} not found`)
    }

    return user
  } catch (error) {
    console.error('Error fetching user by username:', error)
    throw error
  }
}
