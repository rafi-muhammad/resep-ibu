import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/*
 * Token tipografi kustom (text-display … text-label) tidak dikenal tailwind-merge
 * secara default sehingga dianggap warna teks dan menghapus kelas warna asli.
 * Daftarkan sebagai grup font-size agar `text-body text-muted` tetap utuh.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'h3', 'body', 'lg', 'small', 'label'] }],
    },
  },
})

/**
 * Menggabungkan className dan menyelesaikan konflik utility Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
