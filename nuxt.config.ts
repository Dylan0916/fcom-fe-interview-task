import path from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],
  
  alias: {
    '@': path.resolve(__dirname, './'),
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['vitest/globals']
      }
    }
  }
})
