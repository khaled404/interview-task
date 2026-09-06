import type {
  AccountFormValues,
  FormErrors,
  TransactionFormValues,
} from '../types'

export function validateAccount(
  values: AccountFormValues,
): FormErrors<AccountFormValues> {
  throw new Error('TODO: implement validateAccount')
}

export function validateTransaction(
  values: TransactionFormValues,
): FormErrors<TransactionFormValues> {
  throw new Error('TODO: implement validateTransaction')
}

export function isValid<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length === 0
}
