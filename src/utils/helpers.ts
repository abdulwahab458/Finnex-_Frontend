export function sum(values: number[]) {
  return values.reduce((total, currentValue) => total + currentValue, 0)
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return sum(values) / values.length
}