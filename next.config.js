/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  cleanDistDir: 'cleanOut',
  distDir: 'out'
}

module.exports = removeImports(nextConfig); 