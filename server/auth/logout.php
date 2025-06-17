<?php
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/cors.php';
require_once '../config/session.php';

// Clear session data
clearSessionData();

// Return success response
echo json_encode([
    "message" => "Logout successful"
]);
?> 