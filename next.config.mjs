// Old GPU URLs → matching new page (permanent redirect) so their rankings carry over.
// Old non-GPU pages (PSU, cases, RAM, …) were deleted and answer 410 Gone (see middleware.ts).
const legacy = {
  "best-gpu-for-ryzen-5-2600-and-3600": "/best-gpu-for-ryzen-5-2600/",
  "best-gpu-for-ryzen-9-3900x-and-3950x": "/best-gpu-for-ryzen-9-3900x/",
  "best-graphics-card-under-100": "/",
  "gpu-bottleneck-calculator": "/",
  "bottleneck-calculator": "/",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return Object.entries(legacy).map(([from, to]) => ({ source: `/${from}`, destination: to, permanent: true }));
  },
};

export default nextConfig;
