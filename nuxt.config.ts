import glsl from 'vite-plugin-glsl';

export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['@/styles/styles.scss'],
  modules: ['@nuxt/image'],

  vite: {
    plugins: [glsl()],
  },

  app: {
    head: {
      title: 'Immersive Proto',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  compatibilityDate: '2025-02-08',
});