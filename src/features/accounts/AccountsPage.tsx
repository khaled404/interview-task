import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States'
import { formatCurrency, formatDate, maskAccountNumber, titleCase } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import type { Account, AccountFormValues } from '../../types'
import { AccountDetails } from './AccountDetails'
import { AccountForm } from './AccountForm'

export function AccountsPage() {
  const accounts = useBankStore((state) => state.accounts)
  const transactions = useBankStore((state) => state.transactions)
  const loading = useBankStore((state) => state.loading)
  const error = useBankStore((state) => state.error)
  const load = useBankStore((state) => state.load)
  const createAccount = useBankStore((state) => state.createAccount)
  const updateAccount = useBankStore((state) => state.updateAccount)
  const deleteAccount = useBankStore((state) => state.deleteAccount)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [viewing, setViewing] = useState<Account | null>(null)
  const [pending, setPending] = useState<Account | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (account: Account) => {
    setEditing(account)
    setFormError(null)
    setFormOpen(true)
  }

  const handleSubmit = async (values: AccountFormValues) => {
    setSubmitting(true)
    setFormError(null)
    try {
      if (editing) {
        await updateAccount(editing.id, values)
      } else {
        await createAccount(values)
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
      await deleteAccount(pending.id)
      setPending(null)
    } catch (error) {
      setDeleteError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const columns: Column<Account>[] = [
    {
      key: 'holderName',
      header: 'Holder',
      render: (account) => (
        <button
          onClick={() => setViewing(account)}
          className="font-medium text-slate-900 hover:text-brand-600"
        >
          {account.holderName}
        </button>
      ),
    },
    {
      key: 'accountNumber',
      header: 'Number',
      render: (account) => maskAccountNumber(account.accountNumber),
    },
    { key: 'type', header: 'Type', render: (account) => titleCase(account.type) },
    {
      key: 'balance',
      header: 'Balance',
      render: (account) => (
        <span className="tabular-nums">{formatCurrency(account.balance)}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (account) => <Badge status={account.status} /> },
    { key: 'createdAt', header: 'Created', render: (account) => formatDate(account.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (account) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => setViewing(account)}>
            View
          </Button>
          <Button variant="secondary" size="sm" onClick={() => openEdit(account)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setPending(account)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Accounts"
        description="Create, review and maintain customer bank accounts."
        action={<Button onClick={openCreate}>New account</Button>}
      />

      <Card>
        {loading ? (
          <Spinner label="Loading accounts…" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : accounts.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            description="Create the first account to get started."
            action={<Button onClick={openCreate}>New account</Button>}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={accounts}
            rowKey={(account) => account.id}
            renderCard={(account) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {account.holderName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {maskAccountNumber(account.accountNumber)} · {titleCase(account.type)}
                    </p>
                  </div>
                  <Badge status={account.status} />
                </div>
                <p className="text-sm font-semibold tabular-nums text-slate-900">
                  {formatCurrency(account.balance)}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setViewing(account)}>
                    View
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(account)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setPending(account)}>
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
        title={editing ? 'Edit account' : 'New account'}
        onClose={() => setFormOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="account-form" loading={submitting}>
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
        <AccountForm
          key={editing?.id ?? 'new'}
          formId="account-form"
          account={editing}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={Boolean(viewing)}
        title="Account details"
        onClose={() => setViewing(null)}
        footer={
          <Button variant="secondary" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing ? <AccountDetails account={viewing} transactions={transactions} /> : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete account"
        message={`Delete ${pending?.holderName ?? ''}? This cannot be undone.`}
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
