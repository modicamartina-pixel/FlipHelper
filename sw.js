// FlipHelper service worker - cache semplice per funzionare offline
const VERSION = 'fh-v1';

// Ricava automaticamente il path base (es. "/FlipHelper/")
const BASE = new URL(self.registration.scope).pathname;
const CORE = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.webmanifest',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === VERSION ? null : caches.delete(k)))))
  );
  self.clients.claim();
});

// Strategia "cache-first con fallback rete"
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // evita di interferire con chiamate POST o di terze parti
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // metti in cache le risposte base (stessa origine)
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(BASE + 'index.html'));
    })
  );
});
