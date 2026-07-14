export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'retirement'
  balance: number
  currency: string
}