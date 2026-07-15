import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AuthCard } from '../components/AuthCard'
import { useAuth } from '@/hooks/useAuth'
import { isEmail, isRequired, isStrongPassword } from '@/lib/validators'
import { useForm } from 'react-hook-form'

interface RegisterFormValues {
  fullName: string
  email: string
  password: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: 'Smart Finance User',
      email: 'new.client@smartfinance.com',
      password: 'smart-finance',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    await register(values)
    navigate('/')
  }

  return (
    <AuthCard title="Create account" description="Start with a demo session and extend it into your backend workflow.">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          Full name
          <input
            className="w-full rounded-[4px] border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-primary"
            {...registerField('fullName', {
              required: 'Full name is required',
              validate: (value) => isRequired(value) || 'Full name is required',
            })}
          />
          {errors.fullName ? <span className="text-xs text-red-600">{errors.fullName.message}</span> : null}
        </label>

        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          Email address
          <input
            className="w-full rounded-[4px] border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-primary"
            {...registerField('email', {
              required: 'Email address is required',
              validate: (value) => isEmail(value) || 'Enter a valid email address',
            })}
            type="email"
          />
          {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
        </label>

        <label className="grid gap-2 text-xs font-medium text-on-surface-variant">
          Password
          <input
            className="w-full rounded-[4px] border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-primary"
            {...registerField('password', {
              required: 'Password is required',
              validate: (value) => isStrongPassword(value) || 'Password must be at least 8 characters long',
            })}
            type="password"
          />
          {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
        </label>

        <Button className="w-full rounded-[4px] bg-black py-3 text-[0.76rem] font-bold uppercase tracking-[0.06em] text-white shadow-none hover:bg-neutral-900" type="submit" disabled={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}