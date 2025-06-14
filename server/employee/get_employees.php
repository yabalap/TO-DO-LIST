<?php
// Allow from any origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Query to get employees with their user information
    $query = "SELECT e.id, e.name, e.department, u.username, u.role, u.created_at 
              FROM employee e 
              JOIN users u ON e.username = u.username 
              ORDER BY e.id DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return success response
    echo json_encode(array(
        "message" => "Employees fetched successfully",
        "employees" => $employees
    ));

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        "message" => $e->getMessage()
    ));
}
?> 