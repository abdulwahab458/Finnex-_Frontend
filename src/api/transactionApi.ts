import { api } from './axios'

export const transactionApi = {
  list: async () => (await api.get('/transactions')).data,
  create: async (payload: unknown) => (await api.post('/transactions', payload)).data,
}