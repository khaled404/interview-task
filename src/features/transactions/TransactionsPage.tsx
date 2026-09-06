import { useState } from 'react'
import { SEED_ACCOUNTS, SEED_TRANSACTIONS } from '../../api/seed'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { EmptyState } from '../../components/ui/States'
import { TRANSACTION_TYPES } from '../../lib/constants'
import { formatCurrency, formatDate, titleCase } from '../../lib/format'
import { getAccountName } from '../../lib/selectors'
import type { Transaction, TransactionFilters } from '../../types'
import { TransactionForm } from './TransactionForm'

const EMPTY_FILTERS: TransactionFilters = { accountId: '', type: '', search: '' }

export function TransactionsPage() {
  const accounts = SEED_ACCOUNTS
  const transactions = SEED_TRANSACTIONS

  const [filters, setFilters] = useState<TransactionFilters>(EMPTY_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [pending, setPending] = useState<Transaction | null>(null)

  const filtersApplied = Boolean(filters.accountId || filters.type || filters.search)

  const setFilter = (field: keyof TransactionFilters, value: string) =>
    setFilters((previous) => ({ ...previous, [field]: value }))

  const openCreate = () => {
    setFormOpen(true)
  }

  const handleSubmit = () => {
    setFormOpen(false)
  }

  const handleDelete = () => {
    setPending(null)
  }

  const amountCell = (transaction: Transaction) => (
    <span
      className={
        transaction.type === 'deposit'
          ? 'font-semibold tabular-nums text-emerald-600'
          : 'font-semibold tabular-nums text-red-600'
      }
    >
      {transaction.type === 'deposit' ? '+' : '-'}
      {formatCurrency(transaction.amount)}
    </span>
  )

  const columns: Column<Transaction>[] = [
    { key: 'id', header: 'ID', render: (row) => row.id },
    {
      key: 'account',
      header: 'Account',
      render: (row) => getAccountName(accounts, row.accountId),
    },
    { key: 'type', header: 'Type', render: (row) => titleCase(row.type) },
    { key: 'amount', header: 'Amount', render: amountCell },
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    { key: 'description', header: 'Description', render: (row) => row.description },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setPending(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transactions"
        description="Record deposits and withdrawals across all accounts."
        action={<Button onClick={openCreate}>New transaction</Button>}
      />

      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            aria-label="Search transactions"
            value={filters.search}
            placeholder="Search description or amount"
            onChange={(event) => setFilter('search', event.target.value)}
          />
          <Select
            aria-label="Filter by account"
            value={filters.accountId}
            placeholder="All accounts"
            options={accounts.map((account) => ({
              value: account.id,
              label: account.holderName,
            }))}
            onChange={(event) => setFilter('accountId', event.target.value)}
          />
          <Select
            aria-label="Filter by type"
            value={filters.type}
            placeholder="All types"
            options={TRANSACTION_TYPES}
            onChange={(event) => setFilter('type', event.target.value)}
          />
        </div>
        {filtersApplied ? (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </Button>
          </div>
        ) : null}
      </Card>

      <Card>
        {transactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Record the first transaction to get started."
            action={<Button onClick={openCreate}>New transaction</Button>}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={transactions}
            rowKey={(row) => row.id}
            renderCard={(row) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{row.description}</p>
                    <p className="text-xs text-slate-500">
                      {getAccountName(accounts, row.accountId)} · {formatDate(row.date)}
                    </p>
                  </div>
                  {amountCell(row)}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setPending(row)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </Card>

      <Modal
        open={formOpen}
        title="New transaction"
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="transaction-form">
              Save
            </Button>
          </>
        }
      >
        <TransactionForm
          key="new"
          formId="transaction-form"
          accounts={accounts}
          transaction={null}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete transaction"
        message="This transaction will be removed permanently. Continue?"
        onConfirm={handleDelete}
        onClose={() => setPending(null)}
      />
    </div>
  )
}
