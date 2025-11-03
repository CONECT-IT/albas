// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-11-12",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui", "@nuxthub/core", "nuxt-auth-utils", "@nuxt/image"],
  runtimeConfig: {
    session: {
      name: "nuxt-session",
      cookie: {
        maxAge: 60 * 60 * 18, // 7 days in seconds
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
      },
    },
  },
});
