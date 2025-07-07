'use client'

import { useEffect } from 'react'

import { useAuthStore } from '@/stores/auth-store'
import FullPageLoading from '@components/FullPageLoading'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchSession, status } = useAuthStore()

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  if (status === 'loading') {
    return <FullPageLoading />
  }

  return <>{children}</>
}
