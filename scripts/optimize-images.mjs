import { readdir, stat, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('public/work')
const WIDTHS = [1600, 800]
const INPUT = new Set(['crystal-tower', 'lk-fd-demo', 'politernal-site', 'uk-altegra-landing'])

const files = (await readdir(SRC)).filter(
  (f) => f.endsWith('.png') && INPUT.has(f.replace(/\.png$/, '')),
)

let total = 0
for (const f of files) {
  const slug = f.replace(/\.png$/, '')
  const src = path.join(SRC, f)
  for (const w of WIDTHS) {
    const out = path.join(SRC, `${slug}-${w}.webp`)
    const buf = await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
    await mkdir(path.dirname(out), { recursive: true })
    await sharp(buf).toFile(out)
    const kb = (await stat(out)).size / 1024
    total += kb
    console.log(`${out} — ${kb.toFixed(0)} KB`)
  }
}
console.log(`Total WebP: ${total.toFixed(0)} KB`)
