const CACHE_NAME = 'Lubricenter';
const urlsToCache = [
  '/',
  '/img/background.png',
  '/img/fondo.png',
  '/img/fondoa.jpg',
  '/img/logo.png',
  '/img/personal.png',
  '/img/producto.jpeg',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Caché abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(function(error) {
          console.error('Error en la solicitud:', error);
       
        });
      })
  );
});
