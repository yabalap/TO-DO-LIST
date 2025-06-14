<?php
// Allow from any origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../config/config.php';
require_once '../vendor/autoload.php';

use \Firebase\JWT\JWT;

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    if (empty($data->username) || empty($data->password)) {
        throw new Exception("Username and password are required");
    }

    // Prepare query
    $query = "SELECT id, username, password, role, created_at, updated_at FROM users WHERE username = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$data->username]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception("User not found");
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!password_verify($data->password, $row['password'])) {
        throw new Exception("Invalid password");
    }

    // Generate JWT token
    $issuedat_claim = time();
    $notbefore_claim = $issuedat_claim;
    $expire_claim = $issuedat_claim + JWT_EXPIRATION;

    $token = array(
        "iss" => JWT_ISSUER,
        "aud" => JWT_AUDIENCE,
        "iat" => $issuedat_claim,
        "nbf" => $notbefore_claim,
        "exp" => $expire_claim,
        "data" => array(
            "id" => $row['id'],
            "username" => $row['username'],
            "role" => $row['role']
        )
    );

    $jwt = JWT::encode($token, JWT_SECRET_KEY, 'HS256');

    // Return success response
    echo json_encode(array(
        "message" => "Login successful",
        "jwt" => $jwt,
        "role" => $row['role'],
        "user" => array(
            "id" => $row['id'],
            "username" => $row['username'],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at']
        )
    ));

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(array(
        "message" => $e->getMessage()
    ));
}
?> 