import { api } from './axios'

export const goalApi = {
  list: async () => (await api.get('/goals')).data,
  create: async (payload: unknown) => (await api.post('/goals', payload)).data,
}