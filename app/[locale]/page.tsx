import { setRequestLocale } from 'next-intl/server'
import { Suspense, use } from 'react'
import { Reveal } from '@/components/Reveal'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { Hero } from '@/components/sections/Hero'
import { MoreOnGitHub } from '@/components/sections/MoreOnGitHub'
import { Stack } from '@/components/sections/Stack'

function MoreOnGitHubSkeleton() {
  return (
    <section aria-hidden className="mx-auto max-w-5xl px-6 py-24">
      <div className="h-3 w-32 rounded bg-muted animate-pulse" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
          <div key={i} className="h-28 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    </section>
  )
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)
  return (
    <>
      <Hero />
      <Reveal>
        <About />
      </Reveal>
      <Reveal delay={0.05}>
        <Stack />
      </Reveal>
      <Reveal delay={0.05}>
        <FeaturedProjects />
      </Reveal>
      <Reveal delay={0.05}>
        <Suspense fallback={<MoreOnGitHubSkeleton />}>
          <MoreOnGitHub />
        </Suspense>
      </Reveal>
      <Reveal delay={0.05}>
        <Contact />
      </Reveal>
    </>
  )
}
