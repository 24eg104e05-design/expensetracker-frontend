export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg overflow-hidden shadow-[var(--shadow-raised,0_8px_24px_rgba(0,0,0,0.12))]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[var(--border-soft)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--fg)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-2 py-1 text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            ✕
          </button>
        </header>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--border-soft)] px-6 py-4">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  )
}

export default Modal