/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'flagcdn.com'],
  },
  env: {
    PORT: process.env.PORT || '3026',
    OCTANO_BASE_URL: process.env.OCTANO_BASE_URL,
    OCTANO_EMAIL: process.env.OCTANO_EMAIL,
    OCTANO_PASSWORD: process.env.OCTANO_PASSWORD,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
}

module.exports = nextConfig