<?php
// CORS middleware
function handleCors() {
    // Get the origin from the request headers
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // List of allowed origins
    $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost/TO-DO-LIST'
    ];
    
    // Only set CORS headers if not already set by .htaccess
    if (in_array($origin, $allowedOrigins) && !headers_sent()) {
        if (!isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 3600');
        }
    }
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // Set response code to 200
        http_response_code(200);
        exit();
    }
}

// Call the CORS handler
handleCors(); 