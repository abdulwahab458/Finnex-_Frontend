import type { AuthSession, LoginCredentials, RegisterPayload } from '@/types/api'
import { clearSession, setSession } from './tokenService'

const sleep = async (milliseconds: number) => {
  await new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

const createSession = (email: string, displayName: string): AuthSession => ({
  accessToken: `demo-${btoa(email)}`,
  user: {
    id: crypto.randomUUID(),
    email,
    displayName,
    role: 'client',
  },
})

export async function login(credentials: LoginCredentials) {
  await sleep(250)
  const session = createSession(
    credentials.email,
    credentials.email.split('@')[0].replace(/[._-]/g, ' '),
  )
  setSession(session)
  return session
}

export async function register(payload: RegisterPayload) {
  await sleep(300)
  const session = createSession(payload.email, payload.fullName.trim() || 'Smart Finance User')
  setSession(session)
  return session
}

export async function logout() {
  await sleep(120)
  clearSession()
}