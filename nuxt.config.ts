// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'dayjs-nuxt'],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  // Pure client-side tool app: prerender every page to static assets
  // so Cloudflare serves it from the edge with no Worker/server runtime.
  nitro: {
    preset: 'cloudflare-pages-static',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
