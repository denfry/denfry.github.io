import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const out = path.resolve('public/og.png')
await mkdir(path.dirname(out), { recursive: true })

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#090b10"/>
      <stop offset="1" stop-color="#151a24"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7dd3fc"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" rx="0" fill="url(#bg)"/>
  <circle cx="1030" cy="115" r="235" fill="#7dd3fc" opacity="0.055"/>
  <circle cx="1100" cy="520" r="260" fill="#a78bfa" opacity="0.05"/>
  <rect x="78" y="76" width="70" height="70" rx="20" fill="#111722" stroke="#2d3748" stroke-width="2"/>
  <text x="113" y="121" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="800" fill="#f8fafc">DY</text>
  <text x="78" y="220" font-family="Inter, Arial, sans-serif" font-size="66" font-weight="800" fill="#f8fafc">Данила Юрков</text>
  <text x="78" y="292" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="700" fill="url(#accent)">Backend / Python / AI Developer</text>
  <text x="78" y="366" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="500" fill="#cbd5e1">API · PostgreSQL · Go · TypeScript · MCP · RAG · Docker</text>
  <rect x="78" y="420" width="1044" height="1" fill="#2a3342"/>
  <text x="78" y="486" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600" fill="#e2e8f0">Open-source AI tooling · event-driven backend · production fullstack</text>
  <text x="78" y="548" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="500" fill="#94a3b8">Москва · denfry.github.io</text>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out)
console.log(`Generated ${out} (1200x630)`)
