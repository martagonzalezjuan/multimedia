<?php
// CODIGO GENERADO, REVISADO Y TESTEADO POR : ANDRÉS B.S.
// Fecha: 2025-04-08
// LICENCIA: MIT 
// https://opensource.org/licenses/MIT

// Definir la ruta del archivo JSON para guardar las suscripciones
$archivo = __DIR__ . '/../JSONs/newsletters.json';

// Si el archivo no existe, se crea inicializándolo como un array vacío
if (!file_exists($archivo)) {
    // Asegúrate de que el directorio '/../JSONs' existe y tiene permisos de escritura.
    file_put_contents($archivo, json_encode([]));
}

/**
 * Función para leer las suscripciones guardadas en el archivo.
 *
 * @param string $archivo Ruta al archivo JSON.
 * @return array Lista de suscripciones.
 */
function leerNewsletters($archivo) {
    $json = file_get_contents($archivo);
    return json_decode($json, true);
}

/**
 * Función para guardar una nueva suscripción.
 *
 * @param string $archivo Ruta del archivo JSON.
 * @param array $nuevaSuscripcion Estructura JSON-LD de la suscripción.
 */
function guardarNewsletter($archivo, $nuevaSuscripcion) {
    $suscripciones = leerNewsletters($archivo);
    $suscripciones[] = $nuevaSuscripcion;
    file_put_contents($archivo, json_encode($suscripciones, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Se espera que los datos se envíen en formato JSON
    $input = json_decode(file_get_contents('php://input'), true);

    // Validación básica: se requieren 'email'
    if (!isset($input['email'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan campos requeridos: email"]);
        exit;
    }

    // Estructura JSON-LD según Schema.org usando SubscribeAction para la suscripción
    $nuevaSuscripcion = [
        "@context"  => "https://schema.org",
        "@type"     => "SubscribeAction",
        "agent"     => [
            "@type" => "Person",
            "email" => $input['email']
        ],
        "startTime" => date("c") // Fecha actual en formato ISO 8601
    ];

    guardarNewsletter($archivo, $nuevaSuscripcion);
    echo json_encode(["mensaje" => "Suscripción al newsletter registrada correctamente"]);

} elseif ($method === 'GET') {
    // Devolver las suscripciones en formato JSON-LD
    header('Content-Type: application/ld+json');
    echo json_encode(leerNewsletters($archivo), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
