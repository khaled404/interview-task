import clsx from 'clsx'
import { STATUS_STYLES } from '../../lib/constants'
import { titleCase } from '../../lib/format'
import type { AccountStatus } from '../../types'

export function Badge({ status }: { status: AccountStatus }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        STATUS_STYLES[status],
      )}
    >
      {titleCase(status)}
    </span>
  )
}
