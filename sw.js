const CACHE_NAME = 'amt-exam-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './auth.js',
  './app.js',
  './manifest.json',
  './public/data/exams-data.js',
  './public/data/notes-data.js',
  './public/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Return offline fallback if network fails
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
