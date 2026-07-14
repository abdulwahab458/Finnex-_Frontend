export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isRequired(value: string) {
  return value.trim().length > 0
}

export function isStrongPassword(value: string) {
  return value.trim().length >= 8
}