import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.enthusiastreview.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
});
