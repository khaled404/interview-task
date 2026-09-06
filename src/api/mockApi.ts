import { SEED_ACCOUNTS, SEED_TRANSACTIONS } from './seed'
import type {
  Account,
  AccountFormValues,
  Transaction,
  TransactionFormValues,
} from '../types'

const LATENCY = 400

let accounts: Account[] = SEED_ACCOUNTS.map((account) => ({ ...account }))
let transactions: Transaction[] = SEED_TRANSACTIONS.map((transaction) => ({ ...transaction }))

let idCounter = 100

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function nextId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

function respond<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), LATENCY)
  })
}

function reject(message: string, status = 400): Promise<never> {
  return new Promise((_resolve, rejectPromise) => {
    setTimeout(() => rejectPromise(new ApiError(message, status)), LATENCY)
  })
}

export function toAccountPayload(values: AccountFormValues) {
  return {
    holderName: values.holderName.trim(),
    accountNumber: values.accountNumber.trim(),
    type: values.type,
    balance: Number(values.balance),
    status: values.status,
  }
}

export function toTransactionPayload(values: TransactionFormValues) {
  return {
    accountId: values.accountId,
    type: values.type,
    amount: Number(values.amount),
    date: values.date,
    description: values.description.trim(),
  }
}

function applyBalance(accountId: string, delta: number) {
  accounts = accounts.map((account) =>
    account.id === accountId ? { ...account, balance: account.balance + delta } : account,
  )
}

function signedAmount(transaction: { type: string; amount: number }): number {
  return transaction.type === 'deposit' ? transaction.amount : -transaction.amount
}

export const api = {
  listAccounts(): Promise<Account[]> {
    return respond(accounts)
  },

  createAccount(values: AccountFormValues): Promise<Account> {
    const payload = toAccountPayload(values)

    if (accounts.some((account) => account.accountNumber === payload.accountNumber)) {
      return reject('An account with this number already exists', 409)
    }

    const account: Account = {
      id: nextId('acc'),
      createdAt: new Date().toISOString().slice(0, 10),
      ...payload,
    }

    accounts = [...accounts, account]
    return respond(account)
  },

  updateAccount(id: string, values: AccountFormValues): Promise<Account> {
    const existing = accounts.find((account) => account.id === id)

    if (!existing) {
      return reject('Account not found', 404)
    }

    const payload = toAccountPayload(values)
    const duplicate = accounts.some(
      (account) => account.id !== id && account.accountNumber === payload.accountNumber,
    )

    if (duplicate) {
      return reject('An account with this number already exists', 409)
    }

    const updated: Account = { ...existing, ...payload }
    accounts = accounts.map((account) => (account.id === id ? updated : account))

    return respond(updated)
  },

  deleteAccount(id: string): Promise<void> {
    if (!accounts.some((account) => account.id === id)) {
      return reject('Account not found', 404)
    }

    accounts = accounts.filter((account) => account.id !== id)
    transactions = transactions.filter((transaction) => transaction.accountId !== id)

    return respond(undefined)
  },

  listTransactions(): Promise<Transaction[]> {
    return respond(transactions)
  },

  createTransaction(values: TransactionFormValues): Promise<Transaction> {
    const payload = toTransactionPayload(values)

    if (!accounts.some((account) => account.id === payload.accountId)) {
      return reject('Account not found', 404)
    }

    const transaction: Transaction = { id: nextId('txn'), ...payload }

    transactions = [...transactions, transaction]
    applyBalance(payload.accountId, signedAmount(payload))

    return respond(transaction)
  },

  updateTransaction(id: string, values: TransactionFormValues): Promise<Transaction> {
    const existing = transactions.find((transaction) => transaction.id === id)

    if (!existing) {
      return reject('Transaction not found', 404)
    }

    const payload = toTransactionPayload(values)

    if (!accounts.some((account) => account.id === payload.accountId)) {
      return reject('Account not found', 404)
    }

    applyBalance(existing.accountId, -signedAmount(existing))
    applyBalance(payload.accountId, signedAmount(payload))

    const updated: Transaction = { ...existing, ...payload }
    transactions = transactions.map((transaction) =>
      transaction.id === id ? updated : transaction,
    )

    return respond(updated)
  },

  deleteTransaction(id: string): Promise<void> {
    const existing = transactions.find((transaction) => transaction.id === id)

    if (!existing) {
      return reject('Transaction not found', 404)
    }

    transactions = transactions.filter((transaction) => transaction.id !== id)
    applyBalance(existing.accountId, -signedAmount(existing))

    return respond(undefined)
  },
}
