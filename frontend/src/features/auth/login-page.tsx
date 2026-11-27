import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Alert, Button, FormField, Input } from '@/components/ui'
import { DEMO_PASSWORD } from '@/lib/api'

import {
  LOGIN_FIELD_ORDER,
  validateLogin,
  type LoginErrors,
  type LoginField,
  type LoginValues,
} from './auth-validation'
import { DemoAccounts, type DemoAccount } from './demo-accounts'
import { getReturnTo } from './return-to'
import { useAuth } from './use-auth'
import { PasswordField } from './password-field'

const initialValues: LoginValues = { email: '', password: '' }

const demoAccounts: DemoAccount[] = [
  { label: 'admin', name: 'Admin Resep Ibu', email: 'admin@resepibu.test' },
  { label: 'pembaca', name: 'Pembaca Satu', email: 'pembaca1@resepibu.test' },
]

export function LoginPage() {
  const { user, status, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const returnTo = getReturnTo(location.search)

  const [values, setValues] = useState<LoginValues>(initialValues)
  const [errors, setErrors] = useState<LoginErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={returnTo} replace />

  function update(field: LoginField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setFormError(null)
    setErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    update(event.target.name as LoginField, event.target.value)
  }

  function handleBlur(field: LoginField) {
    const fieldError = validateLogin(values)[field]
    setErrors((previous) => {
      const next = { ...previous }
      if (fieldError) next[field] = fieldError
      else delete next[field]
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    setFormError(null)

    const firstInvalid = LOGIN_FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(`login-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)

    try {
      await login(values.email.trim(), values.password)
      navigate(returnTo, { replace: true })
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : 'Email atau kata sandi salah. Silakan coba lagi.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemoAccount(account: DemoAccount) {
    setValues({ email: account.email, password: DEMO_PASSWORD })
    setErrors({})
    setFormError(null)
    document.getElementById('login-email')?.focus()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-action">Akun</p>
        <h1 className="text-h1 text-brown">Masuk</h1>
        <p className="text-body text-muted">
          Masuk untuk menyimpan resep dan mengelola kontribusi kamu.
        </p>
      </div>

      <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
        {formError ? (
          <Alert tone="danger" title="Tidak bisa masuk">
            {formError}
          </Alert>
        ) : null}

        <FormField id="login-email" label="Email" required error={errors.email}>
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            autoComplete="email"
            autoFocus
            disabled={submitting}
          />
        </FormField>

        <FormField id="login-password" label="Kata sandi" required error={errors.password}>
          <PasswordField
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            autoComplete="current-password"
            disabled={submitting}
          />
        </FormField>

        <Button type="submit" loading={submitting} disabled={submitting || status === 'loading'}>
          Masuk
        </Button>
      </form>

      <p className="text-small text-muted">
        Belum punya akun?{' '}
        <Link
          to="/daftar"
          className="font-bold text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Daftar
        </Link>
      </p>

      <DemoAccounts
        accounts={demoAccounts}
        password={DEMO_PASSWORD}
        disabled={submitting}
        onFill={fillDemoAccount}
      />
    </div>
  )
}
