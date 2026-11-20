/// <reference types="node" />

import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { seedCategories } from '@/mocks/categories'
import { seedTeam } from '@/mocks/content'
import { seedRecipes } from '@/mocks/recipes'
import { seedUsers } from '@/mocks/users'

const PUBLIC_DIR = join(process.cwd(), 'public')

function readMedia(path: string): Buffer {
  const file = join(PUBLIC_DIR, path.replace(/^\//, ''))
  expect(existsSync(file), `Aset hilang: ${path}`).toBe(true)
  return readFileSync(file)
}

function expectWebp(path: string, maxKb: number) {
  const file = join(PUBLIC_DIR, path.replace(/^\//, ''))
  const buffer = readMedia(path)

  expect(buffer.subarray(0, 4).toString('ascii'), `${path} bukan WebP`).toBe('RIFF')
  expect(buffer.subarray(8, 12).toString('ascii'), `${path} bukan WebP`).toBe('WEBP')
  expect(statSync(file).size, `${path} melebihi ${maxKb} KB`).toBeLessThanOrEqual(maxKb * 1024)
}

describe('aset media', () => {
  it('menyediakan gambar untuk seluruh resep dengan ukuran kartu di bawah 120 KB', () => {
    for (const recipe of seedRecipes) {
      expect(recipe.image).toMatch(/^\/media\/recipes\/[a-z0-9-]+\.webp$/)
      expectWebp(recipe.image, 120)
    }
  })

  it('menyediakan tile kategori 400x400 di bawah 40 KB', () => {
    for (const category of seedCategories) {
      expect(category.image).toMatch(/^\/media\/categories\/[a-z0-9-]+\.webp$/)
      expectWebp(category.image, 40)
    }
  })

  it('menyediakan avatar default untuk pengguna dan tim', () => {
    const avatars = new Set([
      ...seedUsers.map((user) => user.avatar),
      ...seedTeam.map((member) => member.avatar),
    ])

    for (const avatar of avatars) {
      expectWebp(avatar, 60)
    }
  })

  it('menyediakan aset brand dan preset avatar', () => {
    for (const path of [
      '/media/brand/logo.png',
      '/media/brand/logo-small.png',
      '/media/brand/bowl-motif.webp',
      '/media/avatars/preset-1.webp',
      '/media/avatars/preset-2.webp',
      '/media/avatars/preset-3.webp',
    ]) {
      expect(existsSync(join(PUBLIC_DIR, path.replace(/^\//, ''))), path).toBe(true)
    }
  })
})
