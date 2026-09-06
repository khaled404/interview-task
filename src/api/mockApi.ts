import { SEED_ACCOUNTS, SEED_TRANSACTIONS } from './seed'
import type {
  Account,
  AccountFormValues,
  Transaction,
  TransactionFilters,
  TransactionFormValues,
} from '../types'

const LATENCY = 400

let accounts: Account[] = SEED_ACCOUNTS.map((account) => ({ ...account }))
let transactions: Transaction[] = SEED_TRANSACTIONS.map((transaction) => ({ ...transaction }))

let idCounter = 100

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

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
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
    throw new Error('TODO: implement api.updateAccount')
  },

  deleteAccount(id: string): Promise<void> {
    throw new Error('TODO: implement api.deleteAccount')
  },

  listTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    let result = transactions

    if (filters.accountId) {
      result = result.filter((transaction) => transaction.accountId === filters.accountId)
    }

    if (filters.type) {
      result = result.filter((transaction) => transaction.type === filters.type)
    }

    return respond(result)
  },

  createTransaction(values: TransactionFormValues): Promise<Transaction> {
    const payload = toTransactionPayload(values)
    const account = accounts.find((item) => item.id === payload.accountId)

    if (!account) {
      return reject('Account not found', 404)
    }

    const transaction: Transaction = { id: nextId('txn'), ...payload }
    transactions = [...transactions, transaction]

    const delta = payload.type === 'deposit' ? payload.amount : -payload.amount
    accounts = accounts.map((item) =>
      item.id === account.id ? { ...item, balance: item.balance + delta } : item,
    )

    return respond(transaction)
  },

  updateTransaction(id: string, values: TransactionFormValues): Promise<Transaction> {
    throw new Error('TODO: implement api.updateTransaction')
  },

  deleteTransaction(id: string): Promise<void> {
    const transaction = transactions.find((item) => item.id === id)

    if (!transaction) {
      return reject('Transaction not found', 404)
    }

    transactions = transactions.filter((item) => item.id !== id)

    const delta = transaction.type === 'deposit' ? -transaction.amount : transaction.amount
    accounts = accounts.map((item) =>
      item.id === transaction.accountId ? { ...item, balance: item.balance + delta } : item,
    )

    return respond(undefined)
  },
}
