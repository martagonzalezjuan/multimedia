// Libreria para interactuar con la API de Maravillas (JSON)
// Version: 0.1.0
// Fecha: 2025-03-30

const URL_JSON = "/public/JSONs/maravillas.json";

// Función para obtener todas las maravillas
// @returns {Promise<Array>} - Array de maravillas
async function getMaravillas() {
    try {
        const response = await fetch(URL_JSON);
        if (!response.ok) {
            throw new Error("Error en la respuesta de la API: " + response.statusText);
        }
        const json = await response.json();
        if (!json) {
            throw new Error("Error al convertir la respuesta a JSON");
        }
        return json.itemListElement;
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        throw error;
    }
}

// Función para obtener una maravilla por su posición en el array
// @param {number} id - Posición de la maravilla en el array
// @returns {Maravilla} - Objeto de la maravilla
// @throws {Error} - Error si no se puede obtener la maravilla
async function getMaravillasById(id) {
    return await getMaravillas()
        .then(maravillas => {
            return maravillas[id] || null;
        })
        .catch(error => {
            console.error("Error al obtener la maravilla por ID:", error);
            throw error;
        });
}

// Función para obtener una maravilla por su nombre
// @param {string} nombre - Nombre de la maravilla
// @returns {Maravilla} - Objeto de la maravilla
// @throws {Error} - Error si no se puede obtener la maravilla
// @throws {Error} - Error si no se encuentra la maravilla
async function getMaravillasByName(nombre) {
    return await getMaravillas()
        .then(maravillas => {
            const maravilla = maravillas.find(maravilla => maravilla.name === nombre);
            if (!maravilla) {
                throw new Error("Maravilla no encontrada");
            }
            return maravilla;
        })
        .catch(error => {
            console.error("Error al obtener la maravilla por nombre:", error);
            throw error;
        });
}