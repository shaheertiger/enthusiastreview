// Relative performance tiers and power figures used by the calculators in /tools/.
//
// game: relative gaming performance. CPUs: 1080p CPU-bound average, Ryzen 7 9800X3D = 100.
//       GPUs: raster performance, RTX 5090 = 100. These are editorial estimates drawn from the
//       broad pattern of published independent reviews, rounded to tiers. They are not our own
//       benchmarks, and the tools say so.
// watts: CPUs: the package power limit at stock (AMD PPT, Intel max turbo power).
//        GPUs: rated total board power.
// id: the product page on this site, when we track the part.

export interface CpuRow { name: string; game: number; watts: number; platform: string; id?: string }
export interface GpuRow { name: string; game: number; watts: number; id?: string }

export const CPUS: CpuRow[] = [
  { name: 'AMD Ryzen 7 9800X3D', game: 100, watts: 162, platform: 'AM5', id: 'ryzen-7-9800x3d' },
  { name: 'AMD Ryzen 9 9950X3D', game: 98, watts: 230, platform: 'AM5', id: 'ryzen-9-9950x3d' },
  { name: 'AMD Ryzen 7 7800X3D', game: 88, watts: 162, platform: 'AM5', id: 'ryzen-7-7800x3d' },
  { name: 'Intel Core i9-14900K', game: 82, watts: 253, platform: 'LGA 1700' },
  { name: 'Intel Core Ultra 9 285K', game: 80, watts: 250, platform: 'LGA 1851' },
  { name: 'Intel Core i7-14700K', game: 80, watts: 253, platform: 'LGA 1700' },
  { name: 'AMD Ryzen 7 9700X', game: 78, watts: 88, platform: 'AM5', id: 'ryzen-7-9700x' },
  { name: 'Intel Core Ultra 7 265K', game: 77, watts: 250, platform: 'LGA 1851', id: 'core-ultra-7-265k' },
  { name: 'Intel Core i5-14600K', game: 76, watts: 181, platform: 'LGA 1700' },
  { name: 'AMD Ryzen 5 9600X', game: 75, watts: 88, platform: 'AM5', id: 'ryzen-5-9600x' },
  { name: 'AMD Ryzen 5 9600', game: 73, watts: 88, platform: 'AM5', id: 'ryzen-5-9600' },
  { name: 'AMD Ryzen 7 7700X', game: 74, watts: 142, platform: 'AM5' },
  { name: 'Intel Core Ultra 5 245K', game: 72, watts: 159, platform: 'LGA 1851', id: 'core-ultra-5-245k' },
  { name: 'AMD Ryzen 7 5800X3D', game: 72, watts: 142, platform: 'AM4' },
  { name: 'AMD Ryzen 5 7600X', game: 71, watts: 142, platform: 'AM5' },
  { name: 'AMD Ryzen 5 7600', game: 69, watts: 88, platform: 'AM5', id: 'ryzen-5-7600' },
  { name: 'AMD Ryzen 7 5700X3D', game: 68, watts: 142, platform: 'AM4', id: 'ryzen-7-5700x3d' },
  { name: 'Intel Core i5-13400F', game: 64, watts: 148, platform: 'LGA 1700' },
  { name: 'Intel Core i5-12400F', game: 60, watts: 117, platform: 'LGA 1700' },
  { name: 'AMD Ryzen 7 5800X', game: 58, watts: 142, platform: 'AM4' },
  { name: 'AMD Ryzen 5 5600X', game: 55, watts: 88, platform: 'AM4' },
  { name: 'Intel Core i7-10700K', game: 54, watts: 229, platform: 'LGA 1200' },
  { name: 'AMD Ryzen 5 5600', game: 53, watts: 88, platform: 'AM4' },
  { name: 'Intel Core i7-9700K', game: 50, watts: 150, platform: 'LGA 1151' },
  { name: 'Intel Core i5-11400F', game: 50, watts: 154, platform: 'LGA 1200' },
  { name: 'AMD Ryzen 9 3950X', game: 48, watts: 142, platform: 'AM4' },
  { name: 'AMD Ryzen 9 3900X', game: 47, watts: 142, platform: 'AM4' },
  { name: 'Intel Core i7-8700K', game: 47, watts: 130, platform: 'LGA 1151' },
  { name: 'Intel Core i5-10400F', game: 46, watts: 134, platform: 'LGA 1200' },
  { name: 'AMD Ryzen 7 3700X', game: 45, watts: 88, platform: 'AM4' },
  { name: 'Intel Core i5-9600K', game: 45, watts: 125, platform: 'LGA 1151' },
  { name: 'AMD Ryzen 5 3600', game: 43, watts: 88, platform: 'AM4' },
  { name: 'AMD Ryzen 7 2700X', game: 37, watts: 142, platform: 'AM4' },
  { name: 'AMD Ryzen 5 2600', game: 35, watts: 88, platform: 'AM4' },
];

export const GPUS: GpuRow[] = [
  { name: 'NVIDIA GeForce RTX 5090', game: 100, watts: 575, id: 'rtx-5090' },
  { name: 'NVIDIA GeForce RTX 4090', game: 77, watts: 450 },
  { name: 'NVIDIA GeForce RTX 5080', game: 66, watts: 360, id: 'rtx-5080' },
  { name: 'NVIDIA GeForce RTX 4080 Super', game: 60, watts: 320 },
  { name: 'AMD Radeon RX 7900 XTX', game: 60, watts: 355 },
  { name: 'NVIDIA GeForce RTX 5070 Ti', game: 56, watts: 300, id: 'rtx-5070-ti' },
  { name: 'AMD Radeon RX 9070 XT', game: 55, watts: 304, id: 'rx-9070-xt' },
  { name: 'NVIDIA GeForce RTX 4070 Ti Super', game: 50, watts: 285 },
  { name: 'AMD Radeon RX 9070', game: 49, watts: 220, id: 'rx-9070' },
  { name: 'NVIDIA GeForce RTX 5070', game: 45, watts: 250, id: 'rtx-5070' },
  { name: 'NVIDIA GeForce RTX 4070 Super', game: 44, watts: 220 },
  { name: 'AMD Radeon RX 7800 XT', game: 41, watts: 263 },
  { name: 'NVIDIA GeForce RTX 4070', game: 38, watts: 200 },
  { name: 'NVIDIA GeForce RTX 5060 Ti 16GB', game: 33, watts: 180, id: 'rtx-5060-ti-16gb' },
  { name: 'AMD Radeon RX 9060 XT 16GB', game: 32, watts: 180, id: 'rx-9060-xt-16gb' },
  { name: 'NVIDIA GeForce RTX 5060 Ti 8GB', game: 31, watts: 180, id: 'rtx-5060-ti-8gb' },
  { name: 'AMD Radeon RX 9060 XT 8GB', game: 30, watts: 150, id: 'rx-9060-xt-8gb' },
  { name: 'NVIDIA GeForce RTX 2080 Ti', game: 30, watts: 250 },
  { name: 'NVIDIA GeForce RTX 3070', game: 30, watts: 220 },
  { name: 'NVIDIA GeForce RTX 5060', game: 28, watts: 145, id: 'rtx-5060' },
  { name: 'Intel Arc B580', game: 27, watts: 190, id: 'arc-b580' },
  { name: 'NVIDIA GeForce RTX 4060 Ti', game: 27, watts: 160 },
  { name: 'NVIDIA GeForce RTX 2080', game: 24, watts: 215 },
  { name: 'NVIDIA GeForce RTX 4060', game: 23, watts: 115 },
  { name: 'AMD Radeon RX 7600', game: 22, watts: 165 },
  { name: 'NVIDIA GeForce RTX 2070 Super', game: 22, watts: 215 },
  { name: 'NVIDIA GeForce GTX 1080 Ti', game: 21, watts: 250 },
  { name: 'NVIDIA GeForce RTX 3060 12GB', game: 20, watts: 170 },
  { name: 'AMD Radeon RX 6600', game: 18, watts: 132 },
  { name: 'NVIDIA GeForce RTX 2060', game: 16, watts: 160 },
  { name: 'NVIDIA GeForce GTX 1070', game: 13, watts: 150 },
  { name: 'NVIDIA GeForce GTX 1660 Super', game: 12, watts: 125 },
  { name: 'AMD Radeon RX 580', game: 9, watts: 185 },
];
