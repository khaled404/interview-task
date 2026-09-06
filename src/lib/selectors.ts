import type {
  Account,
  AccountSummary,
  DashboardStats,
  Transaction,
  TransactionFilters,
} from '../types'

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  return transactions
}

export function getDashboardStats(
  accounts: Account[],
  transactions: Transaction[],
): DashboardStats {
  const deposits = transactions.filter((transaction) => transaction.type === 'deposit')
  const withdrawals = transactions.filter(
    (transaction) => transaction.type === 'withdrawal',
  )

  const totalDeposits = sumAmount(deposits)
  const totalWithdrawals = sumAmount(withdrawals)

  return {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter((account) => account.status === 'active').length,
    totalBalance: accounts.reduce((total, account) => total + account.balance, 0),
    totalDeposits,
    totalWithdrawals,
    depositCount: deposits.length,
    withdrawalCount: withdrawals.length,
    netFlow: totalDeposits - totalWithdrawals,
  }
}

export function getRecentTransactions(
  transactions: Transaction[],
  limit = 5,
): Transaction[] {
  return [...transactions]
    .sort((a, b) => (a.date === b.date ? b.id.localeCompare(a.id) : a.date < b.date ? 1 : -1))
    .slice(0, limit)
}

export function getAccountSummaries(
  accounts: Account[],
  transactions: Transaction[],
): AccountSummary[] {
  return accounts
    .map((account) => {
      const owned = transactions.filter(
        (transaction) => transaction.accountId === account.id,
      )

      return {
        account,
        transactionCount: owned.length,
        deposits: sumAmount(owned.filter((item) => item.type === 'deposit')),
        withdrawals: sumAmount(owned.filter((item) => item.type === 'withdrawal')),
      }
    })
    .sort((a, b) => b.account.balance - a.account.balance)
}

export function getAccountName(accounts: Account[], accountId: string): string {
  return accounts.find((account) => account.id === accountId)?.holderName ?? 'Unknown'
}

function sumAmount(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0)
}
