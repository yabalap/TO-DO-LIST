<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

require_once '../config/cors.php';
require_once '../config/database.php';

// Set content type to JSON
header('Content-Type: application/json');

try {
    // Debug: Check if database constants are defined
    if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS')) {
        throw new Exception('Database configuration is incomplete. Please check config/database.php');
    }

    // Debug: Print database connection details (remove in production)
    error_log("Attempting to connect to database: " . DB_HOST . ", " . DB_NAME);

    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        )
    );

    // Debug: Connection successful
    error_log("Database connection successful");

    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Debug: Check session
    error_log("Session data: " . print_r($_SESSION, true));

    // Get user department from session
    $userDepartment = $_SESSION['department'] ?? null;
    error_log("User department: " . ($userDepartment ?? 'null'));

    // Check if audit_logs table exists
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'audit_logs'");
    if ($tableCheck->rowCount() === 0) {
        throw new Exception('Audit logs table does not exist. Please run check_audit_table.php first.');
    }

    // Base query
    $query = "SELECT 
                al.id,
                al.timestamp,
                al.user_name,
                al.action,
                al.table_name,
                al.record_id,
                al.changes,
                al.ip_address
              FROM audit_logs al
              WHERE 1=1";

    // Add department filter if user has a department
    if ($userDepartment) {
        $query .= " AND al.department = :department";
    }

    // Order by timestamp descending
    $query .= " ORDER BY al.timestamp DESC";

    // Debug: Print final query
    error_log("Executing query: " . $query);

    $stmt = $pdo->prepare($query);

    // Bind department parameter if needed
    if ($userDepartment) {
        $stmt->bindParam(':department', $userDepartment);
    }

    $stmt->execute();
    $logs = $stmt->fetchAll();

    // Debug: Check results
    error_log("Number of logs found: " . count($logs));

    // Format the response
    $response = [
        'status' => 'success',
        'data' => $logs
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    error_log("Database error in fetch_audit_logs.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error occurred',
        'debug' => [
            'error' => $e->getMessage(),
            'code' => $e->getCode(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
} catch (Exception $e) {
    error_log("Error in fetch_audit_logs.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'debug' => [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}
?> 