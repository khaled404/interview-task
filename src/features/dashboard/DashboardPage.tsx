import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States'
import { formatCurrency, formatDate, maskAccountNumber, titleCase } from '../../lib/format'
import {
  getAccountName,
  getAccountSummaries,
  getDashboardStats,
  getRecentTransactions,
} from '../../lib/selectors'
import { useBankStore } from '../../store/useBankStore'
import type { AccountSummary, Transaction } from '../../types'

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
  const summaries = getAccountSummaries(accounts, transactions)
  const recent = getRecentTransactions(transactions)

  const movement = stats.totalDeposits + stats.totalWithdrawals
  const depositShare = movement === 0 ? 0 : Math.round((stats.totalDeposits / movement) * 100)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Balances, cash flow and recent activity across every account."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total accounts"
          value={String(stats.totalAccounts)}
          hint={`${stats.activeAccounts} active`}
        />
        <StatCard
          label="Total balance"
          value={formatCurrency(stats.totalBalance)}
          hint="Across all accounts"
        />
        <StatCard
          label="Total deposits"
          value={formatCurrency(stats.totalDeposits)}
          hint={`${stats.depositCount} ${plural(stats.depositCount, 'transaction')}`}
          tone="positive"
        />
        <StatCard
          label="Total withdrawals"
          value={formatCurrency(stats.totalWithdrawals)}
          hint={`${stats.withdrawalCount} ${plural(stats.withdrawalCount, 'transaction')}`}
          tone="negative"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <SectionTitle title="Cash flow" />
          <div className="flex flex-col gap-4 px-5 py-4">
            <FlowRow
              label="Money in"
              value={formatCurrency(stats.totalDeposits)}
              tone="positive"
            />
            <FlowRow
              label="Money out"
              value={formatCurrency(stats.totalWithdrawals)}
              tone="negative"
            />
            <div className="border-t border-slate-100 pt-4">
              <FlowRow
                label="Net flow"
                value={formatCurrency(stats.netFlow)}
                tone={stats.netFlow >= 0 ? 'positive' : 'negative'}
                emphasis
              />
            </div>
            {movement > 0 ? (
              <p className="text-xs text-slate-500">
                {depositShare}% of the money moved was deposits, {100 - depositShare}%
                withdrawals.
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <SectionTitle
            title="Accounts"
            caption={`${transactions.length} ${plural(transactions.length, 'transaction')} recorded`}
          />
          {summaries.length === 0 ? (
            <EmptyState title="No accounts yet" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {summaries.map((summary) => (
                <AccountRow key={summary.account.id} summary={summary} />
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <SectionTitle title="Recent transactions" />
        {recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="New activity will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getAccountName(accounts, transaction.accountId)} ·{' '}
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <Amount transaction={transaction} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone = 'neutral',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'neutral' | 'positive' | 'negative'
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p
        className={
          tone === 'positive'
            ? 'mt-2 text-2xl font-semibold tabular-nums text-emerald-600'
            : tone === 'negative'
              ? 'mt-2 text-2xl font-semibold tabular-nums text-red-600'
              : 'mt-2 text-2xl font-semibold tabular-nums text-slate-900'
        }
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </Card>
  )
}

function SectionTitle({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {caption ? <p className="text-xs text-slate-500">{caption}</p> : null}
    </div>
  )
}

function FlowRow({
  label,
  value,
  tone,
  emphasis,
}: {
  label: string
  value: string
  tone: 'positive' | 'negative'
  emphasis?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={
          emphasis ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-600'
        }
      >
        {label}
      </span>
      <span
        className={
          tone === 'positive'
            ? 'text-sm font-semibold tabular-nums text-emerald-600'
            : 'text-sm font-semibold tabular-nums text-red-600'
        }
      >
        {value}
      </span>
    </div>
  )
}

function AccountRow({ summary }: { summary: AccountSummary }) {
  const { account } = summary

  return (
    <li className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-slate-900">
            {account.holderName}
          </p>
          <Badge status={account.status} />
        </div>
        <p className="text-xs text-slate-500">
          {maskAccountNumber(account.accountNumber)} · {titleCase(account.type)} ·{' '}
          {summary.transactionCount} {plural(summary.transactionCount, 'transaction')}
        </p>
      </div>
      <div className="flex items-center gap-4 sm:justify-end">
        <p className="text-xs text-slate-500">
          <span className="text-emerald-600">+{formatCurrency(summary.deposits)}</span>{' '}
          <span className="text-red-600">-{formatCurrency(summary.withdrawals)}</span>
        </p>
        <p className="text-sm font-semibold tabular-nums text-slate-900">
          {formatCurrency(account.balance)}
        </p>
      </div>
    </li>
  )
}

function Amount({ transaction }: { transaction: Transaction }) {
  return (
    <span
      className={
        transaction.type === 'deposit'
          ? 'shrink-0 text-sm font-semibold tabular-nums text-emerald-600'
          : 'shrink-0 text-sm font-semibold tabular-nums text-red-600'
      }
    >
      {transaction.type === 'deposit' ? '+' : '-'}
      {formatCurrency(transaction.amount)}
    </span>
  )
}

function plural(count: number, word: string): string {
  return count === 1 ? word : `${word}s`
}
