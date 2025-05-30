// filepath: c:\Users\andre\Desktop\multimedia\public\libs\geo_api.js
// Librería para obtener la ubicación del usuario usando la API de geolocalización HTML5
// Version: 0.1.0
// Fecha: 2025-03-30

 /**
 * Función para obtener la latitud y longitud del usuario.
 * @classdesc Pidemos permiso al usuario para acceder a su ubicación y obtenemos la latitud y longitud.
 * @returns {Promise<Object>} Objeto con las propiedades 'latitud' y 'longitud'
 */
async function obtenerUbicacion() {
  if (!navigator.geolocation) {
    throw new Error(
      "La API de geolocalizacion no esta soportada en este navegador."
    );
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      console.error("Error al obtener la ubicacion:", error);
      reject(new Error("Error al obtener la ubicacion: " + error.message));
    });
  });

  return {
    latitud: position.coords.latitude,
    longitud: position.coords.longitude,
  };
}


/**
 * Función para obtener la dirección a partir de la latitud y longitud.
 * @param {number} latitud - Latitud del usuario
 * @param {number} longitud - Longitud del usuario
 * @returns {Promise<string>} Dirección en formato de cadena
 */
async function obtenerDireccion(latitud, longitud) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json&addressdetails=1`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al obtener la dirección: " + response.statusText);
  }
  const data = await response.json();
  return data.display_name || "Dirección no encontrada";
}

/**
 * Función que devuelve el mapa centrado en la ubicación del usuario usando Leaflet.js
 * @classdesc Crea un mapa centrado en la ubicación del usuario. Y lo muestra en el contenedor especificado.
 * @param {string} container - Contenedor donde se mostrará el mapa
 * @param {number} latitud - Latitud del usuario
 * @param {number} longitud - Longitud del usuario
 * @param {string} nombre - Nombre de la maravilla
 * @param {boolean} comoLlegar - Si se marca como true, se mostrará la dirección de la maravilla
 * @throws {Error} Si no se puede crear el mapa
 */
async function crearMapa(container, latitud, longitud, nombre, comoLlegar) {
    if (!container) {
        throw new Error("El contenedor del mapa no está definido.");
    }
    
    const map = L.map(container).setView([latitud, longitud], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let posicionUsuario;
    try {
      posicionUsuario = await obtenerUbicacion();
    } catch (error) {
      console.error("Error al obtener la ubicacion, agregando marcador:", error);
    }

    if (!comoLlegar || !posicionUsuario) {
      L.marker([latitud, longitud]).addTo(map).bindPopup(nombre);
    } else {

      L.Routing.control({
        waypoints: [
          L.latLng(latitud, longitud),
          L.latLng(posicionUsuario.latitud, posicionUsuario.longitud)
        ],
        fitSelectedRoutes: false  // Impide que el mapa ajuste la vista automáticamente
      }).addTo(map);

      // Asegurarse de que el mapa se centre sobre el destino inicialmente
      map.setView([latitud, longitud], 13);

    }
    



    

    // Refresh del mapa para evitar problemas de visualización
    setTimeout(() => {
        map.invalidateSize();
    }, 1000);
    
}