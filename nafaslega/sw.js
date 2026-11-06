/* NafasLega service worker
   - Page: network-first, so every deploy shows up immediately; falls back
     to the cached copy when offline.
   - App files (icons, manifest): cached at install.
   - Rain audio: cached the first time a session plays it (not at install,
     so visitors who never press Begin don't download it).
   - Google Fonts: stale-while-revalidate, so text looks right offline.
   Bump VERSION whenever this file's caching rules change. */

const VERSION    = 'nafaslega-v1';
const FONT_CACHE = 'nafaslega-fonts';
const SCOPE      = self.registration.scope;              // https://…/nafaslega/
const PAGE_KEY   = new URL('./', SCOPE).href;

const PRECACHE = [
  './',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-96.png',
  './icons/icon.svg'
].map(p => new URL(p, SCOPE).href);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('nafaslega-') && k !== VERSION && k !== FONT_CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

async function pageNetworkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const res = await Promise.race([fetch(request), timeout(5000)]);
    if (res && res.ok) cache.put(PAGE_KEY, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(PAGE_KEY)) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok && res.status === 200) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(FONT_CACHE);
  const hit = await cache.match(request);
  const net = fetch(request)
    .then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone()); return res; })
    .catch(() => hit);
  return hit || net;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The app page itself (any query string, e.g. ?source=pwa or ?mode=box)
  if (req.mode === 'navigate' && url.href.startsWith(SCOPE)) {
    event.respondWith(pageNetworkFirst(req));
    return;
  }
  // App files under /nafaslega/
  if (url.href.startsWith(SCOPE)) {
    event.respondWith(cacheFirst(req));
    return;
  }
  // Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req));
  }
  // Everything else (analytics, the main site) goes straight to the network.
});
