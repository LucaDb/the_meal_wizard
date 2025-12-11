import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@sections': '/src/sections',
      '@context': '/src/context',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@api': '/src/api',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '/src/styles/mixins' as *;\n`,
      },
    },
  },
})
