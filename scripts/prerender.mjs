import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

async function findJavaScriptFile(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const nested = await findJavaScriptFile(full)
      if (nested) return nested
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      return full
    }
  }
  return null
}

const ssrDir = path.resolve('.ssr')
const entry = await findJavaScriptFile(ssrDir)
if (!entry) throw new Error('SSR bundle not found in .ssr')

const { render } = await import(pathToFileURL(entry).href)
if (typeof render !== 'function') throw new Error('SSR bundle does not export render()')

const indexPath = path.resolve('dist/index.html')
let html = await readFile(indexPath, 'utf8')
const marker = '<div id="root"></div>'
if (!html.includes(marker)) throw new Error('Expected empty #root marker was not found in dist/index.html')

html = html.replace(marker, `<div id="root">${render()}</div>`)
await writeFile(indexPath, html, 'utf8')
await rm(ssrDir, { recursive: true, force: true })

console.log('Prerendered portfolio markup into dist/index.html')
