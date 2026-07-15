import type { AuthSession } from '@/features/auth/types/auth.types'
import { normalizeRole } from '@/lib/roles'

const ACCESS_TOKEN_KEY = 'finnenx.access-token'
const REFRESH_TOKEN_KEY = 'finnenx.refresh-token'
const SESSION_USER_KEY = 'finnenx.session-user'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getStoredUser() {
  const user = localStorage.getItem(SESSION_USER_KEY)

  return user ? (JSON.parse(user) as AuthSession['user']) : null
}

export function setStoredUser(user: AuthSession['user']) {
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem(SESSION_USER_KEY)
}

export function setSession(session: AuthSession) {
  setAccessToken(session.accessToken)
  setRefreshToken(session.refreshToken)
  setStoredUser({
    ...session.user,
    role: normalizeRole(session.user.role),
  })
}

export function clearSession() {
  clearAccessToken()
  clearRefreshToken()
  clearStoredUser()
}
