import { createContext, useContext } from 'react'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
  /** Milidetik sebelum toast hilang otomatis. Default 5000. */
  duration?: number
  action?: ToastAction
}

export interface ToastContextValue {
  toast: (input: ToastInput) => string
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return context
}
