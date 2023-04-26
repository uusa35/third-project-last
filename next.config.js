/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  env: {
    SECRET_APP_KEY: "@#8!U.S.A.M.A.!@)8231",
    NEXT_PUBLIC_URL: "/",
    PUBLIC_URL: "/",
  },
  images: {
    domains: [
      "testbedbynd.com",
      "pages-dash.testbedbynd.com",
      "queue-spaces.nyc3.digitaloceanspaces.com",
    ],
    // minimumCacheTTL: 60 * 60 * 24,
    minimumCacheTTL: 0,
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // disableStaticImages: false,
  },
};

module.exports = nextConfig;
