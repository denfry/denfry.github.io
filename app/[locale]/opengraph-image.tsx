import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Per-locale role strings — keeps the image on-brand without a font loader
const roleByLocale: Record<string, string> = {
  en: 'Java developer',
  ru: 'Java-разработчик',
}

const taglineByLocale: Record<string, string> = {
  en: 'Minecraft systems · open-source tooling for AI agents',
  ru: 'Системы Minecraft · open-source инструменты для AI-агентов',
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const role = roleByLocale[locale] ?? roleByLocale.en
  const tagline = taglineByLocale[locale] ?? taglineByLocale.en

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#0d1117',
        padding: '72px 80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Brand accent bar */}
      <div
        style={{
          width: 56,
          height: 6,
          background: '#3FB950',
          borderRadius: 3,
          marginBottom: 36,
        }}
      />

      {/* Name */}
      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          color: '#f0f6fc',
          letterSpacing: '-2px',
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        Denfry
      </div>

      {/* Role */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 600,
          color: '#3FB950',
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}
      >
        {role}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: '#8b949e',
          letterSpacing: '-0.2px',
          maxWidth: 800,
          lineHeight: 1.5,
        }}
      >
        {tagline}
      </div>

      {/* Bottom domain hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          right: 80,
          fontSize: 20,
          color: '#30363d',
          fontWeight: 500,
        }}
      >
        denfry.vercel.app
      </div>
    </div>,
    { ...size },
  )
}
