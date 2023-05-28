<?php
include("./controllers/BmiDataController.php");
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestEndpoint = $_SERVER['REQUEST_URI'];
// Remove any query parameters from the endpoint
if (strpos($requestEndpoint, '?') !== false) {
    $requestEndpoint = substr($requestEndpoint, 0, strpos($requestEndpoint, '?'));
}

$controller = new BmiDataController();
$response = "";

switch (true) {
    case $requestEndpoint == '/OVi/api/bmi-data':
        if ($requestMethod === 'GET') {
            $response = $controller->getAllData();
        } elseif ($requestMethod === 'POST') {
            $body = file_get_contents('php://input');
            $entry = (json_decode($body));
            $response = $controller->addData($entry);
        } else {
            // Invalid request method for /api/users
            http_response_code(405); // Method Not Allowed
        }
        break;
    case preg_match("~^/OVi/api/bmi-data/(\d+)~", $requestEndpoint):
        $entryId = basename($requestEndpoint);
        if ($requestMethod === 'DELETE') {
            $response = $controller->deleteData($entryId);
        }
        if ($requestMethod === 'PUT') {
            $body = file_get_contents('php://input');
            $entry = (json_decode($body));
            $response = $controller->editData($entryId, $entry);
        }

        break;
    default:
        // Invalid endpoint
        http_response_code(404); // Not Found
        break;
}

header($response['status_code_header']);
if ($response['body']) {
    echo $response['body'];
}

