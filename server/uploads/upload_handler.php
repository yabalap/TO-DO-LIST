<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include CORS middleware
require_once '../config/cors.php';

// Set content type
header('Content-Type: application/json');

// Check if required files exist
$databaseFile = __DIR__ . '/../config/database.php';
$vendorFile = __DIR__ . '/../vendor/autoload.php';

if (!file_exists($databaseFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database configuration file not found']);
    exit;
}

if (!file_exists($vendorFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Vendor autoload file not found. Please run composer install']);
    exit;
}

require_once $databaseFile;
require $vendorFile;

use PhpOffice\PhpSpreadsheet\IOFactory;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    if (!isset($_FILES['file']) || !isset($_POST['table'])) {
        throw new Exception('File and table name are required');
    }

    $file = $_FILES['file'];
    $tableName = $_POST['table'];

    // Debug information
    error_log('Received file: ' . print_r($file, true));
    error_log('Table name: ' . $tableName);

    // Validate file type
    $allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type. Only Excel files are allowed.');
    }

    // Read the Excel file
    $spreadsheet = IOFactory::load($file['tmp_name']);
    $worksheet = $spreadsheet->getActiveSheet();
    $data = $worksheet->toArray();

    // Get headers (first row)
    $headers = array_shift($data);

    // Connect to database
    $db = new Database();
    $conn = $db->getConnection();

    // Begin transaction
    $conn->beginTransaction();

    try {
        // Prepare the SQL statement based on the table
        $columns = implode(', ', $headers);
        $placeholders = implode(', ', array_fill(0, count($headers), '?'));
        $sql = "INSERT INTO $tableName ($columns) VALUES ($placeholders)";
        $stmt = $conn->prepare($sql);

        // Insert each row
        foreach ($data as $row) {
            $stmt->execute($row);
        }

        // Commit transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'File uploaded and processed successfully',
            'rows_processed' => count($data)
        ]);

    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    error_log('Error in upload_handler.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
} 