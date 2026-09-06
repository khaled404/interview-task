# Banking System — Transactions Interview Task

A small banking system built with **React + TypeScript + Vite + Tailwind CSS**. The API is mocked in the browser (`src/api/mockApi.ts`) with ~400ms of simulated latency; data resets on reload.

```bash
npm install
npm run dev
```

## Scope

The **Accounts** page is finished and works end to end — treat it as the reference for everything you write.

The **Transactions** page is **UI only**. Every control is built and styled, but nothing is wired: it renders static sample rows from `src/api/seed.ts`, the filters change no results, and saving or deleting only closes the dialog. There is no validation anywhere on the page.

Your job is to make it real, and to build the Dashboard from the transaction data. Do not redesign the UI — keep the current layout, styling and components.

## What to implement

### 1. Connect the page to the store — `src/features/transactions/TransactionsPage.tsx`

Replace the static `SEED_ACCOUNTS` / `SEED_TRANSACTIONS` imports with `useBankStore`, and wire the handlers to the store actions. Bring back the loading and error states — `Spinner` and `ErrorState` are in `src/components/ui/States.tsx`, and `AccountsPage.tsx` shows the pattern.

### 2. Filtering and search — `src/lib/selectors.ts`

```ts
filterTransactions(transactions, filters)
```

`filters` is `{ accountId, type, search }`. An empty value means "no filter"; the three combine with AND. `search` is a case-insensitive match on the description (matching the amount as well is a nice touch). Keep it a pure function — no state, no side effects.

### 3. Validation — `src/lib/validation.ts` and `TransactionForm.tsx`

```ts
validateTransaction(values)
```

Return a map of field errors and surface them in the form:

- account — required
- amount — required, a number greater than 0
- date — required, not in the future
- description — required, at most 120 characters

`validateAccount` and `AccountForm.tsx` are already written — follow their shape. `Field` takes an `error` prop and `Input` / `Select` take `invalid`.

### 4. Transaction CRUD — `src/api/mockApi.ts`

```ts
api.createTransaction(values)
api.updateTransaction(id, values)
api.deleteTransaction(id)
```

Rules:

- Return a promise; use the existing `respond` / `reject` helpers so loading and error states behave realistically.
- Reject with `ApiError` when the account does not exist (404) or the transaction id is unknown (404).
- **Keep account balances correct.** A deposit adds to the account balance, a withdrawal subtracts. On update, reverse the old amount before applying the new one — and handle the transaction moving to a different account. On delete, reverse it.
- `toTransactionPayload`, `applyBalance` and `signedAmount` are there to help. `createAccount` / `updateAccount` / `deleteAccount` show the pattern.

### 5. Store actions — `src/store/useBankStore.ts`

```ts
createTransaction(values)
updateTransaction(id, values)
deleteTransaction(id)
```

Call the API, then keep client state in sync. Balances change on the server side, so the accounts list has to reflect that too — decide whether to patch state locally or reload, and be able to explain why.

### 6. Dashboard — `src/lib/selectors.ts`

```ts
getDashboardStats(accounts, transactions)
getRecentTransactions(transactions, limit)
```

- `totalAccounts` — number of accounts
- `totalBalance` — sum of account balances
- `totalDeposits` — sum of deposit amounts
- `totalWithdrawals` — sum of withdrawal amounts
- `getRecentTransactions` — the newest transactions first, capped at `limit`

## What we are looking for

- Correct CRUD with state that stays in sync after every mutation
- Balances that stay consistent after create, update and delete
- Validation with useful messages, and errors surfaced in the UI
- Loading, empty and error states that behave
- Clean, readable TypeScript — no `any`, no duplicated logic
- The existing design left intact

Short notes on anything you would do differently with more time are welcome.
