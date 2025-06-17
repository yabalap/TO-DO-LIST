<?php
// CORS middleware
function handleCors() {
    // Only set headers if they haven't been set already
    if (!headers_sent()) {
        // Get the origin from the request headers
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        // List of allowed origins
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost/TO-DO-LIST'
        ];
        
        // Set CORS headers if origin is allowed
        if (in_array($origin, $allowedOrigins)) {
            // Check if Access-Control-Allow-Origin is not already set
            if (!isset($GLOBALS['_SERVER']['HTTP_ACCESS_CONTROL_ALLOW_ORIGIN'])) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Max-Age: 3600');
            }
        }
    }
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Call the CORS handler
handleCors(); 