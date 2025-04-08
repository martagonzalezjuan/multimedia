<?php
// CODIGO GENERADO, REVISADO Y TESTEADO POR : ANDRÉS B.S.
// Fecha: 2025-04-08
// LICENCIA: MIT 
// https://opensource.org/licenses/MIT

// Definir la ruta al archivo donde se almacenarán las valoraciones (ratings)
$archivo = __DIR__ . '/../JSONs/ratings.json';

// Si el archivo no existe, se inicializa como un array JSON vacío
if (!file_exists($archivo)) {
    // Asegúrate de que el directorio ../JSONs existe y tiene permisos de escritura
    file_put_contents($archivo, json_encode([]));
}

/**
 * Función para leer las valoraciones almacenadas.
 *
 * @param string $archivo Ruta al archivo JSON.
 * @return array Lista de valoraciones.
 */
function leerRatings($archivo) {
    $json = file_get_contents($archivo);
    return json_decode($json, true);
}

/**
 * Función para guardar una nueva valoración.
 *
 * @param string $archivo Ruta al archivo JSON.
 * @param array $nuevaRating La estructura JSON-LD de la valoración.
 */
function guardarRating($archivo, $nuevaRating) {
    $ratings = leerRatings($archivo);
    $ratings[] = $nuevaRating;
    file_put_contents($archivo, json_encode($ratings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Se asume que los datos se envían en formato JSON
    $input = json_decode(file_get_contents('php://input'), true);

    // Validar que se envíen los campos requeridos: 'nombre' del objeto y 'puntos'
    if (!isset($input['nombre']) || !isset($input['puntos'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan campos requeridos: nombre y puntos"]);
        exit;
    }

    // Convertir la puntuación a número y validarla (debe estar entre 0 y 5)
    $puntos = floatval($input['puntos']);
    if ($puntos < 0 || $puntos > 5) {
        http_response_code(400);
        echo json_encode(["error" => "El valor de puntos debe estar entre 0 y 5"]);
        exit;
    }

    // Crear la estructura JSON-LD siguiendo Schema.org con el tipo Review:
    // Se utiliza "itemReviewed" para el elemento evaluado y "reviewRating" con un objeto Rating.
    $nuevoRating = [
        "@context"      => "https://schema.org",
        "@type"         => "Review",
        "itemReviewed"  => [
            "@type" => "Thing",
            "name"  => $input['nombre']
        ],
        "reviewRating"  => [
            "@type"       => "Rating",
            "ratingValue" => $puntos,
            "bestRating"  => 5,
            "worstRating" => 0
        ],
        "datePublished" => date("c") // Fecha en formato ISO 8601
    ];

    guardarRating($archivo, $nuevoRating);
    echo json_encode(["mensaje" => "Valoración guardada correctamente"]);

} elseif ($method === 'GET') {
    // Devolver las valoraciones en formato JSON-LD
    header('Content-Type: application/ld+json');
    echo json_encode(leerRatings($archivo), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
