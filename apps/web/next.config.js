/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'logic', 'config'],
  eslint: {
    dirs: ['app', 'components', 'lib', 'utils'],
  },
}

module.exports = nextConfig