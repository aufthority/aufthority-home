/* Golden Years explainer: offline cache. Bump VERSION whenever index.html or media change. */
const VERSION = 'gy-v2';
const CORE = [
  './', './index.html', './manifest.webmanifest',
  'media/icon-192.png', 'media/icon-512.png', 'media/apple-touch-icon.png',
  'media/myubat.webp', 'media/quest.webp', 'media/mal.webp', 'media/conserf.webp',
  'media/moves.jpg', 'media/weights.jpg', 'media/squats.jpg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Videos stream with range requests: always from the network.
  if (/\.(mp4|webm)$/.test(url.pathname)) return;
  // Google Fonts: cache-first.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(VERSION).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return; // analytics etc. untouched
  // Same-origin: serve cache instantly, refresh in the background.
  e.respondWith(caches.open(VERSION).then(c => c.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
