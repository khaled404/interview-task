import clsx from 'clsx'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  placeholder?: string
  invalid?: boolean
}

export function Select({
  options,
  placeholder,
  className,
  invalid,
  ...props
}: SelectProps) {
  return (
    <select
      className={clsx(
        'w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2',
        invalid
          ? 'border-red-400 focus:ring-red-100'
          : 'border-slate-300 focus:ring-brand-100',
        className,
      )}
      {...props}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
