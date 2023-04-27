/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
      {
        source: '/areas',
        destination: '/select/areas',
      },
      {
        source: '/branches',
        destination: '/select/branches',
      },
      {
        source: '/schedule',
        destination: '/select/schedule',
      },
      {
        source: '/about',
        destination: '/vendor/info',
      },
    ];
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
