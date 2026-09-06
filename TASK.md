# Banking System — Transactions Interview Task

A small banking system built with **React + TypeScript + Vite + Tailwind CSS**. The API is mocked in the browser (`src/api/mockApi.ts`) with ~400ms of simulated latency; data resets on reload.

```bash
npm install
npm run dev
```

## Scope

The **Accounts** page is finished and works end to end — treat it as the reference for everything you write.

Your work is the **Transactions** page and the **Dashboard**. All the UI already exists; do not redesign it. Use the components in `src/components/ui` and keep the current layout, styling and behaviour.

## What to implement

Eight functions throw `TODO: implement …`. Do them in this order — each one unblocks the next screen.

### 1. Filtering and search — `src/lib/selectors.ts`

```ts
filterTransactions(transactions, filters)
```

`filters` is `{ accountId, type, search }`. An empty value means "no filter"; the three combine with AND. `search` is a case-insensitive match on the description (matching the amount as well is a nice touch). This is a pure function — no state, no side effects.

The Transactions page will not render until this returns a value.

### 2. Validation — `src/lib/validation.ts`

```ts
validateTransaction(values)
```

Return a map of field errors:

- account — required
- amount — required, a number greater than 0
- date — required, not in the future
- description — required, at most 120 characters

`validateAccount` in the same file is already written — follow its shape.

### 3. Transaction CRUD — `src/api/mockApi.ts`

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

### 4. Store actions — `src/store/useBankStore.ts`

```ts
createTransaction(values)
updateTransaction(id, values)
deleteTransaction(id)
```

Call the API, then keep client state in sync. Balances change on the server side, so the accounts list has to reflect that too — decide whether to patch state locally or reload, and be able to explain why.

### 5. Dashboard — `src/lib/selectors.ts`

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
