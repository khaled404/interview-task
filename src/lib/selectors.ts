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
  throw new Error('TODO: implement filterTransactions')
}

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
  throw new Error('TODO: implement getRecentTransactions')
}

export function getAccountName(accounts: Account[], accountId: string): string {
  return accounts.find((account) => account.id === accountId)?.holderName ?? 'Unknown'
}
