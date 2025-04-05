import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config'

export default mergeConfig(
  baseConfig,
  defineConfig({
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }),
)
