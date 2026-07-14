import { api } from './axios'

export const budgetApi = {
  list: async () => (await api.get('/budgets')).data,
  create: async (payload: unknown) => (await api.post('/budgets', payload)).data,
}