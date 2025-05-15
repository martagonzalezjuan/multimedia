// Service Worker para 7 Maravillas de Mallorca
const CACHE_NAME = 'mallorca-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/bootstrap.css',
  '/css/accessibility.css',
  '/js/main.js',
  '/libs/maravillas_api.js',
  '/libs/geo_api.js',
  '/libs/forecast_api.js',
  '/libs/lector_api.js',
  '/components/maravilla_component.js',
  '/components/estrellas_component.js',
  '/components/lector_component.js',
  '/mallorca.svg',
  '/JSONs/maravillas.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar el Service Worker y limpiar caches antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia cache-first para recursos estáticos y network-first para API
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si existe en caché, devolver desde caché
        if (response) {
          return response;
        }
        
        // Clonar la solicitud ya que solo se puede usar una vez
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Verificar si es válido
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta ya que el cuerpo solo puede ser leído una vez
          const responseToCache = response.clone();
            // No cachear solicitudes API dinámicas ni esquemas no soportados
          if (!event.request.url.includes('/api/') && 
              !event.request.url.includes('forecast') &&
              !event.request.url.includes('php/') &&
              !event.request.url.startsWith('chrome-extension:') &&
              event.request.url.startsWith('http')) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          
          return response;
        });
      })
  );
});
