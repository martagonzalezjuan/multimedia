// Libreria para interactuar con la API de Voz Lector Automático
// Version: 0.2.0
// Fecha: 2025-03-30

/**
 * Usando las APIs de HTML5 y Web Speech para leer en voz alta el texto
 * @param {string} texto - Texto a leer en voz alta
 * @param {string} idioma - Idioma del texto (opcional), por defecto 'es-ES' (español de España)
 * @returns {void}
 */
function leerEnVozAlta(texto, idioma) {
  if (!texto) {
    console.error("No se ha proporcionado texto para leer.");
    return;
  }
  if (typeof texto !== "string") {
    console.error("El texto debe ser una cadena.");
    return;
  }
  if (idioma && typeof idioma !== "string") {
    console.error("El idioma debe ser una cadena.");
    return;
  }

  // Verifica si la API de síntesis de voz está disponible
  if (!("speechSynthesis" in window)) {
    console.error(
      "La API de síntesis de voz no está soportada en este navegador."
    );
    return;
  }

  // Cancelamos cualquier lectura previa
  cancelarLectura();

  // Verifica si hay voces disponibles
  const voces = window.speechSynthesis.getVoices();
  if (voces.length === 0) {
    console.warn("Voces no cargadas, esperando...");
    window.speechSynthesis.onvoiceschanged = function() {
      const vocesActualizadas = window.speechSynthesis.getVoices();
      if (vocesActualizadas.length > 0) {
        console.log("Voces cargadas, reintentando la lectura.");
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = idioma || "es-ES"; // Idioma por defecto español de España
        speechSynthesis.speak(utterance);
        utterance.onend = function () {
          console.log("Lectura completada.");
        };
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
    return;
  }

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = idioma || "es-ES"; // Idioma por defecto español de España

  speechSynthesis.speak(utterance);

  utterance.onend = function () {
    console.log("Lectura completada.");
  };
}

/**
 * Pausa la lectura actual
 * @returns {boolean} - true si se pudo pausar, false en caso contrario
 */
function pausarLectura() {
  if (!("speechSynthesis" in window)) {
    console.error("La API de síntesis de voz no está soportada en este navegador.");
    return false;
  }
  
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
    console.log("Lectura pausada.");
    return true;
  }
  
  return false;
}

/**
 * Reanuda la lectura pausada
 * @returns {boolean} - true si se pudo reanudar, false en caso contrario
 */
function reanudarLectura() {
  if (!("speechSynthesis" in window)) {
    console.error("La API de síntesis de voz no está soportada en este navegador.");
    return false;
  }
  
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    console.log("Lectura reanudada.");
    return true;
  }
  
  return false;
}

/**
 * Cancela la lectura actual
 * @returns {boolean} - true si se pudo cancelar, false en caso contrario
 */
function cancelarLectura() {
  if (!("speechSynthesis" in window)) {
    console.error("La API de síntesis de voz no está soportada en este navegador.");
    return false;
  }
  
  window.speechSynthesis.cancel();
  console.log("Lectura cancelada.");
  return true;
}
