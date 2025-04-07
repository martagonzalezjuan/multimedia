/**
 * Genera un gráfico SVG con estrellas de reseña según la calificación dada
 * @param {number} calificacion - Número del 0 al 10 que indica la calificación
 * @returns {SVGElement} - Elemento SVG con las estrellas
 */
function generarEstrellas(calificacion) {
    // Validar y limitar la calificación entre 0 y 10
    calificacion = Math.max(0, Math.min(10, calificacion));
    console.log(`Calificación: ${calificacion}`);
    
    // Configuración de las estrellas
    const totalEstrellas = 5; // Usamos 5 estrellas para representar de 0 a 10
    const valorPorEstrella = 5 / totalEstrellas; // Cada estrella vale 2 puntos
    
    // Calcular cuántas estrellas completas mostrar
    const estrellasLlenas = Math.floor(calificacion);
    
    // Calcular la fracción de la última estrella
    const fraccionEstrella = (calificacion - estrellasLlenas)/valorPorEstrella;
    
    // Crear el contenedor SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', totalEstrellas * 30);
    svg.setAttribute('height', 30);
    svg.setAttribute('viewBox', `0 0 ${totalEstrellas * 30} 30`);
    
    // Crear cada estrella
    for (let i = 0; i < totalEstrellas; i++) {
        const estrella = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Forma de estrella (path data para una estrella)
        estrella.setAttribute('d', 'M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z');
        
        // Posicionar la estrella
        estrella.setAttribute('transform', `translate(${i * 30}, 0)`);
        
        if (i < estrellasLlenas) {
            // Estrella completamente llena
            estrella.setAttribute('fill', '#FFD700');
            estrella.setAttribute('stroke', '#FFD700');
        } else if (i === estrellasLlenas && fraccionEstrella > 0) {
            // Estrella parcialmente llena
            // Primero añadir el contorno completo
            estrella.setAttribute('fill', 'none');
            estrella.setAttribute('stroke', '#FFD700');
            svg.appendChild(estrella);
            
            // Crear un clipPath para la parte rellena
            const clipPathId = `clip-star-${i}`;
            const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clipPath.setAttribute('id', clipPathId);
            
            const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            clipRect.setAttribute('x', '0');
            clipRect.setAttribute('y', '0');
            clipRect.setAttribute('width', `${fraccionEstrella * 24}`);  // 24 es el ancho aproximado de la estrella
            clipRect.setAttribute('height', '30');
            
            clipPath.appendChild(clipRect);
            svg.appendChild(clipPath);
            
            // Crear la parte rellena con el clip
            const estrellaRellena = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            estrellaRellena.setAttribute('d', 'M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z');
            estrellaRellena.setAttribute('transform', `translate(${i * 30}, 0)`);
            estrellaRellena.setAttribute('fill', '#FFD700');
            estrellaRellena.setAttribute('stroke', 'none');
            estrellaRellena.setAttribute('clip-path', `url(#${clipPathId})`);
            
            // Añadir la parte rellena
            svg.appendChild(estrellaRellena);
            
            // Ya hemos añadido la estrella parcial, así que continuamos
            continue;
        } else {
            // Estrella vacía
            estrella.setAttribute('fill', 'none');
            estrella.setAttribute('stroke', '#FFD700');
        }
        estrella.setAttribute('stroke-width', '1');
        
        // Añadir la estrella al SVG
        svg.appendChild(estrella);
    }
    
    return svg;
}

/**
 * Crea y muestra un componente de estrellas de reseña
 * @param {number} calificacion - Calificación del 0 al 10
 * @param {HTMLElement|string} contenedor - Elemento o ID del contenedor donde mostrar las estrellas
 */
function mostrarEstrellas(calificacion, contenedor) {
    const estrellasSVG = generarEstrellas(calificacion);
    
    // Obtener el elemento contenedor
    const elementoContenedor = typeof contenedor === 'string' 
        ? document.getElementById(contenedor) 
        : contenedor;
        
    if (!elementoContenedor) {
        console.error('Contenedor no encontrado');
        return;
    }
    
    // Limpiar el contenedor y añadir el SVG
    elementoContenedor.innerHTML = '';
    elementoContenedor.appendChild(estrellasSVG);
}