import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { Alert, Button, FormField, useToast } from '@/components/ui'
import { ApiError } from '@/lib/api'
import { PasswordField, useAuth } from '@/features/auth'

import {
  PASSWORD_FIELD_ORDER,
  validatePassword,
  type PasswordErrors,
  type PasswordField as PasswordFieldName,
  type PasswordValues,
} from './profile-validation'

const initialValues: PasswordValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export function PasswordPage() {
  const { changePassword } = useAuth()
  const { toast } = useToast()

  const [values, setValues] = useState<PasswordValues>(initialValues)
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    if (submitting || !pendingFocus.current) return
    const id = pendingFocus.current
    pendingFocus.current = null
    document.getElementById(id)?.focus()
  }, [errors, submitting])

  function update(field: PasswordFieldName, value: string) {
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
    update(event.target.name as PasswordFieldName, event.target.value)
  }

  function handleBlur(field: PasswordFieldName) {
    const fieldError = validatePassword(values)[field]
    setErrors((previous) => {
      const next = { ...previous }
      if (fieldError) next[field] = fieldError
      else delete next[field]
      return next
    })
  }

  function focusFirstError(nextErrors: PasswordErrors) {
    const firstInvalid = PASSWORD_FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) pendingFocus.current = `password-${firstInvalid}`
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const nextErrors = validatePassword(values)
    setErrors(nextErrors)
    setFormError(null)

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    setSubmitting(true)

    try {
      await changePassword(values.currentPassword, values.newPassword)
      setValues(initialValues)
      setErrors({})
      toast({
        title: 'Kata sandi diperbarui',
        description: 'Gunakan kata sandi baru saat masuk berikutnya.',
        tone: 'success',
      })
    } catch (cause) {
      if (cause instanceof ApiError && cause.fields?.currentPassword) {
        const fieldErrors: PasswordErrors = {
          currentPassword: cause.fields.currentPassword,
        }
        setErrors(fieldErrors)
        focusFirstError(fieldErrors)
      } else {
        setFormError(cause instanceof Error ? cause.message : 'Kata sandi gagal diubah. Coba lagi.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-action">Akun</p>
        <h1 className="text-h1 text-brown">Keamanan akun</h1>
        <p className="text-body text-muted">
          Ubah kata sandi akun demo. Kata sandi hanya tersimpan di browser ini dan tidak pernah
          ditampilkan kembali.
        </p>
      </div>

      <Alert tone="info" title="Mode demo">
        Perubahan kata sandi berlaku untuk sesi demo di browser ini, bukan autentikasi produksi.
      </Alert>

      <form className="flex max-w-xl flex-col gap-5" noValidate onSubmit={handleSubmit}>
        {formError ? (
          <Alert tone="danger" title="Kata sandi gagal diubah">
            {formError}
          </Alert>
        ) : null}

        <FormField
          id="password-currentPassword"
          label="Kata sandi saat ini"
          required
          error={errors.currentPassword}
        >
          <PasswordField
            name="currentPassword"
            value={values.currentPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('currentPassword')}
            autoComplete="current-password"
            disabled={submitting}
          />
        </FormField>

        <FormField
          id="password-newPassword"
          label="Kata sandi baru"
          required
          error={errors.newPassword}
          hint="Minimal 8 karakter dan berbeda dari kata sandi saat ini."
        >
          <PasswordField
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('newPassword')}
            autoComplete="new-password"
            disabled={submitting}
          />
        </FormField>

        <FormField
          id="password-confirmPassword"
          label="Konfirmasi kata sandi baru"
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

        <div>
          <Button type="submit" loading={submitting} disabled={submitting}>
            Perbarui kata sandi
          </Button>
        </div>
      </form>
    </div>
  )
}
