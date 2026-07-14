import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AuthCard } from '../components/AuthCard'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('Smart Finance User')
  const [email, setEmail] = useState('new.client@smartfinance.com')
  const [password, setPassword] = useState('smart-finance')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await register({ fullName, email, password })
    navigate('/')
  }

  return (
    <AuthCard title="Create account" description="Start with a demo session and extend it into your backend workflow.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          Full name
          <input
            className="w-full rounded-[4px] border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-primary"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          Email address
          <input
            className="w-full rounded-[4px] border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-primary"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          Password
          <input
            className="w-full rounded-[4px] border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-primary"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <Button className="w-full rounded-[4px] bg-black py-3 text-[0.76rem] font-bold uppercase tracking-[0.06em] text-white shadow-none hover:bg-neutral-900" type="submit">
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}