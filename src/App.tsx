import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AccountsPage } from './features/accounts/AccountsPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { TransactionsPage } from './features/transactions/TransactionsPage'
import { useBankStore } from './store/useBankStore'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'accounts', label: 'Accounts' },
  { id: 'transactions', label: 'Transactions' },
] as const

type TabId = (typeof TABS)[number]['id']

export function App() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const load = useBankStore((state) => state.load)

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              B
            </span>
            <span className="text-sm font-semibold text-slate-900">Bankly</span>
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={clsx(
                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition',
                  tab === item.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <ErrorBoundary key={tab}>
          {tab === 'dashboard' ? <DashboardPage /> : null}
          {tab === 'accounts' ? <AccountsPage /> : null}
          {tab === 'transactions' ? <TransactionsPage /> : null}
        </ErrorBoundary>
      </main>
    </div>
  )
}
