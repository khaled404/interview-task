import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2',
        invalid
          ? 'border-red-400 focus:ring-red-100'
          : 'border-slate-300 focus:ring-brand-100',
        className,
      )}
      {...props}
    />
  )
}
