import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  busy?: boolean
  error?: string | null
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  busy,
  error,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      {error ? (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 font-mono text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  )
}
