import { isEmail, isRequired, isStrongPassword } from '@/lib/validators'

export function validateLogin(email: string, password: string) {
  return isEmail(email) && isRequired(password)
}

export function validateRegister(fullName: string, email: string, password: string) {
  return isRequired(fullName) && isEmail(email) && isStrongPassword(password)
}