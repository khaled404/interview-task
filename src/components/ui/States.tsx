import type { ReactNode } from 'react'
import { Button } from './Button'

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-slate-500">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <p className="text-sm font-semibold text-red-700">Something went wrong</p>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
