import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AuthCard } from '../components/AuthCard'
import { isEmail } from '@/lib/validators'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useLogin'
import { getDashboardPath } from '@/lib/roles'
import { Loader2 } from 'lucide-react'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login,isLoading} = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({})

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const session = await login(values)
      navigate(getDashboardPath(session.user.role))
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <AuthCard title="Welcome back" description="Please enter your details to access your account.">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="grid gap-2  text-[0.95rem] font-medium text-on-surface-variant ">
          <div className='tracking-widest uppercase text-xs'>

          Email 
          </div>
          <input
            className="w-full rounded-4xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            {...register('email', {
              required: 'Email is required',
              validate: (value) => isEmail(value) || 'Enter a valid email address',
            })}
            type="email"
            placeholder="name@company.com"
          />
          {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
        </label>
        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          <div className='tracking-widest uppercase'>
          Password
          </div>
          <input
            className="w-full rounded-4xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            {...register('password', {
              required: 'Password is required',
            })}
            type="password"
            placeholder="••••••••"
          />
          {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
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
        <div className="flex w-full justify-center  ">
        <Button className="w-40  bg-black  py-3 text-[0.76rem] font-bold uppercase tracking-[0.06em] text-white shadow-none hover:bg-neutral-900" type="submit" disabled={isSubmitting}>
          {isLoading ? <Loader2 size={18} className="animate-spin " /> : 'Login'}
        </Button>
        </div>
      </form>
    </AuthCard> 
  )
}
