import { useTranslations } from 'next-intl'
import { ContactForm } from '@/components/ContactForm'
import { buttonVariants } from '@/components/ui/button'
import { CONTACTS } from '@/lib/contacts'
import { cn } from '@/lib/utils'

export function Contact() {
  const t = useTranslations('contact')

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <div className="mx-auto max-w-xl">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h2>

        <div className="mt-8">
          <a
            href={CONTACTS.orderTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full bg-brand text-brand-foreground hover:bg-brand hover:opacity-90 border-transparent justify-center text-base',
            )}
          >
            {t('order')}
          </a>
        </div>

        <div className="relative my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
