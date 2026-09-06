import { useState, type FormEvent } from 'react'
import { Field } from '../../components/ui/Field'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { TRANSACTION_TYPES } from '../../lib/constants'
import { today } from '../../lib/format'
import { isValid, validateTransaction } from '../../lib/validation'
import type {
  Account,
  FormErrors,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from '../../types'

interface TransactionFormProps {
  formId: string
  accounts: Account[]
  transaction?: Transaction | null
  onSubmit: (values: TransactionFormValues) => void
}

export function TransactionForm({
  formId,
  accounts,
  transaction,
  onSubmit,
}: TransactionFormProps) {
  const [values, setValues] = useState<TransactionFormValues>({
    accountId: transaction?.accountId ?? '',
    type: (transaction?.type ?? 'deposit') as TransactionType,
    amount: transaction ? String(transaction.amount) : '',
    date: transaction?.date ?? today(),
    description: transaction?.description ?? '',
  })
  const [errors, setErrors] = useState<FormErrors<TransactionFormValues>>({})

  const update = (field: keyof TransactionFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateTransaction(values)
    setErrors(nextErrors)
    if (!isValid(nextErrors)) return
    onSubmit(values)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Account" htmlFor="accountId" error={errors.accountId}>
        <Select
          id="accountId"
          value={values.accountId}
          placeholder="Select an account"
          invalid={Boolean(errors.accountId)}
          options={accounts.map((account) => ({
            value: account.id,
            label: `${account.holderName} — ${account.accountNumber}`,
          }))}
          onChange={(event) => update('accountId', event.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="type" error={errors.type}>
          <Select
            id="type"
            value={values.type}
            options={TRANSACTION_TYPES}
            onChange={(event) => update('type', event.target.value)}
          />
        </Field>

        <Field label="Amount" htmlFor="amount" error={errors.amount}>
          <Input
            id="amount"
            value={values.amount}
            invalid={Boolean(errors.amount)}
            placeholder="0.00"
            onChange={(event) => update('amount', event.target.value)}
          />
        </Field>
      </div>

      <Field label="Date" htmlFor="date" error={errors.date}>
        <Input
          id="date"
          type="date"
          value={values.date}
          invalid={Boolean(errors.date)}
          onChange={(event) => update('date', event.target.value)}
        />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description}>
        <Input
          id="description"
          value={values.description}
          invalid={Boolean(errors.description)}
          placeholder="e.g. Salary transfer"
          onChange={(event) => update('description', event.target.value)}
        />
      </Field>
    </form>
  )
}
