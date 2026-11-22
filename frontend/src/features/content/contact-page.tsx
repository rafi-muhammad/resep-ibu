import { Mail, ShieldCheck } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import {
  Alert,
  Button,
  Card,
  Checkbox,
  FormField,
  Input,
  PageHeader,
  Textarea,
} from '@/components/ui'
import { repositories } from '@/lib/api'
import type { ContactMessage } from '@/lib/api/types'

import {
  CONTACT_FIELD_ORDER,
  CONTACT_LIMITS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactFormValues,
} from './contact-validation'

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
}

type SubmitStatus = 'idle' | 'submitting' | 'success'

/** Form kontak tervalidasi yang menyimpan pesan ke kotak masuk demo. */
export function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [sent, setSent] = useState<ContactMessage | null>(null)

  function update<K extends ContactField>(field: K, value: ContactFormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setSubmitError(null)
    setErrors((previous) => {
      if (!previous[field]) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    update(event.target.name as ContactField, event.target.value)
  }

  function handleConsent(event: ChangeEvent<HTMLInputElement>) {
    update('consent', event.target.checked)
  }

  function handleBlur(field: ContactField) {
    const fieldError = validateContact(values)[field]
    setErrors((previous) => {
      const next = { ...previous }
      if (fieldError) next[field] = fieldError
      else delete next[field]
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (status === 'submitting') return

    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    setSubmitError(null)

    const firstInvalid = CONTACT_FIELD_ORDER.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }

    setStatus('submitting')

    try {
      const message = await repositories.contact.create({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      })
      setSent(message)
      setStatus('success')
    } catch {
      setSubmitError('Pesan gagal dikirim. Isian tetap tersimpan, silakan coba lagi.')
      setStatus('idle')
    }
  }

  function resetForm() {
    setValues(initialValues)
    setErrors({})
    setSent(null)
    setSubmitError(null)
    setStatus('idle')
  }

  const errorCount = CONTACT_FIELD_ORDER.filter((field) => errors[field]).length
  const submitting = status === 'submitting'

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi kami"
        description="Kirim pertanyaan, masukan, atau laporan tentang resep. Formulir ini adalah bagian dari demo Phase 1."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-5">
          {status === 'success' && sent ? (
            <Card padding="lg" className="flex flex-col gap-5">
              <Alert tone="success" title="Pesan terkirim (demo)">
                Pesan dengan subjek “{sent.subject}” tersimpan di kotak masuk demo. Pengelola dapat
                melihatnya di panel admin. Tidak ada email yang benar-benar dikirim.
              </Alert>
              <div>
                <Button variant="secondary" onClick={resetForm}>
                  Kirim pesan lain
                </Button>
              </div>
            </Card>
          ) : (
            <Card padding="lg">
              <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
                <Alert tone="info" title="Mode demo">
                  Pesan disimpan di perangkat ini untuk ditinjau di panel admin. Tidak ada
                  pengiriman email nyata.
                </Alert>

                {errorCount > 0 ? (
                  <Alert tone="danger" title="Periksa kembali isian">
                    {errorCount} kolom perlu diperbaiki sebelum pesan bisa dikirim.
                  </Alert>
                ) : null}

                {submitError ? (
                  <Alert tone="danger" title="Pesan belum terkirim">
                    {submitError}
                  </Alert>
                ) : null}

                <FormField
                  id="contact-name"
                  label="Nama"
                  required
                  error={errors.name}
                  hint={`${CONTACT_LIMITS.nameMin}–${CONTACT_LIMITS.nameMax} karakter.`}
                >
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    autoComplete="name"
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  id="contact-email"
                  label="Email"
                  required
                  error={errors.email}
                  hint="Dipakai hanya untuk membalas pesan demo ini."
                >
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
                  id="contact-subject"
                  label="Subjek"
                  required
                  error={errors.subject}
                  hint={`${CONTACT_LIMITS.subjectMin}–${CONTACT_LIMITS.subjectMax} karakter.`}
                >
                  <Input
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={() => handleBlur('subject')}
                    disabled={submitting}
                  />
                </FormField>

                <FormField
                  id="contact-message"
                  label="Pesan"
                  required
                  error={errors.message}
                  hint={`${values.message.trim().length}/${CONTACT_LIMITS.messageMax} karakter.`}
                >
                  <Textarea
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur('message')}
                    rows={6}
                    disabled={submitting}
                  />
                </FormField>

                <div className="flex flex-col gap-2">
                  <Checkbox
                    id="contact-consent"
                    name="consent"
                    label="Saya setuju pesan ini disimpan"
                    description="Pesan hanya disimpan di kotak masuk demo, bukan dikirim ke layanan email."
                    checked={values.consent}
                    onChange={handleConsent}
                    onBlur={() => handleBlur('consent')}
                    invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
                    disabled={submitting}
                  />
                  {errors.consent ? (
                    <p
                      id="contact-consent-error"
                      role="alert"
                      className="text-small font-bold text-danger"
                    >
                      {errors.consent}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Button type="submit" loading={submitting} disabled={submitting}>
                    Kirim pesan
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        <aside aria-label="Informasi kontak" className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-brown"
            >
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="text-h3 text-brown">Kotak masuk demo</h2>
            <p className="text-body text-muted">
              Pesan yang dikirim lewat formulir ini masuk ke kotak masuk pengelola pada data demo.
              Tidak ada alamat, telepon, atau email resmi yang dipublikasikan.
            </p>
          </Card>

          <Card className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-brown"
            >
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-h3 text-brown">Data yang dikirim</h2>
            <p className="text-body text-muted">
              Hanya nama, email, subjek, dan pesan yang kamu isi. Data tersimpan di penyimpanan
              lokal browser dan dapat dihapus lewat reset data demo.
            </p>
            <Link
              to="/tentang"
              className="text-small font-bold text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Baca tentang Resep Ibu
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
