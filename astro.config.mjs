import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lianksan.github.io',
  base: '/me',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
