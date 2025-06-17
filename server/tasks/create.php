<?php
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../middleware/auth.php';

// Authenticate the request
$auth = requireAuth();

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    if (empty($data->title) || empty($data->description)) {
        throw new Exception("Title and description are required");
    }

    // Prepare query
    $query = "INSERT INTO tasks (title, description, user_id, status, created_at, updated_at) 
              VALUES (?, ?, ?, 'pending', NOW(), NOW())";
    
    $stmt = $db->prepare($query);
    $stmt->execute([
        $data->title,
        $data->description,
        $auth['user_id'] // Use the authenticated user's ID
    ]);

    // Return success response
    echo json_encode([
        "message" => "Task created successfully",
        "task_id" => $db->lastInsertId()
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "message" => $e->getMessage()
    ]);
}
?> 