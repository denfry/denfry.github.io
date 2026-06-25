import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { Hero } from '@/components/sections/Hero'

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)
  return <Hero />
}
