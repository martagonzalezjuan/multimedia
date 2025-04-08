function createLectorComponent(text, container) {
    if (!text || typeof text !== "string") {
        console.error("El texto debe ser una cadena válida.");
        return;
    }

    // Variable para controlar el estado actual
    let lectorState = "stopped";
    let utterance = null;

    // Función para actualizar la visibilidad de los botones según el estado
    function updateIcons(state) {
        // state: "stopped", "playing", "paused"
        lectorState = state;
        switch(state) {
            case "stopped":
                playButton.style.display = "inline";
                pauseButton.style.display = "none";
                stopButton.style.display = "none";
                break;
            case "playing":
                playButton.style.display = "none";
                pauseButton.style.display = "inline";
                stopButton.style.display = "inline";
                break;
            case "paused":
                playButton.style.display = "inline";
                pauseButton.style.display = "none";
                stopButton.style.display = "inline";
                break;
        }
    }

    // Función para leer el texto
    function leerEnVozAlta(textoALeer) {
        if (!textoALeer) return false;
        
        // Cancelar lectura previa si existe
        cancelarLectura();
        
        utterance = new SpeechSynthesisUtterance(textoALeer);
        
        // Manejar el evento de finalización
        utterance.onend = function() {
            updateIcons("stopped");
        };
        
        // Manejar errores
        utterance.onerror = function() {
            console.error("Error en la síntesis de voz");
            updateIcons("stopped");
        };
        
        window.speechSynthesis.speak(utterance);
        return true;
    }
    
    // Función para pausar la lectura
    function pausarLectura() {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            return true;
        }
        return false;
    }
    
    // Función para reanudar la lectura
    function reanudarLectura() {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return true;
        }
        return false;
    }
    
    // Función para cancelar la lectura
    function cancelarLectura() {
        window.speechSynthesis.cancel();
        return true;
    }

    // Botón Play / Reanudar
    const playButton = document.createElement('i');
    playButton.id = "lector-play";
    playButton.style.cursor = "pointer";
    playButton.className = "fas fa-volume-up me-4";
    playButton.style.marginRight = "10px"; // Ajusta el valor según sea necesario
    playButton.addEventListener('mouseover', function() {
        this.style.color = '#007bff';
    });
    playButton.addEventListener('mouseout', function() {
        this.style.color = 'inherit';
    });
    playButton.addEventListener('click', function() {
        // Si hay una lectura pausada, se reanuda, de lo contrario se inicia una nueva lectura
        if (lectorState === "paused" && window.speechSynthesis.paused) {
            if (reanudarLectura()) {
                updateIcons("playing");
            }
        } else {
            if (leerEnVozAlta(text)) {
                updateIcons("playing");
            }
        }
    });

    // Botón Pausa
    const pauseButton = document.createElement('i');
    pauseButton.id = "lector-pause";
    pauseButton.style.cursor = "pointer";
    pauseButton.className = "fas fa-pause me-4";
    pauseButton.style.marginRight = "10px"; // Ajusta el valor según sea necesario
    pauseButton.style.marginRight = "10px";
    pauseButton.addEventListener('mouseover', function() {
        this.style.color = '#007bff';
    });
    pauseButton.addEventListener('mouseout', function() {
        this.style.color = 'inherit';
    });
    pauseButton.addEventListener('click', function() {
        if (pausarLectura()) {
            updateIcons("paused");
        }
    });

    // Botón Detener
    const stopButton = document.createElement('i');
    stopButton.id = "lector-stop";
    stopButton.style.cursor = "pointer";
    stopButton.className = "fas fa-stop";
    stopButton.style.marginRight = "10px";
    
    
    stopButton.addEventListener('mouseover', function() {
        this.style.color = '#007bff';
    });
    stopButton.addEventListener('mouseout', function() {
        this.style.color = 'inherit';
    });
    stopButton.addEventListener('click', function() {
        if (cancelarLectura()) {
            updateIcons("stopped");
        }
    });

    // Agregar los botones al contenedor
    container.appendChild(playButton);
    container.appendChild(pauseButton);
    container.appendChild(stopButton);

    // Estado inicial: sólo se muestra el botón de play
    updateIcons("stopped");

    return { play: playButton, pause: pauseButton, stop: stopButton };
}