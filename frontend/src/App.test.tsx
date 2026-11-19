import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '@/App'

describe('App', () => {
  it('merender heading scaffold', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /frontend scaffold siap/i })).toBeInTheDocument()
  })
})
