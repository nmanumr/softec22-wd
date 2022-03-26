/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*/',
      },
      {
        source: '/news/thisweek',
        destination: 'https://nfs.faireconomy.media/ff_calendar_thisweek.json',
      },
    ];
  },
}
