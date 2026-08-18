import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Client routes that must work on hard refresh / QR open */
const SPA_ROUTES = [
  'admin-san',
  'grievances',
  'raise',
  'status',
  'ack',
  ...Array.from({ length: 11 }, (_, i) => `street-${i + 1}`),
  ...Array.from({ length: 11 }, (_, i) => `street/${i + 1}`),
]

/**
 * Copy index.html into each route folder so Vercel can serve
 * /street-3 from dist/street-3/index.html (no dependency on rewrites alone).
 */
function spaHtmlFallback() {
  return {
    name: 'spa-html-fallback',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist')
      const indexHtml = resolve(outDir, 'index.html')
      if (!existsSync(indexHtml)) return

      for (const route of SPA_ROUTES) {
        const target = resolve(outDir, route, 'index.html')
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(indexHtml, target)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaHtmlFallback()],
})
