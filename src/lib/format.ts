export function formatCurrency(value: number): string {
  if (Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function maskAccountNumber(accountNumber: string): string {
  return `•••• ${accountNumber.slice(-4)}`
}

export function titleCase(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
}

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}
