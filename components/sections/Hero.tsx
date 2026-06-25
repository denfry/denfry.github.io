import { useTranslations } from 'next-intl'
import { VoxelCanvas } from '@/components/three/VoxelCanvas'
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
      {/* 3D voxel canvas layer — pointer-events-none and aria-hidden, sits behind content */}
      <div
        data-voxel-mount
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <VoxelCanvas />
      </div>

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
