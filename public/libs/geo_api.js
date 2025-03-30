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
      "La API de geolocalización no está soportada en este navegador."
    );
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      console.error("Error al obtener la ubicación:", error);
      reject(new Error("Error al obtener la ubicación: " + error.message));
    });
  });

  return {
    latitud: position.coords.latitude,
    longitud: position.coords.longitude,
  };
}
