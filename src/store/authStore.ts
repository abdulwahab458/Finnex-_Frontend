import { clearSession, getAccessToken, getStoredUser, setSession } from '@/services/tokenService'
import type { AuthSession } from '@/features/auth/types/auth.types'

export const authStore = {
  get isAuthenticated() {
    return Boolean(getAccessToken())
  },
  get user() {
    return getStoredUser()
  },
  setSession,
  clearSession,
} satisfies {
  isAuthenticated: boolean
  user: AuthSession['user'] | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}
