import { create } from 'zustand'
import { api } from '../api/mockApi'
import type {
  Account,
  AccountFormValues,
  Transaction,
  TransactionFormValues,
} from '../types'

interface BankState {
  accounts: Account[]
  transactions: Transaction[]
  loading: boolean
  error: string | null
  accountFilter: string
  typeFilter: string

  load: () => Promise<void>
  createAccount: (values: AccountFormValues) => Promise<void>
  updateAccount: (id: string, values: AccountFormValues) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  createTransaction: (values: TransactionFormValues) => Promise<void>
  updateTransaction: (id: string, values: TransactionFormValues) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setAccountFilter: (value: string) => void
  setTypeFilter: (value: string) => void
}

export const useBankStore = create<BankState>((set, get) => ({
  accounts: [],
  transactions: [],
  loading: false,
  error: null,
  accountFilter: '',
  typeFilter: '',

  load: async () => {
    set({ loading: true, error: null })
    try {
      const [accounts, transactions] = await Promise.all([
        api.listAccounts(),
        api.listTransactions({ accountId: get().accountFilter, type: get().typeFilter }),
      ])
      set({ accounts, transactions })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ loading: false })
    }
  },

  createAccount: async (values) => {
    const created = await api.createAccount(values)
    set((state) => ({ accounts: [...state.accounts, created] }))
  },

  updateAccount: async (id, values) => {
    throw new Error('TODO: implement store.updateAccount')
  },

  deleteAccount: async (id) => {
    throw new Error('TODO: implement store.deleteAccount')
  },

  createTransaction: async (values) => {
    await api.createTransaction(values)
    await get().load()
  },

  updateTransaction: async (id, values) => {
    throw new Error('TODO: implement store.updateTransaction')
  },

  deleteTransaction: async (id) => {
    await api.deleteTransaction(id)
    await get().load()
  },

  setAccountFilter: (value) => {
    set({ accountFilter: value })
    void get().load()
  },

  setTypeFilter: (value) => {
    set({ typeFilter: value })
    void get().load()
  },
}))
