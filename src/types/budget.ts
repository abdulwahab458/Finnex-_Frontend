export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'quarterly' | 'yearly'
}