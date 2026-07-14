import type { AuthSession } from '@/types/api'

const ACCESS_TOKEN_KEY = 'smart-finance.access-token'
const SESSION_USER_KEY = 'smart-finance.session-user'

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getStoredUser() {
  const rawValue = window.localStorage.getItem(SESSION_USER_KEY)
  return rawValue ? (JSON.parse(rawValue) as AuthSession['user']) : null
}

export function setStoredUser(user: AuthSession['user']) {
  window.localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  window.localStorage.removeItem(SESSION_USER_KEY)
}

export function clearSession() {
  clearAccessToken()
  clearStoredUser()
}

export function setSession(session: AuthSession) {
  setAccessToken(session.accessToken)
  setStoredUser(session.user)
}
