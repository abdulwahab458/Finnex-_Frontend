import { useState } from 'react'
import { login } from '@/services/authService'
import type { LoginCredentials } from '@/types/api'

export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitLogin = async (credentials: LoginCredentials) => {
    setIsSubmitting(true)
    try {
      return await login(credentials)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, submitLogin }
}