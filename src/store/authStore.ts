import { clearSession, getAccessToken, getStoredUser, setSession } from '@/services/tokenService'
import type { AuthSession } from '@/types/api'

export const authStore = {
  get isAuthenticated() {
    return Boolean(getAccessToken())
  },
  get user() {
    return getStoredUser()
  },
  setSession,
  clearSession,
} satisfies Pick<AuthSession, never>