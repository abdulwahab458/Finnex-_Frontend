import { type ClassValue, clsx } from 'clsx'
import type { FieldError, FieldErrors } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export function clampNumber(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function getFieldError(errors: FieldErrors, name: string): FieldError | undefined {
  const path = name.split(".");
  let current: unknown = errors;

  for (const key of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }

  return current as FieldError | undefined;
}
