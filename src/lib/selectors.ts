import type {
  Account,
  DashboardStats,
  Transaction,
  TransactionFilters,
} from '../types'

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const search = filters.search.trim().toLowerCase()

  return transactions.filter((transaction) => {
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false
    }

    if (filters.type && transaction.type !== filters.type) {
      return false
    }

    if (search) {
      const haystack = `${transaction.description} ${transaction.amount}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }

    return true
  })
}

export function getDashboardStats(
  accounts: Account[],
  transactions: Transaction[],
): DashboardStats {
  const sumAmounts = (type: Transaction['type']) =>
    transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0)

  return {
    totalAccounts: accounts.length,
    totalBalance: accounts.reduce((total, account) => total + account.balance, 0),
    totalDeposits: sumAmounts('deposit'),
    totalWithdrawals: sumAmounts('withdrawal'),
  }
}

export function getRecentTransactions(
  transactions: Transaction[],
  limit = 5,
): Transaction[] {
  return [...transactions]
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1
      return a.id < b.id ? 1 : -1
    })
    .slice(0, limit)
}

export function getAccountName(accounts: Account[], accountId: string): string {
  return accounts.find((account) => account.id === accountId)?.holderName ?? 'Unknown'
}
