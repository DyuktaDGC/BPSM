import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssTarget: 'chrome90',
    sourcemap: false,
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('/node_modules/')) {
            if (id.includes('gsap') || id.includes('lenis')) return 'motion';
            if (id.includes('posthog')) return 'analytics';
            return 'vendor';
          }
        },
      },
    },
  },
})
