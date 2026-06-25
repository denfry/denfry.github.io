import { useTranslations } from 'next-intl'
import { buttonVariants } from '@/components/ui/button'
import { CONTACTS } from '@/lib/contacts'
import { cn } from '@/lib/utils'

export function Hero() {
  const t = useTranslations('hero')

  return (
    <section
      data-hero
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Background placeholder layer — Task 18 will mount the voxel canvas here */}
      <div
        data-voxel-mount
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.72 0.19 145 / 0.08) 0%, transparent 70%), linear-gradient(160deg, oklch(0.16 0.01 260) 0%, oklch(0.12 0.02 240) 100%)',
        }}
      />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-7xl">
          <span className="text-brand">Denfry</span>
          <span className="mx-4 text-muted-foreground/40">—</span>
          <span className="text-foreground">{t('role')}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-prose text-lg text-muted-foreground">
          {t('lead')}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CONTACTS.orderTelegram}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-brand text-brand-foreground hover:bg-brand hover:opacity-90 border-transparent',
            )}
          >
            {t('cta')}
          </a>
          <a
            href="#projects"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            {t('see')}
          </a>
        </div>
      </div>
    </section>
  )
}
