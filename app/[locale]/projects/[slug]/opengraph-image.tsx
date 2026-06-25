import { ImageResponse } from 'next/og'
import { projects } from '@/.velite'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  // Fallback when slug not found
  const title = project?.title ?? 'Project'
  const summary = project?.summary ?? 'A project by Denfry'
  const tags = project?.tags ?? []

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
          marginBottom: 32,
        }}
      />

      {/* Author hint */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: '#3FB950',
          marginBottom: 20,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        Denfry
      </div>

      {/* Project title */}
      <div
        style={{
          fontSize: title.length > 40 ? 52 : 68,
          fontWeight: 800,
          color: '#f0f6fc',
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          marginBottom: 24,
          maxWidth: 900,
        }}
      >
        {title}
      </div>

      {/* Summary */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: '#8b949e',
          lineHeight: 1.5,
          maxWidth: 820,
          marginBottom: tags.length > 0 ? 36 : 0,
        }}
      >
        {summary.length > 120 ? `${summary.slice(0, 120)}…` : summary}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {tags.slice(0, 6).map((tag) => (
            <div
              key={tag}
              style={{
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 18,
                color: '#8b949e',
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

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
