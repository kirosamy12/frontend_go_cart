/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://go-cart-1bwm.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
