import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lianksan.github.io',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
