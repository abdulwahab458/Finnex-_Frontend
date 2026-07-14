import { api } from './axios'
import type { LoginCredentials, RegisterPayload } from '@/types/api'

export const authApi = {
  login: async (payload: LoginCredentials) => {
    const response = await api.post('/auth/login', payload)
    return response.data
  },
  register: async (payload: RegisterPayload) => {
    const response = await api.post('/auth/register', payload)
    return response.data
  },
}