import type { Account, Transaction } from '../types'

export const SEED_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    holderName: 'Amira Hassan',
    accountNumber: '1000200030',
    type: 'checking',
    balance: 12450.75,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: 'acc-2',
    holderName: 'Karim Nabil',
    accountNumber: '1000200031',
    type: 'savings',
    balance: 38210.4,
    status: 'active',
    createdAt: '2024-03-02',
  },
  {
    id: 'acc-3',
    holderName: 'Sara Fathy',
    accountNumber: '1000200032',
    type: 'credit',
    balance: 1820.9,
    status: 'inactive',
    createdAt: '2024-05-21',
  },
  {
    id: 'acc-4',
    holderName: 'Omar Adel',
    accountNumber: '1000200033',
    type: 'savings',
    balance: 7325.15,
    status: 'closed',
    createdAt: '2023-11-08',
  },
]

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', accountId: 'acc-1', type: 'deposit', amount: 2500, date: '2025-06-01', description: 'Salary transfer' },
  { id: 'txn-2', accountId: 'acc-1', type: 'withdrawal', amount: 320.5, date: '2025-06-04', description: 'ATM withdrawal' },
  { id: 'txn-3', accountId: 'acc-2', type: 'deposit', amount: 10000, date: '2025-06-09', description: 'Annual bonus' },
  { id: 'txn-4', accountId: 'acc-2', type: 'withdrawal', amount: 1250.25, date: '2025-06-15', description: 'Rent' },
  { id: 'txn-5', accountId: 'acc-3', type: 'withdrawal', amount: 480.9, date: '2025-06-18', description: 'Card settlement' },
  { id: 'txn-6', accountId: 'acc-4', type: 'deposit', amount: 1800, date: '2025-07-02', description: 'Freelance invoice' },
  { id: 'txn-7', accountId: 'acc-1', type: 'deposit', amount: 640.1, date: '2025-07-19', description: 'Refund' },
  { id: 'txn-8', accountId: 'acc-2', type: 'withdrawal', amount: 95.99, date: '2025-07-24', description: 'Utilities' },
]
