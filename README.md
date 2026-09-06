# Bankly — Banking System

A small banking system built with **React + TypeScript + Vite + Tailwind CSS**. The API is mocked in the browser (`src/api/mockApi.ts`) with ~400ms of simulated latency; data resets on reload.

```bash
npm install
npm run dev
```

`TASK.md` holds the interview brief this project was built from — the version handed to a candidate has the functions listed there left unimplemented.

## Screens

**Dashboard** — total accounts, total balance, total deposits, total withdrawals, and the five most recent transactions. All derived from the live account and transaction data in `src/lib/selectors.ts`.

**Accounts** — list, create, view details with that account's history, edit, delete. Deleting an account also removes its transactions.

**Transactions** — list, create, edit, delete, plus a filter bar: free-text search over description and amount, an account filter and a type filter. The three combine with AND, and a row counter and "Clear filters" button appear once a filter is active.

## Structure

```
src/
  api/mockApi.ts     mock API + in-memory data, the only place data changes
  api/seed.ts        seed accounts and transactions
  lib/selectors.ts   filtering and dashboard maths (pure functions)
  lib/validation.ts  form validation (pure functions)
  lib/format.ts      currency, date and text formatting
  store/             Zustand store — the single source of truth for the UI
  components/ui/     reusable presentational components
  features/          Accounts, Transactions, Dashboard screens
```

## Balance handling

Balances are derived state owned by the mock API, never by the UI:

- creating a deposit adds the amount to the account, a withdrawal subtracts it
- updating a transaction reverses the old amount first, then applies the new one — including when the transaction moves to a different account
- deleting a transaction reverses it
- deleting an account removes its transactions with it

After any transaction mutation the store refetches accounts, so balances shown in the UI always match the API.

## Validation

**Account** — holder name required and at least 3 characters; account number required, digits only, at least 6; balance required and numeric; type and status required. Duplicate account numbers are rejected by the API.

**Transaction** — account required; amount required, numeric, greater than 0; date required and not in the future; description required, at most 120 characters.
