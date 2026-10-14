import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function Navbar({ onAddExpense }) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--fg)]">
            Hi, {user?.fullName?.split(' ')[0] ?? 'there'}
          </p>
          <p className="truncate text-xs text-[var(--muted)]">{user?.email}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className="btn btn-primary" onClick={onAddExpense}>
            Add Expense
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar