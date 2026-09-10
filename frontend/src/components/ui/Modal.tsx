import { useEffect, useState, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const timeout = setTimeout(() => setMounted(false), 200)
    return () => clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    if (!mounted) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <div className={visible ? 'modal-overlay modal-overlay--visible' : 'modal-overlay'} onClick={onClose}>
      <div
        className={visible ? 'modal-card modal-card--visible' : 'modal-card'}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-card__header">
          <h2>{title}</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  )
}
