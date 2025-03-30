// filepath: c:\Users\andre\Desktop\multimedia\public\libs\forecastapi.js
// Librería para obtener la información del pronóstico del clima usando la API de OpenWeatherMap sin utilizar API Key
// Versión: 0.3.0
// Fecha: 2025-03-30
/**
 * Función auxiliar que simplifica el código del clima a etiquetas legibles.
 * @param {number} code - Código del clima.
 * @returns {string} - Clima simplificado.
 */
function simplifyWeatherCode(code) {
    if (code === 0 || [1, 2, 3].includes(code)) {
        return "Soleado";
    } else if ([45, 48].includes(code)) {
        return "Niebla";
    } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95].includes(code)) {
        return "Lluvia";
    } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return "Nevada";
    } else if ([96, 99].includes(code)) {
        return "Granizo";
    }
    return "Desconocido";
}

/**
 * Función para obtener el pronóstico del clima actual (ahora mismo) en una ubicación dada por latitud y longitud.
 * @param {number} latitud - Latitud de la ubicación.
 * @param {number} longitud - Longitud de la ubicación.
 * @returns {Promise<Object>} - Objeto con la información actual del clima.
 * @throws {Error} - Si ocurre un error al obtener los datos.
 */
async function obtenerPronosticoActual(latitud, longitud) {
    if (typeof latitud !== "number" || typeof longitud !== "number") {
        throw new Error("La latitud y longitud deben ser números.");
    }

    // Se obtiene solo el pronóstico actual con la información del clima y viento
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current_weather=true&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error al obtener los datos actuales del pronóstico: " + response.statusText);
    }
    const data = await response.json();
    const currentWeather = data.current_weather;
    const weatherSimplificado = simplifyWeatherCode(currentWeather.weathercode);

    return {
        temperature: currentWeather.temperature,
        weather: weatherSimplificado,
        windspeed: currentWeather.windspeed,
        winddirection: currentWeather.winddirection,
        time: currentWeather.time
    };
}

/**
 * Función para obtener los pronósticos del clima para las próximas 24 horas en una ubicación dada por latitud y longitud.
 * @param {number} latitud - Latitud de la ubicación.
 * @param {number} longitud - Longitud de la ubicación.
 * @returns {Promise<Array<Object>>} - Array de objetos con el pronóstico horario del clima.
 * @throws {Error} - Si ocurre un error al obtener los datos.
 */
async function obtenerPronostico24Horas(latitud, longitud) {
    if (typeof latitud !== "number" || typeof longitud !== "number") {
        throw new Error("La latitud y longitud deben ser números.");
    }

    // Solicitar datos horarios para temperatura, clima y viento
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Error al obtener los datos horarios del pronóstico: " + response.statusText);
    }
    const data = await response.json();

    const times = data.hourly.time;
    const temperatures = data.hourly.temperature_2m;
    const weathercodes = data.hourly.weathercode;
    const windspeeds = data.hourly.windspeed_10m;
    const winddirections = data.hourly.winddirection_10m;

    // Tomamos el tiempo actual de la respuesta para ajustar el rango de 24 horas
    const now = new Date();
    const forecast24 = [];

    for (let i = 0; i < times.length; i++) {
        const timeDate = new Date(times[i]);
        // Incluir pronósticos desde el momento actual hasta 24 horas después
        if (timeDate >= now && timeDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
            forecast24.push({
                time: times[i],
                temperature: temperatures[i],
                weather: simplifyWeatherCode(weathercodes[i]),
                windspeed: windspeeds[i],
                winddirection: winddirections[i]
            });
        }
    }
    return forecast24;
}
