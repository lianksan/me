// Prefixes an absolute site path with the configured base (e.g. '/me'),
// so links and assets resolve correctly when deployed under a subpath.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string): string =>
  BASE + (path.startsWith('/') ? path : `/${path}`);
