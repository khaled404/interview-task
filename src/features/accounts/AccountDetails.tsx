import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatDate, titleCase } from '../../lib/format'
import type { Account, Transaction } from '../../types'

interface AccountDetailsProps {
  account: Account
  transactions: Transaction[]
}

export function AccountDetails({ account, transactions }: AccountDetailsProps) {
  const history = transactions.filter((item) => item.accountId === account.id)

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Detail label="Holder" value={account.holderName} />
        <Detail label="Account number" value={account.accountNumber} />
        <Detail label="Type" value={titleCase(account.type)} />
        <Detail label="Created" value={formatDate(account.createdAt)} />
        <Detail label="Balance" value={formatCurrency(account.balance)} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </p>
          <div className="mt-1.5">
            <Badge status={account.status} />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          Transaction history
        </p>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions for this account.</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {history.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between px-3 py-2.5"
              >
                <div>
                  <p className="text-sm text-slate-800">{transaction.description}</p>
                  <p className="text-xs text-slate-500">{formatDate(transaction.date)}</p>
                </div>
                <span
                  className={
                    transaction.type === 'deposit'
                      ? 'text-sm font-semibold text-emerald-600'
                      : 'text-sm font-semibold text-red-600'
                  }
                >
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
