<?php
// CODIGO GENERADO, REVISADO Y TESTEADO POR : ANDRÉS B.S.
// Fecha: 2025-04-08
// LICENCIA: MIT 
// https://opensource.org/licenses/MIT

// Ruta del archivo JSON donde se guardarán los datos de los formularios
$archivo = __DIR__ . '/../JSONs/contacto.json';

// Si el archivo no existe, se crea inicializándolo como un array vacío
if (!file_exists($archivo)) {
    file_put_contents($archivo, json_encode([]));
}

/**
 * Función para leer los datos almacenados en el archivo.
 *
 * @param string $archivo Ruta al archivo JSON.
 * @return array Array con los datos decodificados.
 */
function leerContactos($archivo) {
    $json = file_get_contents($archivo);
    return json_decode($json, true);
}

/**
 * Función para agregar un nuevo mensaje de contacto al archivo JSON.
 *
 * @param string $archivo Ruta al archivo JSON.
 * @param array $nuevoContacto La estructura JSON-LD del mensaje de contacto.
 */
function guardarContacto($archivo, $nuevoContacto) {
    $contactos = leerContactos($archivo);
    $contactos[] = $nuevoContacto;
    file_put_contents($archivo, json_encode($contactos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Determinamos el método HTTP de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Se asume que los datos se envían en formato JSON
    $input = json_decode(file_get_contents('php://input'), true);

    // Validación básica de campos requeridos
    if (!isset($input['nombre']) || !isset($input['email']) || !isset($input['mensaje'])) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan campos requeridos: nombre, email y mensaje"]);
        exit;
    }

    // Creamos la estructura JSON-LD siguiendo el estándar de Schema.org para ContactAction
    // Nota: El esquema utiliza "ContactAction" para representar la acción de contactar.
    // Se define "agent" para la persona que envía el mensaje, y "result" para el contenido del mensaje.
    $nuevoContacto = [
        "@context"  => "https://schema.org",
        "@type"     => "ContactAction",
        "agent"     => [
            "@type" => "Person",
            "name"  => $input['nombre'],
            "email" => $input['email']
        ],
        "result"    => [
            "@type" => "Message",
            "text"  => $input['mensaje']
        ],
        "startTime" => date("c") // Fecha en formato ISO 8601
    ];

    guardarContacto($archivo, $nuevoContacto);
    echo json_encode(["mensaje" => "Mensaje de contacto enviado correctamente"]);

} elseif ($method === 'GET') {
    // Para devolver la información en JSON-LD, establecemos el header correspondiente
    header('Content-Type: application/ld+json');
    echo json_encode(leerContactos($archivo), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} else {
    // Método HTTP no permitido
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
