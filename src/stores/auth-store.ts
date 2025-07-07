// stores/auth-store.ts
import { create } from 'zustand'
import { getSession } from 'next-auth/react'
import type { Session } from 'next-auth'

interface AuthState {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  fetchSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>(set => ({
  session: null,
  status: 'loading',
  fetchSession: async () => {
    set({ status: 'loading' })
    const session = await getSession()

    set({
      session,
      status: session ? 'authenticated' : 'unauthenticated'
    })
  }
}))
