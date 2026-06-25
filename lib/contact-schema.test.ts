import { describe, expect, it } from 'vitest'
import { contactSchema } from './contact-schema'

describe('contactSchema', () => {
  it('rejects empty message', () => {
    expect(
      contactSchema.safeParse({ name: 'a', contact: 'b', message: '' }).success,
    ).toBe(false)
  })
  it('accepts valid input', () => {
    expect(
      contactSchema.safeParse({
        name: 'a',
        contact: 'b@c.d',
        message: 'hello there',
      }).success,
    ).toBe(true)
  })
})
