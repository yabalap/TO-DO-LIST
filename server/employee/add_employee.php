<?php
// Allow from any origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    if (empty($data->name) || empty($data->department) || empty($data->username) || empty($data->password) || empty($data->role)) {
        throw new Exception("All fields are required");
    }

    // Call the stored procedure
    $query = "CALL add_employee_with_user(?, ?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        $data->name,
        $data->department,
        $data->username,
        $data->password,
        $data->role
    ]);

    // Return success response
    echo json_encode(array(
        "message" => "Employee added successfully"
    ));

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        "message" => $e->getMessage()
    ));
}
?> 