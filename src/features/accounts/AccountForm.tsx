import { useState, type FormEvent } from 'react'
import { Field } from '../../components/ui/Field'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { ACCOUNT_STATUSES, ACCOUNT_TYPES } from '../../lib/constants'
import { isValid, validateAccount } from '../../lib/validation'
import type {
  Account,
  AccountFormValues,
  AccountStatus,
  AccountType,
  FormErrors,
} from '../../types'

interface AccountFormProps {
  formId: string
  account?: Account | null
  onSubmit: (values: AccountFormValues) => void
}

export function AccountForm({ formId, account, onSubmit }: AccountFormProps) {
  const [values, setValues] = useState<AccountFormValues>({
    holderName: account?.holderName ?? '',
    accountNumber: account?.accountNumber ?? '',
    type: (account?.type ?? 'checking') as AccountType,
    balance: account ? String(account.balance) : '',
    status: (account?.status ?? 'active') as AccountStatus,
  })
  const [errors, setErrors] = useState<FormErrors<AccountFormValues>>({})

  const update = (field: keyof AccountFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateAccount(values)
    setErrors(nextErrors)
    if (!isValid(nextErrors)) return
    onSubmit(values)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Account holder name" htmlFor="holderName" error={errors.holderName}>
        <Input
          id="holderName"
          value={values.holderName}
          invalid={Boolean(errors.holderName)}
          placeholder="e.g. Amira Hassan"
          onChange={(event) => update('holderName', event.target.value)}
        />
      </Field>

      <Field label="Account number" htmlFor="accountNumber" error={errors.accountNumber}>
        <Input
          id="accountNumber"
          value={values.accountNumber}
          invalid={Boolean(errors.accountNumber)}
          placeholder="1000200035"
          onChange={(event) => update('accountNumber', event.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Account type" htmlFor="type" error={errors.type}>
          <Select
            id="type"
            value={values.type}
            options={ACCOUNT_TYPES}
            onChange={(event) => update('type', event.target.value)}
          />
        </Field>

        <Field label="Status" htmlFor="status" error={errors.status}>
          <Select
            id="status"
            value={values.status}
            options={ACCOUNT_STATUSES}
            onChange={(event) => update('status', event.target.value)}
          />
        </Field>
      </div>

      <Field label="Balance" htmlFor="balance" error={errors.balance}>
        <Input
          id="balance"
          value={values.balance}
          invalid={Boolean(errors.balance)}
          placeholder="0.00"
          onChange={(event) => update('balance', event.target.value)}
        />
      </Field>
    </form>
  )
}
