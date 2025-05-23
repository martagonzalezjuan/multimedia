// Lazy loading para mapas y contenido pesado
document.addEventListener('DOMContentLoaded', function() {
  // Función para verificar si un elemento está en el viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // IntersectionObserver para detectar cuando los elementos entran en el viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const mapContainer = entry.target.querySelector('.map-container');
        if (mapContainer) {
          const lat = parseFloat(mapContainer.dataset.lat);
          const lon = parseFloat(mapContainer.dataset.lon);
          const name = mapContainer.dataset.name;
          
          // Cargar el mapa solo cuando sea visible
          crearMapa(mapContainer, lat, lon, name, true);
          
          // Dejar de observar una vez que se ha cargado el mapa
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% visible
  });

  // Observar todos los contenedores de mapas
  document.querySelectorAll('.lazy-load-map').forEach(map => {
    observer.observe(map);
  });
});
