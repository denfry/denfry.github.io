import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const out = path.resolve('public/og.png')
await mkdir(path.dirname(out), { recursive: true })

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#243140" stroke-width="1" opacity="0.42"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#090D14"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.34"/>
  <circle cx="1040" cy="116" r="220" fill="#5CC8FF" opacity="0.045"/>
  <path d="M78 76V554M78 420H1122" stroke="#334252" stroke-width="1"/>
  <rect x="78" y="76" width="70" height="70" fill="#121B26" stroke="#5CC8FF" stroke-width="1"/>
  <text x="113" y="121" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="800" fill="#F3F6FA">DY</text>
  <text x="78" y="220" font-family="Inter, Arial, sans-serif" font-size="66" font-weight="800" fill="#F3F6FA">Данила Юрков</text>
  <text x="78" y="292" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="700" fill="#5CC8FF">Backend / Python / AI Developer</text>
  <text x="78" y="366" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="500" fill="#C0C9D5">API · PostgreSQL · Go · TypeScript · MCP · RAG · Docker</text>
  <text x="78" y="486" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="600" fill="#F3F6FA">Open-source AI tooling · event-driven backend · production fullstack</text>
  <text x="78" y="548" font-family="JetBrains Mono, Consolas, monospace" font-size="22" font-weight="500" fill="#8D98A8">Москва · denfry.github.io</text>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out)
console.log(`Generated ${out} (1200x630)`)
