<?php
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Get employee ID from query parameter if it exists
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if ($id) {
        // Query to get single employee with their user information
        $query = "SELECT e.id, e.name, e.department, u.username, u.role 
                  FROM employee e 
                  JOIN users u ON e.username = u.username 
                  WHERE e.id = ?";
        
        $stmt = $db->prepare($query);
        $stmt->execute([$id]);
        
        $employee = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$employee) {
            throw new Exception("Employee not found");
        }

        // Return success response for single employee
        echo json_encode(array(
            "message" => "Employee fetched successfully",
            "employee" => $employee
        ));
    } else {
        // Query to get all employees with their user information
        $query = "SELECT e.id, e.name, e.department, u.username, u.role, u.created_at 
                  FROM employee e 
                  JOIN users u ON e.username = u.username 
                  ORDER BY e.id DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return success response for all employees
        echo json_encode(array(
            "message" => "Employees fetched successfully",
            "employees" => $employees
        ));
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(array(
        "message" => $e->getMessage()
    ));
}
?> 