import { ACCOUNT_NUMBER_PATTERN } from './constants'
import { today } from './format'
import type {
  AccountFormValues,
  FormErrors,
  TransactionFormValues,
} from '../types'

export function validateAccount(
  values: AccountFormValues,
): FormErrors<AccountFormValues> {
  const errors: FormErrors<AccountFormValues> = {}

  if (!values.holderName.trim()) {
    errors.holderName = 'Account holder name is required'
  } else if (values.holderName.trim().length < 3) {
    errors.holderName = 'Use at least 3 characters'
  }

  if (!values.accountNumber.trim()) {
    errors.accountNumber = 'Account number is required'
  } else if (!ACCOUNT_NUMBER_PATTERN.test(values.accountNumber.trim())) {
    errors.accountNumber = 'Use digits only, at least 6 of them'
  }

  if (!values.balance.trim()) {
    errors.balance = 'Balance is required'
  } else if (Number.isNaN(Number(values.balance))) {
    errors.balance = 'Balance must be a number'
  }

  if (!values.type) {
    errors.type = 'Account type is required'
  }

  if (!values.status) {
    errors.status = 'Status is required'
  }

  return errors
}

export function validateTransaction(
  values: TransactionFormValues,
): FormErrors<TransactionFormValues> {
  const errors: FormErrors<TransactionFormValues> = {}

  if (!values.accountId) {
    errors.accountId = 'Select an account'
  }

  const amount = Number(values.amount)

  if (!values.amount.trim()) {
    errors.amount = 'Amount is required'
  } else if (Number.isNaN(amount)) {
    errors.amount = 'Amount must be a number'
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!values.date) {
    errors.date = 'Date is required'
  } else if (values.date > today()) {
    errors.date = 'Date cannot be in the future'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required'
  } else if (values.description.trim().length > 120) {
    errors.description = 'Keep the description under 120 characters'
  }

  return errors
}

export function isValid<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length === 0
}
