import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { About } from '@/components/sections/About'
import { Hero } from '@/components/sections/Hero'
import { Stack } from '@/components/sections/Stack'

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
      <About />
      <Stack />
    </>
  )
}
