import type { AccountStatus, AccountType, TransactionType } from '../types'

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
  { value: 'credit', label: 'Credit' },
]

export const ACCOUNT_STATUSES: { value: AccountStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'closed', label: 'Closed' },
]

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
]

export const STATUS_STYLES: Record<AccountStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  inactive: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  closed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

export const ACCOUNT_NUMBER_PATTERN = /^\d{6,}$/
