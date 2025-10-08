const CACHE_NAME = 'calculadora-v2';
const urlsToCache = [
    // Usamos rutas absolutas para GitHub Pages
    '/Calculadora/',             
    '/Calculadora/index.html',
    '/Calculadora/style.css',
    '/Calculadora/script.js',
    '/Calculadora/manifest.json',
    '/Calculadora/icons/calculadora-icon-192.png', 
    '/Calculadora/icons/calculadora-icon-512.png'
];

self.addEventListener('install', event => {
  // Guarda todos los archivos esenciales en la caché
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta: Archivos estáticos almacenados.');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Fallo al precachear archivos:', err))
  );
});

self.addEventListener('fetch', event => {
  // Intenta servir los recursos desde la caché antes de ir a la red
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el recurso cacheado o lo busca en la red si no está
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  // Limpia cachés viejas para actualizar la PWA
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Eliminando caché vieja:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
