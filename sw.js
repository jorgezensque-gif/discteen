const cacheName = 'discteen-v1';

const assets = [
  './',
  './index.html',
  './logo.png',
  './manifest.json'
];

// Instala o Service Worker e guarda os arquivos essenciais no cache do celular
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Ativa o novo SW imediatamente, sem esperar a aba ser fechada
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== cacheName)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Faz o app carregar instantaneamente usando o cache, mesmo se o sinal estiver ruim
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
