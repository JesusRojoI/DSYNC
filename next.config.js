/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'flagcdn.com'],
  },
  env: {
    KEYCOP_EMAIL: process.env.KEYCOP_EMAIL,
    KEYCOP_PASSWORD: process.env.KEYCOP_PASSWORD,
    KEYCOP_API_URL: process.env.KEYCOP_API_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  },
}

module.exports = nextConfig