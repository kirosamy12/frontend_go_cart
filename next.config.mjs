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
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, token',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com', 'go-cart-1bwm.vercel.app', 'localhost', '127.0.0.1'],
  },
};

export default nextConfig;
