import { create } from 'zustand'
import { api } from '../api/mockApi'
import type {
  Account,
  AccountFormValues,
  Transaction,
  TransactionFilters,
  TransactionFormValues,
} from '../types'

interface BankState {
  accounts: Account[]
  transactions: Transaction[]
  loading: boolean
  error: string | null
  filters: TransactionFilters

  load: () => Promise<void>
  createAccount: (values: AccountFormValues) => Promise<void>
  updateAccount: (id: string, values: AccountFormValues) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  createTransaction: (values: TransactionFormValues) => Promise<void>
  updateTransaction: (id: string, values: TransactionFormValues) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setFilter: (field: keyof TransactionFilters, value: string) => void
  resetFilters: () => void
}

const EMPTY_FILTERS: TransactionFilters = { accountId: '', type: '', search: '' }

export const useBankStore = create<BankState>((set, get) => ({
  accounts: [],
  transactions: [],
  loading: false,
  error: null,
  filters: EMPTY_FILTERS,

  load: async () => {
    set({ loading: true, error: null })
    try {
      const [accounts, transactions] = await Promise.all([
        api.listAccounts(),
        api.listTransactions(),
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
    const updated = await api.updateAccount(id, values)
    set((state) => ({
      accounts: state.accounts.map((account) => (account.id === id ? updated : account)),
    }))
  },

  deleteAccount: async (id) => {
    await api.deleteAccount(id)
    set((state) => ({
      accounts: state.accounts.filter((account) => account.id !== id),
      transactions: state.transactions.filter(
        (transaction) => transaction.accountId !== id,
      ),
    }))
  },

  createTransaction: async (values) => {
    const created = await api.createTransaction(values)
    const accounts = await api.listAccounts()
    set((state) => ({ transactions: [...state.transactions, created], accounts }))
  },

  updateTransaction: async (id, values) => {
    const updated = await api.updateTransaction(id, values)
    const accounts = await api.listAccounts()
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id ? updated : transaction,
      ),
      accounts,
    }))
  },

  deleteTransaction: async (id) => {
    await api.deleteTransaction(id)
    const accounts = await api.listAccounts()
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
      accounts,
    }))
  },

  setFilter: (field, value) =>
    set((state) => ({ filters: { ...state.filters, [field]: value } })),

  resetFilters: () => set({ filters: EMPTY_FILTERS }),
}))
