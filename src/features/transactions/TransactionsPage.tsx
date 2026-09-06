import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States'
import { TRANSACTION_TYPES } from '../../lib/constants'
import { formatCurrency, formatDate, titleCase } from '../../lib/format'
import { getAccountName } from '../../lib/selectors'
import { useBankStore } from '../../store/useBankStore'
import type { Transaction, TransactionFormValues } from '../../types'
import { TransactionForm } from './TransactionForm'

export function TransactionsPage() {
  const accounts = useBankStore((state) => state.accounts)
  const transactions = useBankStore((state) => state.transactions)
  const loading = useBankStore((state) => state.loading)
  const error = useBankStore((state) => state.error)
  const load = useBankStore((state) => state.load)
  const accountFilter = useBankStore((state) => state.accountFilter)
  const typeFilter = useBankStore((state) => state.typeFilter)
  const setAccountFilter = useBankStore((state) => state.setAccountFilter)
  const setTypeFilter = useBankStore((state) => state.setTypeFilter)
  const createTransaction = useBankStore((state) => state.createTransaction)
  const updateTransaction = useBankStore((state) => state.updateTransaction)
  const deleteTransaction = useBankStore((state) => state.deleteTransaction)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [pending, setPending] = useState<Transaction | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction)
    setFormError(null)
    setFormOpen(true)
  }

  const handleSubmit = async (values: TransactionFormValues) => {
    setSubmitting(true)
    setFormError(null)
    try {
      if (editing) {
        await updateTransaction(editing.id, values)
      } else {
        await createTransaction(values)
      }
      setFormOpen(false)
    } catch (submitError) {
      setFormError((submitError as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!pending) return
    setSubmitting(true)
    setDeleteError(null)
    try {
      await deleteTransaction(pending.id)
      setPending(null)
    } catch (error) {
      setDeleteError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
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
          <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>
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
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            aria-label="Filter by account"
            value={accountFilter}
            placeholder="All accounts"
            options={accounts.map((account) => ({
              value: account.id,
              label: account.holderName,
            }))}
            onChange={(event) => setAccountFilter(event.target.value)}
          />
          <Select
            aria-label="Filter by type"
            value={typeFilter}
            placeholder="All types"
            options={TRANSACTION_TYPES}
            onChange={(event) => setTypeFilter(event.target.value)}
          />
        </div>
      </Card>

      <Card>
        {loading ? (
          <Spinner label="Loading transactions…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Clear the filters or record a new transaction."
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
                  <Button variant="secondary" size="sm" onClick={() => openEdit(row)}>
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
        title={editing ? 'Edit transaction' : 'New transaction'}
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="transaction-form" loading={submitting}>
              Save
            </Button>
          </>
        }
      >
        {formError ? (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}
        <TransactionForm
          key={editing?.id ?? 'new'}
          formId="transaction-form"
          accounts={accounts}
          transaction={editing}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete transaction"
        message="This transaction will be removed permanently. Continue?"
        busy={submitting}
        error={deleteError}
        onConfirm={handleDelete}
        onClose={() => {
          setPending(null)
          setDeleteError(null)
        }}
      />
    </div>
  )
}
