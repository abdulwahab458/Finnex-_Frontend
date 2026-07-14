import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AuthCard } from '../components/AuthCard'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('advisor@smartfinance.com')
  const [password, setPassword] = useState('smart-finance')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await login({ email, password })
    navigate('/')
  }

  return (
    <AuthCard title="Welcome back" description="Please enter your details to access your account.">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2  text-xs font-medium text-on-surface-variant ">
          <div className='tracking-widest uppercase'>

          Email 
          </div>
          <input
            className="w-full rounded-3xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          <div className='tracking-widest uppercase'>
          Password
          </div>
          <input
            className="w-full rounded-3xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        

        <div className='flex justify-between'>
          <label className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#c7ccd7] text-primary focus:ring-primary" />
            Remember me for 30 days
          </label>
          <button type="button" className="bg-transparent p-0 text-[0.90rem] font-normal text-on-surface-variant transition-colors hover:text-on-surface">
            Forgot Password ?
          </button>
          
        </div>
        <div className="flex w-full justify-center ">


        <Button className="w-[10rem] bg-black py-3 text-[0.76rem] font-bold uppercase tracking-[0.06em] text-white shadow-none hover:bg-neutral-900" type="submit">
          Login
        </Button>
        </div>
      </form>
    </AuthCard>
  )
}