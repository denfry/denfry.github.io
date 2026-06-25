'use client'

import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { sendContact } from '@/app/[locale]/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const initialState = { ok: false }

export function ContactForm() {
  const t = useTranslations('contact')
  const [state, action, pending] = useActionState(sendContact, initialState)

  useEffect(() => {
    if (state === initialState) return
    if (state.ok) {
      toast.success(t('sent'))
    } else {
      toast.error(t('error'))
    }
  }, [state, t])

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      {/* Honeypot field — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-name"
          className="text-sm font-medium text-foreground"
        >
          {t('name')}
        </label>
        <Input
          id="cf-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={t('name')}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-contact"
          className="text-sm font-medium text-foreground"
        >
          {t('contact')}
        </label>
        <Input
          id="cf-contact"
          name="contact"
          type="text"
          required
          autoComplete="email"
          placeholder={t('contact')}
          className="h-10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-message"
          className="text-sm font-medium text-foreground"
        >
          {t('message')}
        </label>
        <Textarea
          id="cf-message"
          name="message"
          required
          minLength={5}
          rows={5}
          placeholder={t('message')}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        size="lg"
        className="bg-brand text-brand-foreground hover:bg-brand hover:opacity-90 border-transparent w-full"
      >
        {pending ? '…' : t('send')}
      </Button>
    </form>
  )
}
