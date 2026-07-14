import { api } from './axios'

export const reportApi = {
  list: async () => (await api.get('/reports')).data,
  generate: async (payload: unknown) => (await api.post('/reports/generate', payload)).data,
}