import { api } from './axios'

export const accountApi = {
  list: async () => (await api.get('/accounts')).data,
  getById: async (accountId: string) => (await api.get(`/accounts/${accountId}`)).data,
}