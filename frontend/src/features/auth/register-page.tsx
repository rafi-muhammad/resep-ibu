import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { Alert, Button, Checkbox, FormField, Input } from '@/components/ui'
import { ApiError } from '@/lib/api'

import {
  REGISTER_FIELD_ORDER,
  validateRegister,
  type RegisterErrors,
  type RegisterField,
  type RegisterValues,
} from './auth-validation'
import { useAuth } from './use-auth'
import { PasswordField } from './password-field'

const initialValues: RegisterValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  consent: false,
}

function mapServerFields(fields: Record<string, string>): RegisterErrors {
  const errors: RegisterErrors = {}
  for (const field of REGISTER_FIELD_ORDER) {
    const message = fields[field]
    if (message) errors[field] = message
  }
  return errors
}

export function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState<RegisterValues>(initialValues)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/profil" replace />

  function update<K extends RegisterField>(field: K, value: RegisterValues[K]) {
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
    update(event.target.name as RegisterField, event.target.value)
  }

  function handleBlur(field: RegisterField) {
    const fieldError = validateRegister(values)[field]
    setErrors((previous) => {
      const next = { ...previous }
      if (fieldError) next[field] = fieldError
      else delete next[field]
      return next
    })
  }

  function focusFirstError(nextErrors: RegisterErrors) {
    const firstInvalid = REGISTER_FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) document.getElementById(`register-${firstInvalid}`)?.focus()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const nextErrors = validateRegister(values)
    setErrors(nextErrors)
    setFormError(null)

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    setSubmitting(true)

    try {
      await register(values.name.trim(), values.email.trim(), values.password)
      navigate('/profil', { replace: true })
    } catch (cause) {
      if (cause instanceof ApiError && cause.fields) {
        const fieldErrors = mapServerFields(cause.fields)
        setErrors(fieldErrors)
        focusFirstError(fieldErrors)
      } else {
        setFormError(cause instanceof Error ? cause.message : 'Pendaftaran gagal. Coba lagi.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-action">Akun</p>
        <h1 className="text-h1 text-brown">Daftar akun</h1>
        <p className="text-body text-muted">
          Buat akun demo untuk menyimpan resep dan mengirim kontribusi.
        </p>
      </div>

      <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
        {formError ? (
          <Alert tone="danger" title="Pendaftaran gagal">
            {formError}
          </Alert>
        ) : null}

        <FormField id="register-name" label="Nama" required error={errors.name}>
          <Input
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            autoComplete="name"
            autoFocus
            disabled={submitting}
          />
        </FormField>

        <FormField id="register-email" label="Email" required error={errors.email}>
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            autoComplete="email"
            disabled={submitting}
          />
        </FormField>

        <FormField
          id="register-password"
          label="Kata sandi"
          required
          error={errors.password}
          hint="Minimal 8 karakter."
        >
          <PasswordField
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            autoComplete="new-password"
            disabled={submitting}
          />
        </FormField>

        <FormField
          id="register-confirmPassword"
          label="Konfirmasi kata sandi"
          required
          error={errors.confirmPassword}
        >
          <PasswordField
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            autoComplete="new-password"
            disabled={submitting}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Checkbox
            id="register-consent"
            name="consent"
            label="Saya setuju membuat akun demo"
            description="Akun dan sesi hanya tersimpan di browser ini."
            checked={values.consent}
            onChange={(event) => update('consent', event.target.checked)}
            onBlur={() => handleBlur('consent')}
            invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'register-consent-error' : undefined}
            disabled={submitting}
          />
          {errors.consent ? (
            <p
              id="register-consent-error"
              role="alert"
              className="text-small font-bold text-danger"
            >
              {errors.consent}
            </p>
          ) : null}
        </div>

        <Button type="submit" loading={submitting} disabled={submitting}>
          Daftar
        </Button>
      </form>

      <p className="text-small text-muted">
        Sudah punya akun?{' '}
        <Link
          to="/masuk"
          className="font-bold text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Masuk
        </Link>
      </p>
    </div>
  )
}
