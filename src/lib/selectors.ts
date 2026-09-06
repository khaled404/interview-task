import type { Account, DashboardStats, Transaction } from '../types'

export function getDashboardStats(
  accounts: Account[],
  transactions: Transaction[],
): DashboardStats {
  throw new Error('TODO: implement getDashboardStats')
}

export function getRecentTransactions(
  transactions: Transaction[],
  limit = 5,
): Transaction[] {
  return [...transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit)
}

export function getAccountName(accounts: Account[], accountId: string): string {
  return accounts.find((account) => account.id === accountId)?.holderName ?? 'Unknown'
}
