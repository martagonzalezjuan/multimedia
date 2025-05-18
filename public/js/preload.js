// Precarga de recursos críticos
document.addEventListener('DOMContentLoaded', function() {
  // Lista de recursos a precargar
  const resources = [
    { url: '/mallorca.svg', as: 'image' },
    { url: '/JSONs/maravillas.json', as: 'fetch' },
    { url: '/castilloBellver/bellver1.webp', as: 'image' },
    { url: '/saCalobra/calobra1.webp', as: 'image' },
    { url: '/saForadada/foradada1.webp', as: 'image' },
    { url: '/catedralPalma/catedral1.webp', as: 'image' },
    { url: '/covesDrach/drach1.webp', as: 'image' },
    { url: '/santuarioCura/cura1.webp', as: 'image' },
    // Recursos para Leaflet
    { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', as: 'script' },
    { url: 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js', as: 'script' }
  ];
  
  // Función para precargar recursos
  function preloadResource(resource) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.url;
      link.as = resource.as;
      
      if (resource.as === 'image') {
        link.type = 'image/' + resource.url.split('.').pop();
      }
      
      link.onload = resolve;
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }
  
  // Precargar recursos en segundo plano
  Promise.all(resources.map(resource => {
    return preloadResource(resource)
      .catch(error => console.warn('Error precargando recurso:', resource.url, error));
  }))
  .then(() => console.log('Precarga completada'))
  .catch(error => console.warn('Error en precarga:', error));
});
