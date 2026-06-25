import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const title = t('title')
  const description = t('description')
  const canonical = `${SITE_URL}/${locale}`

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en`,
        ru: `${SITE_URL}/ru`,
      },
    },
    openGraph: {
      title,
      description,
      locale,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return (
    <NextIntlClientProvider>
      <SmoothScroll>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </SmoothScroll>
    </NextIntlClientProvider>
  )
}
