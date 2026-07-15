import { useEffect, useMemo, useState } from 'react'
import { getUserDisplayName } from '@/features/auth/types/auth.types'
import { login as loginRequest, logout as logoutRequest, register as registerRequest } from '@/services/authService'
import { getAccessToken, getStoredUser } from '@/services/tokenService'
import type { LoginCredentials, RegisterPayload } from '@/types/api'
import type { User } from '@/features/auth/types/auth.types'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

function readAuthState(): AuthState {
  return {
    isAuthenticated: Boolean(getAccessToken()),
    user: getStoredUser(),
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(readAuthState)

  useEffect(() => {
    const syncState = () => setState(readAuthState())
    window.addEventListener('storage', syncState)
    window.addEventListener('auth:changed', syncState as EventListener)
    return () => {
      window.removeEventListener('storage', syncState)
      window.removeEventListener('auth:changed', syncState as EventListener)
    }
  }, [])

  const refresh = () => {
    setState(readAuthState())
    window.dispatchEvent(new Event('auth:changed'))
  }

  const actions = useMemo(
    () => ({
      login: async (credentials: LoginCredentials) => {
        const session = await loginRequest(credentials)
        refresh()
        return session
      },
      register: async (payload: RegisterPayload) => {
        const session = await registerRequest(payload)
        refresh()
        return session
      },
      logout: async () => {
        await logoutRequest()
        refresh()
      },
      refresh,
    }),
    [],
  )

  return {
    ...state,
    displayName: getUserDisplayName(state.user),
    ...actions,
  }
}
