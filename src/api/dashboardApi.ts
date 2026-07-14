import { api } from './axios'

export const dashboardApi = {
  summary: async () => (await api.get('/dashboard/summary')).data,
  activity: async () => (await api.get('/dashboard/activity')).data,
}