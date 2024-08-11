import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Doimage",
      link: [
        // <link rel="stylesheet" href="https://myawesome-lib.css">
        {
          rel: "icon",
          href: "https://images.oldmoon.top/images/dingdangdog/dingdangdog1679378444620.png",
        },
      ],
    },
  },
  ssr: true,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  $development: {},
  $production: {},
  css: ["~/assets/css/base.css"],
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: "123",
    // Keys within public are also exposed client-side
    public: {
      apiBase: "/api",
    },
  },
  modules: [
    "@nuxtjs/i18n",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  // imports: {
  //   autoImport: true,
  // },
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "zh",
        name: "简体中文",
      },
    ],
    vueI18n: "./i18n.config.ts",
    // By default, Nuxt i18n module attempts to redirect users to their preferred language by detecting their browser's language. This is controlled by the detectBrowserLanguage option.
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
