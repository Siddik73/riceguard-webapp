/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true // support out-of-the-box static server serving
  }
};

module.exports = nextConfig;
