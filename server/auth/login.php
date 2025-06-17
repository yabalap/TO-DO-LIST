<?php
require_once '../cors.php';

// Set content type
header("Content-Type: application/json; charset=UTF-8");

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
    $query = "SELECT u.id, u.username, u.password, u.role, u.created_at, u.updated_at, 
                     e.department, e.name, e.id as employee_id
              FROM users u 
              LEFT JOIN employee e ON u.username = e.username 
              WHERE u.username = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$data->username]);
    
    if ($stmt->rowCount() === 0) {
        throw new Exception("User not found");
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!password_verify($data->password, $row['password'])) {
        throw new Exception("Invalid password");
    }

    // If employee record doesn't exist, create it
    if (!$row['name'] || !$row['department']) {
        $updateQuery = "UPDATE employee SET 
                       name = CASE WHEN name IS NULL THEN ? ELSE name END,
                       department = CASE WHEN department IS NULL THEN ? ELSE department END
                       WHERE username = ?";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->execute([
            $data->username, // Use username as name if null
            'Admin', // Default department for admin
            $data->username
        ]);

        // If no record was updated, insert a new one
        if ($updateStmt->rowCount() === 0) {
            $insertQuery = "INSERT INTO employee (name, department, username) VALUES (?, ?, ?)";
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->execute([
                $data->username, // Use username as name
                'Admin', // Default department for admin
                $data->username
            ]);
        }

        // Fetch the updated record
        $stmt->execute([$data->username]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
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

    // Start session and store user information
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    $_SESSION['name'] = $row['name'];
    $_SESSION['department'] = $row['department'];
    $_SESSION['role'] = $row['role'];
    $_SESSION['username'] = $row['username'];

    // Return success response
    echo json_encode(array(
        "message" => "Login successful",
        "jwt" => $jwt,
        "role" => $row['role'],
        "user" => array(
            "id" => $row['id'],
            "username" => $row['username'],
            "name" => $row['name'],
            "department" => $row['department'],
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