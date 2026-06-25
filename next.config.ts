import path from 'node:path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

// Convert Windows backslashes to forward slashes for Turbopack compatibility
const velitePath = path
  .join(process.cwd(), '.velite/index.js')
  .replace(/\\/g, '/')

const nextConfig = {
  // Pin the tracing root to this package so Next.js doesn't walk up to the
  // parent repo's package-lock.json and emit a "workspace root" warning.
  outputFileTracingRoot: path.join(process.cwd()),
  turbopack: {
    resolveAlias: {
      '@/.velite': velitePath,
    },
  },
  webpack(config: { resolve: { alias: Record<string, string> } }) {
    config.resolve.alias['@/.velite'] = velitePath
    return config
  },
}

export default withNextIntl(nextConfig)
