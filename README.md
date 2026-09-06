# Banking System — Frontend Interview Task

A small banking system built with **React + TypeScript + Vite + Tailwind CSS**, with a **mock API** that runs entirely in the browser (`src/api/mockApi.ts`, ~400ms simulated latency, resets on reload).

Runs on StackBlitz with no setup. Locally:

```bash
npm install
npm run dev
```

## What is already built

- **Dashboard** — stat cards and recent activity
- **Accounts** — list, create, view details, edit, delete
- **Transactions** — list, filter by account and type, create, edit, delete
- Reusable UI kit in `src/components/ui` (Button, Input, Select, Field, Modal, ConfirmDialog, DataTable, Badge, Card, loading / empty / error states)
- Global state in `src/store/useBankStore.ts` (Zustand)

## Your task

Nine functions are unimplemented. Each one throws `TODO: implement …`, so the app tells you where you are. Implement all of them.

| # | File | Function | What it must do |
| --- | --- | --- | --- |
| 1 | `src/lib/validation.ts` | `validateAccount` | Return a map of field errors for the account form |
| 2 | `src/lib/validation.ts` | `validateTransaction` | Return a map of field errors for the transaction form |
| 3 | `src/lib/selectors.ts` | `getDashboardStats` | Total accounts, total balance, total deposits, total withdrawals |
| 4 | `src/api/mockApi.ts` | `api.updateAccount` | Update the stored account and resolve with it |
| 5 | `src/api/mockApi.ts` | `api.deleteAccount` | Remove the account and its transactions |
| 6 | `src/api/mockApi.ts` | `api.updateTransaction` | Update the transaction and keep the account balance correct |
| 7 | `src/store/useBankStore.ts` | `updateAccount` | Call the API and sync state after the mutation |
| 8 | `src/store/useBankStore.ts` | `deleteAccount` | Call the API and sync state after the mutation |
| 9 | `src/store/useBankStore.ts` | `updateTransaction` | Call the API and sync state after the mutation |

Suggested order: validation → dashboard stats → mock API → store actions.

### Validation rules

**Account**

- holder name — required, at least 3 characters
- account number — required, digits only, at least 6 digits
- balance — required, a valid number
- type and status — required

**Transaction**

- account — required
- amount — required, a number greater than 0
- date — required, not in the future
- description — required, at most 120 characters

### API rules

- `updateAccount` must reject with an `ApiError` if another account already uses the same account number.
- `deleteAccount` must also remove that account's transactions.
- `updateTransaction` must keep balances consistent: reverse the old amount, then apply the new one. Look at `createTransaction` and `deleteTransaction` for the pattern.
- Every method returns a promise and uses the existing `respond` / `reject` helpers so loading and error states stay realistic.

### Bonus (only if you have time)

Block a withdrawal that would push a `checking` account below zero, and surface that error in the transaction form.

## What we are looking for

- Correct CRUD with state that stays in sync after every mutation
- Real form validation and useful error messages
- Loading, empty and error states handled everywhere
- Reusable components, no copy-pasted logic
- Clean, readable TypeScript — no `any`
- The UI stays responsive on mobile

Notes on trade-offs or anything you would do differently with more time are welcome in a short comment when you submit.
