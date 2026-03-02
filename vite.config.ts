import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404',
      closeBundle() {
        copyFileSync(join(process.cwd(), 'dist/index.html'), join(process.cwd(), 'dist/404.html'))
      },
    },
  ],
  // Для GitHub Pages: base = '/имя-репо/' (напр. /Dad/)
  base: process.env.VITE_BASE_PATH || '/',
})
