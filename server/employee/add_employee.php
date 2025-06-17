<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include CORS middleware
require_once '../config/cors.php';

// Set content type
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Get posted data
    $raw_data = file_get_contents("php://input");
    error_log("Raw input data: " . $raw_data); // Debug log
    
    $data = json_decode($raw_data);
    error_log("Decoded data: " . print_r($data, true)); // Debug log

    // Validate input
    if (empty($data->name) || empty($data->department) || empty($data->username) || empty($data->password) || empty($data->role)) {
        error_log("Validation failed. Missing fields:"); // Debug log
        error_log("name: " . (empty($data->name) ? "empty" : "set"));
        error_log("department: " . (empty($data->department) ? "empty" : "set"));
        error_log("username: " . (empty($data->username) ? "empty" : "set"));
        error_log("password: " . (empty($data->password) ? "empty" : "set"));
        error_log("role: " . (empty($data->role) ? "empty" : "set"));
        throw new Exception("All fields are required");
    }

    // Check if username already exists
    $check_query = "SELECT username FROM users WHERE username = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$data->username]);
    
    if ($check_stmt->rowCount() > 0) {
        throw new Exception("Username already exists");
    }

    // Hash the password
    $hashed_password = password_hash($data->password, PASSWORD_DEFAULT);

    // Call the stored procedure
    $query = "CALL add_employee_with_user(?, ?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        $data->name,
        $data->department,
        $data->username,
        $hashed_password,
        $data->role
    ]);

    // Return success response
    echo json_encode(array(
        "message" => "Employee added successfully"
    ));

} catch (Exception $e) {
    error_log("Error in add_employee.php: " . $e->getMessage()); // Debug log
    http_response_code(400);
    echo json_encode(array(
        "message" => $e->getMessage()
    ));
}
?> 