<?php
// Set content type
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    if (empty($data->id) || empty($data->name) || empty($data->department) || empty($data->role)) {
        throw new Exception("Required fields are missing");
    }

    // First get the employee's username
    $query = "SELECT username FROM employee WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$data->id]);
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$employee) {
        throw new Exception("Employee not found");
    }

    // Call the stored procedure to update employee and user
    $query = "CALL update_employee_and_user(?, ?, ?, NULL, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        $employee['username'],
        $data->name,
        $data->department,
        $data->role
    ]);

    // Return success response
    echo json_encode(array(
        "message" => "Employee updated successfully"
    ));

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        "message" => $e->getMessage()
    ));
}
?> 