export type AccountType = 'checking' | 'savings' | 'credit'

export type AccountStatus = 'active' | 'inactive' | 'closed'

export type TransactionType = 'deposit' | 'withdrawal'

export interface Account {
  id: string
  holderName: string
  accountNumber: string
  type: AccountType
  balance: number
  status: AccountStatus
  createdAt: string
}

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  amount: number
  date: string
  description: string
}

export interface AccountFormValues {
  holderName: string
  accountNumber: string
  type: AccountType
  balance: string
  status: AccountStatus
}

export interface TransactionFormValues {
  accountId: string
  type: TransactionType
  amount: string
  date: string
  description: string
}

export type FormErrors<T> = Partial<Record<keyof T, string>>

export interface TransactionFilters {
  accountId: string
  type: string
  search: string
}

export interface DashboardStats {
  totalAccounts: number
  activeAccounts: number
  totalBalance: number
  totalDeposits: number
  totalWithdrawals: number
  depositCount: number
  withdrawalCount: number
  netFlow: number
}

export interface AccountSummary {
  account: Account
  transactionCount: number
  deposits: number
  withdrawals: number
}
