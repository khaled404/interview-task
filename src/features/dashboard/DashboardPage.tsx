import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States'
import { formatCurrency, formatDate } from '../../lib/format'
import { getAccountName, getDashboardStats, getRecentTransactions } from '../../lib/selectors'
import { useBankStore } from '../../store/useBankStore'

export function DashboardPage() {
  const accounts = useBankStore((state) => state.accounts)
  const transactions = useBankStore((state) => state.transactions)
  const loading = useBankStore((state) => state.loading)
  const error = useBankStore((state) => state.error)
  const load = useBankStore((state) => state.load)

  if (loading) return <Spinner label="Loading dashboard…" />
  if (error) {
    return (
      <Card>
        <ErrorState message={error} onRetry={load} />
      </Card>
    )
  }

  const stats = getDashboardStats(accounts, transactions)
  const recent = getRecentTransactions(transactions)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="A snapshot of balances and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total accounts" value={String(stats.totalAccounts)} />
        <StatCard label="Total balance" value={formatCurrency(stats.totalBalance)} />
        <StatCard label="Total deposits" value={formatCurrency(stats.totalDeposits)} />
        <StatCard label="Total withdrawals" value={formatCurrency(stats.totalWithdrawals)} />
      </div>

      <Card>
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent transactions</h2>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No transactions yet" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getAccountName(accounts, transaction.accountId)} ·{' '}
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <span
                  className={
                    transaction.type === 'deposit'
                      ? 'text-sm font-semibold tabular-nums text-emerald-600'
                      : 'text-sm font-semibold tabular-nums text-red-600'
                  }
                >
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
    </Card>
  )
}
