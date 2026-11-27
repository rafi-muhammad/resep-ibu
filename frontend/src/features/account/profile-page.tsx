import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'

import { Alert, Avatar, Button, Card, FormField, Input, Textarea, useToast } from '@/components/ui'
import { ApiError } from '@/lib/api'
import { useAuth } from '@/features/auth'

import {
  AVATAR_PRESETS,
  DEFAULT_AVATAR,
  PROFILE_FIELD_ORDER,
  PROFILE_LIMITS,
  validateProfile,
  type ProfileErrors,
  type ProfileField,
  type ProfileValues,
} from './profile-validation'

function toValues(user: {
  name: string
  email: string
  bio: string
  avatar: string
}): ProfileValues {
  return {
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar || DEFAULT_AVATAR,
  }
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()

  const [values, setValues] = useState<ProfileValues>(() =>
    user ? toValues(user) : { name: '', email: '', bio: '', avatar: DEFAULT_AVATAR },
  )
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const pendingFocus = useRef<string | null>(null)

  useEffect(() => {
    if (submitting || !pendingFocus.current) return
    const id = pendingFocus.current
    pendingFocus.current = null
    document.getElementById(id)?.focus()
  }, [errors, submitting])

  if (!user) return null

  function update<K extends ProfileField>(field: K, value: ProfileValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setFormError(null)
    setErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    update(event.target.name as ProfileField, event.target.value)
  }

  function handleBlur(field: ProfileField) {
    const fieldError = validateProfile(values)[field]
    setErrors((previous) => {
      const next = { ...previous }
      if (fieldError) next[field] = fieldError
      else delete next[field]
      return next
    })
  }

  function focusFirstError(nextErrors: ProfileErrors) {
    const firstInvalid = PROFILE_FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) pendingFocus.current = `profile-${firstInvalid}`
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const nextErrors = validateProfile(values)
    setErrors(nextErrors)
    setFormError(null)

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors)
      return
    }

    setSubmitting(true)

    try {
      await updateProfile({
        name: values.name.trim(),
        email: values.email.trim(),
        bio: values.bio.trim(),
        avatar: values.avatar,
      })
      toast({
        title: 'Profil diperbarui',
        description: 'Perubahan data pribadi tersimpan di browser ini.',
        tone: 'success',
      })
    } catch (cause) {
      if (cause instanceof ApiError && cause.fields) {
        const fieldErrors: ProfileErrors = {}
        for (const field of PROFILE_FIELD_ORDER) {
          const message = cause.fields[field]
          if (message) fieldErrors[field] = message
        }
        setErrors(fieldErrors)
        focusFirstError(fieldErrors)
      } else {
        setFormError(cause instanceof Error ? cause.message : 'Profil gagal disimpan. Coba lagi.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const bioLength = values.bio.trim().length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="eyebrow text-action">Akun</p>
        <h1 className="text-h1 text-brown">Profil saya</h1>
        <p className="text-body text-muted">
          Kelola nama, email, bio, dan avatar yang tampil di akun demo ini.
        </p>
      </div>

      <Card className="flex flex-wrap items-center gap-4">
        <Avatar src={values.avatar} name={values.name || user.name} size="lg" />
        <div className="flex min-w-0 flex-col">
          <p className="font-bold text-brown">{user.name}</p>
          <p className="break-all text-small text-muted">{user.email}</p>
        </div>
      </Card>

      <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
        {formError ? (
          <Alert tone="danger" title="Profil gagal disimpan">
            {formError}
          </Alert>
        ) : null}

        <FormField id="profile-name" label="Nama" required error={errors.name}>
          <Input
            name="name"
            value={values.name}
            onChange={handleTextChange}
            onBlur={() => handleBlur('name')}
            autoComplete="name"
            disabled={submitting}
          />
        </FormField>

        <FormField
          id="profile-email"
          label="Email"
          required
          error={errors.email}
          hint="Email harus unik dan dipakai untuk masuk."
        >
          <Input
            name="email"
            type="email"
            value={values.email}
            onChange={handleTextChange}
            onBlur={() => handleBlur('email')}
            autoComplete="email"
            disabled={submitting}
          />
        </FormField>

        <FormField
          id="profile-bio"
          label="Bio"
          error={errors.bio}
          hint={`${bioLength}/${PROFILE_LIMITS.bioMax} karakter.`}
        >
          <Textarea
            name="bio"
            value={values.bio}
            onChange={handleTextChange}
            onBlur={() => handleBlur('bio')}
            maxLength={PROFILE_LIMITS.bioMax}
            rows={4}
            disabled={submitting}
          />
        </FormField>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-small font-bold text-brown">Avatar</legend>
          <p className="text-small text-muted">
            Pilih satu dari preset bawaan. Tidak ada unggah foto.
          </p>
          <div className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {AVATAR_PRESETS.map((preset) => (
              <label
                key={preset.src}
                className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-border bg-white p-3 text-center hover:border-brown has-[:checked]:border-action has-[:checked]:bg-surface"
              >
                <input
                  id={preset.src === DEFAULT_AVATAR ? 'profile-avatar' : undefined}
                  type="radio"
                  name="avatar"
                  value={preset.src}
                  checked={values.avatar === preset.src}
                  onChange={() => update('avatar', preset.src)}
                  onBlur={() => handleBlur('avatar')}
                  className="peer sr-only"
                  disabled={submitting}
                />
                <img
                  src={preset.src}
                  alt=""
                  className="h-12 w-12 rounded-full bg-surface object-cover peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
                />
                <span className="text-small font-bold text-brown">{preset.label}</span>
              </label>
            ))}
          </div>
          {errors.avatar ? (
            <p role="alert" className="text-small font-bold text-danger">
              {errors.avatar}
            </p>
          ) : null}
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={submitting} disabled={submitting}>
            Simpan perubahan
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={() => {
              setValues(toValues(user))
              setErrors({})
              setFormError(null)
            }}
          >
            Batalkan
          </Button>
        </div>
      </form>
    </div>
  )
}
