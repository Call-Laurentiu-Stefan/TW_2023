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
            header($response['status_code_header']);
            if ($response['body']) {
                echo $response['body'];
            }
        } elseif ($requestMethod === 'POST') {
            $body = file_get_contents('php://input');
            $entry = (json_decode($body));
            $response = $controller->addData($entry);
            header($response['status_code_header']);
            if ($response['body']) {
                echo $response['body'];
            }
        } else {
            // Invalid request method for /api/users
            http_response_code(405); // Method Not Allowed
        }
        break;
    case preg_match("~^/OVi/api/bmi-data/(\d+)~", $requestEndpoint):
        $entryId = basename($requestEndpoint);
        if ($requestMethod === 'DELETE') {
            $response = $controller->deleteData($entryId);
            header($response['status_code_header']);
        }
        if ($requestMethod === 'PUT'){
            $body = file_get_contents('php://input');
            $entry = (json_decode($body));
            $response = $controller->editData($entryId, $entry);
            header($response['status_code_header']);
        }
        // case '/api/users/{id}':
        //     // Extract the user ID from the endpoint
        //     $userId = basename($requestEndpoint);
        //     if ($requestMethod === 'GET') {
        //         // Logic to handle GET request for /api/users/{id}
        //         // Return the user with the specified ID
        //     } elseif ($requestMethod === 'PUT') {
        //         // Logic to handle PUT request for /api/users/{id}
        //         // Update the user with the specified ID
        //     } elseif ($requestMethod === 'DELETE') {
        //         // Logic to handle DELETE request for /api/users/{id}
        //         // Delete the user with the specified ID
        //     } else {
        //         // Invalid request method for /api/users/{id}
        //         http_response_code(405); // Method Not Allowed
        //     }
        //     break;
        break;
    default:
        // Invalid endpoint
        http_response_code(404); // Not Found
        break;
}
// if ($response != "") {
//     header($response['status_code_header']);
//     if ($response['body']) {
//         echo $response['body'];
//     }
// }
