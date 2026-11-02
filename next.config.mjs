// Old WordPress-era URLs → closest new page (301), so existing rankings carry over.
const legacy = {
  "best-gpu-for-ryzen-5-2600-and-3600": "/best-gpu-for-ryzen-5-2600/",
  "best-gpu-for-ryzen-9-3900x-and-3950x": "/best-gpu-for-ryzen-9-3900x/",
  "best-graphics-card-under-100": "/",
  "best-cpu-cooler-for-ryzen-9-3900x-and-3950x": "/",
  "best-power-supply-psu-for-ryzen-5-2600-and-3600": "/best-gpu-for-ryzen-5-2600/",
  "best-psu-for-rtx-2080-and-2080-ti": "/",
  "best-psu-for-ryzen-9-3900x-and-3950x": "/best-gpu-for-ryzen-9-3900x/",
  "best-psu-for-ryzen-7-2700x-and-3700x": "/best-gpu-for-ryzen-7-2700x/",
  "best-psu-under-100": "/",
  "best-pc-cases-under-50": "/",
  "best-pc-cases-for-ryzen-3000-series": "/best-gpu-for-ryzen-5-3600/",
  "best-ram-for-ryzen-9-3900x-and-3950x": "/best-gpu-for-ryzen-9-3900x/",
  "best-motherboard-for-ryzen-9-3950x": "/best-gpu-for-ryzen-9-3900x/",
  "how-to-overclock-a-gpu": "/",
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
