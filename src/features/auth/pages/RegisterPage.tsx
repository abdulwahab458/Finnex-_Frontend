import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { AuthCard } from '../components/AuthCard'
import { isEmail, isRequired, isStrongPassword } from '@/lib/validators'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { useRegister } from '../hooks/useLogin'

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string
  password: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    await register(values)
    // console.log('Register values:', values)
    navigate('/login')
  }

  return (
    <AuthCard title="Create account" description="Start with a demo session and extend it into your backend workflow.">
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="grid gap-2  text-[0.95rem] font-medium text-on-surface-variant ">
          <div className='tracking-widest uppercase text-xs'>

            First Name
          </div>
          <input
            className="w-full rounded-4xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            {...registerField('firstName', {
              required: 'First name is required',
              validate: (value) => isRequired(value) || 'First name is required',
            })}
            placeholder='John'
          />
          {errors.firstName ? <span className="text-xs text-red-600">{errors.firstName.message}</span> : null}
        </label>
        <label className="grid gap-2  text-[0.95rem] font-medium text-on-surface-variant ">
          <div className='tracking-widest uppercase text-xs'>

            Last Name
          </div>
          <input
            className="w-full rounded-4xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            {...registerField('lastName', {
              required: 'Last name is required',
              validate: (value) => isRequired(value) || 'Last name is required',
            })}
            placeholder='Doe'
          />
          {errors.lastName ? <span className="text-xs text-red-600">{errors.lastName.message}</span> : null}
        </label>

        <label className="grid gap-2  text-[0.95rem] font-medium text-on-surface-variant ">
          <div className='tracking-widest uppercase text-xs'>

            Email
          </div>
          <input
            className="w-full rounded-4xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            {...registerField('email', {
              required: 'Email address is required',
              validate: (value) => isEmail(value) || 'Enter a valid email address',
            })}
            type="email"
            placeholder='john.doe@example.com'
          />
          {errors.email ? <span className="text-xs text-red-600">{errors.email.message}</span> : null}
        </label>

        <label className="grid gap-2  text-[0.95rem] font-medium text-on-surface-variant ">
          <div className='tracking-widest uppercase text-xs'>

            Password
          </div>
          <input
            className="w-full rounded-4xl border border-[#d5d8df] bg-white px-3 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-[#9aa1af] focus:border-[#0b1c4d]"
            {...registerField('password', {
              required: 'Password is required',
              validate: (value) => isStrongPassword(value) || 'Password must be at least 8 characters long',
            })}
            type="password"
            placeholder='••••••••'
          />
          {errors.password ? <span className="text-xs text-red-600">{errors.password.message}</span> : null}
        </label>

        <div className="flex w-full justify-center ">
          <Button className="w-40  bg-black   py-3 text-[0.76rem] font-bold uppercase tracking-[0.06em] text-white shadow-none hover:bg-neutral-900" type="submit" disabled={isSubmitting}>
            {isLoading ? <Loader2 size={18} className="animate-spin " /> : 'Register'}
          </Button>
        </div>
      </form>
    </AuthCard>
  )
}