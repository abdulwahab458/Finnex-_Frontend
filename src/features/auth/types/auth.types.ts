import type { UserRole } from '@/registry/navigation/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole | string
  permissions?: string[]
  avatarUrl: string | null
  lastLoginAt: string | null
  mfaEnabled: boolean
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export function getUserDisplayName(user: Pick<User, 'firstName' | 'lastName' | 'email'> | null | undefined): string {
  if (!user) {
    return 'Guest'
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return name || user.email
}
