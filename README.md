# Banking System — Transactions Interview Task

A small banking system built with **React + TypeScript + Vite + Tailwind CSS**. The API is mocked in the browser (`src/api/mockApi.ts`) with ~400ms of simulated latency; data resets on reload.

```bash
npm install
npm run dev
```

## What is already done

- **Dashboard** — complete. Stat cards, cash-flow summary, per-account breakdown and recent activity, all derived from the account and transaction data.
- **Accounts** — complete. Full CRUD, validation, details view. Use it as the reference for everything you write.
- **Transactions** — the UI is complete: table, mobile cards, search and filter bar, create/edit modal, delete confirmation, loading, empty and error states.

**Do not change the UI.** Every screen, component and style stays as it is.

## What to implement

Eight functions are unimplemented. The Transactions page renders and is fully clickable, but nothing it does actually works yet — filters return everything, the form accepts anything, and saving surfaces a `TODO` error.

### 1. Filtering and search — `src/lib/selectors.ts`

```ts
filterTransactions(transactions, filters)
```

Right now it returns the list unchanged. `filters` is `{ accountId, type, search }`:

- an empty value means "no filter"
- the three combine with **AND**
- `search` is a case-insensitive match on the description; matching the amount too is a nice touch

Keep it a pure function — no state, no side effects.

### 2. Validation — `src/lib/validation.ts`

```ts
validateTransaction(values)
```

Right now it returns an empty error map, so anything submits. Return an error per invalid field:

- account — required
- amount — required, a number greater than 0
- date — required, not in the future
- description — required, at most 120 characters

`validateAccount` in the same file is already written — follow its shape. The form already renders whatever you return.

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

Call the API, then keep client state in sync. Balances change on the server side, so the accounts list and the dashboard have to reflect that too — decide whether to patch state locally or reload, and be able to explain why.

## Suggested order

Filtering → validation → mock API → store actions. After the store actions work, the dashboard numbers should move on their own.

## What we are looking for

- Correct CRUD with state that stays in sync after every mutation
- Balances that stay consistent after create, update and delete
- Validation with useful messages, and errors surfaced in the UI
- Clean, readable TypeScript — no `any`, no duplicated logic
- The existing design left intact

Short notes on anything you would do differently with more time are welcome.
