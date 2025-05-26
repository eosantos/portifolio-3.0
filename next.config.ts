/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  compiler: {
    styledComponents: true // se estiver usando styled-components
  }
};

module.exports = nextConfig;
