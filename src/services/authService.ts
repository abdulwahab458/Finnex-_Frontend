import type { AuthSession } from '@/features/auth/types/auth.types'
import type { LoginCredentials, RegisterPayload } from '@/types/api'
import { clearSession, setSession } from './tokenService'

const sleep = async (milliseconds: number) => {
  await new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

const createSession = (email: string, firstName: string, lastName: string, role: AuthSession['user']['role'] = 'user'): AuthSession => ({
  accessToken: `demo-${btoa(email)}`,
  refreshToken: `demo-refresh-${btoa(email)}`,
  tokenType: 'Bearer',
  expiresIn: 3600,
  user: {
    id: crypto.randomUUID(),
    email,
    firstName,
    lastName,
    role,
    permissions: role === 'admin' ? ['users:read', 'roles:read', 'audit:read'] : [],
    avatarUrl: null,
    lastLoginAt: new Date().toISOString(),
    mfaEnabled: false,
  },
})

export async function login(credentials: LoginCredentials) {
  await sleep(250)
  const [firstName = 'Demo', lastName = 'User'] = credentials.email.split('@')[0].replace(/[._-]/g, ' ').split(' ')
  const session = createSession(credentials.email, firstName, lastName)
  setSession(session)
  return session
}

export async function register(payload: RegisterPayload) {
  await sleep(300)
  const [firstName = 'Smart', lastName = 'User'] = payload.fullName.trim().split(' ')
  const session = createSession(payload.email, firstName, lastName)
  setSession(session)
  return session
}

export async function logout() {
  await sleep(120)
  clearSession()
}
