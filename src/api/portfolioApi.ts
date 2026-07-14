import { api } from './axios'

export const portfolioApi = {
  summary: async () => (await api.get('/portfolio/summary')).data,
  holdings: async () => (await api.get('/portfolio/holdings')).data,
}