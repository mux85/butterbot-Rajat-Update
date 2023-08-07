/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "googleusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "cdn.openai.com"
    ],
  },
  eslint: {
    // This allows production builds to complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
