import { Button } from '@/components/ui'

export interface DemoAccount {
  label: string
  name: string
  email: string
}

export interface DemoAccountsProps {
  accounts: DemoAccount[]
  password: string
  disabled?: boolean
  onFill: (account: DemoAccount) => void
}

/** Kotak akun demo dengan tombol isi otomatis; hanya untuk Phase 1. */
export function DemoAccounts({ accounts, password, disabled, onFill }: DemoAccountsProps) {
  return (
    <section
      aria-label="Akun demo"
      className="mt-6 rounded-md border border-border bg-surface/60 p-4"
    >
      <h2 className="text-h3 text-brown">Akun demo</h2>
      <p className="mt-1 text-small text-muted">
        Semua akun memakai kata sandi <code className="font-bold text-brown">{password}</code>.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {accounts.map((account) => (
          <li
            key={account.email}
            className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-white px-3 py-2"
          >
            <div className="flex min-w-0 flex-col">
              <span className="text-small font-bold text-brown">{account.name}</span>
              <span className="break-all text-small text-muted">{account.email}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={disabled}
              aria-label={`Isi otomatis akun ${account.label}`}
              onClick={() => onFill(account)}
            >
              Isi otomatis
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
