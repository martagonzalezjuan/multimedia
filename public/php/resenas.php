<?php
// CODIGO GENERADO, REVISADO Y TESTEADO POR : ANDRÉS B.S.
// Fecha: 2025-04-08
// LICENCIA: MIT 
// https://opensource.org/licenses/MIT

$archivo = __DIR__ . '/../JSONs/reseñas.json';

// Si no existe el archivo, crearlo vacío como un array JSON válido
if (!file_exists($archivo)) {
    file_put_contents($archivo, json_encode([]));
}

function leerReseñas($archivo) {
    $json = file_get_contents($archivo);
    return json_decode($json, true);
}

function guardarReseña($archivo, $nuevaReseña) {
    $reseñas = leerReseñas($archivo);
    $reseñas[] = $nuevaReseña;
    file_put_contents($archivo, json_encode($reseñas, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['nombre']) || !isset($input['mensaje'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan campos requeridos: nombre y mensaje"]);
        exit;
    }

    $nuevaReseña = [
        "@context" => "https://schema.org",
        "@type" => "Review",
        "author" => [
            "@type" => "Person",
            "name" => $input['nombre']
        ],
        "reviewBody" => $input['mensaje'],
        "datePublished" => date("c") // ISO 8601 format (e.g., 2025-04-08T12:34:56+00:00)
    ];

    guardarReseña($archivo, $nuevaReseña);
    echo json_encode(["mensaje" => "Reseña guardada correctamente!"]);

} elseif ($method === 'GET') {
    header('Content-Type: application/ld+json');
    echo json_encode(leerReseñas($archivo), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
