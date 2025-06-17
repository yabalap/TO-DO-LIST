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
require_once '../audit/audit_logger.php';

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
    $postedUsername = isset($_POST['username']) ? $_POST['username'] : null;

    // Debug information
    error_log('Received file: ' . print_r($file, true));
    error_log('Table name: ' . $tableName);
    error_log('Posted Username: ' . ($postedUsername ?? 'Not set'));

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

    // Initialize audit logger
    $logger = new AuditLogger($conn);

    // Get user information
    session_start();
    $sessionUserData = isset($_SESSION['userData']) ? json_decode($_SESSION['userData'], true) : null;
    
    // Prioritize username from POST, then session, then fallback to 'Unknown'
    $userName = $postedUsername ?? ($sessionUserData['username'] ?? 'Unknown');
    $department = $sessionUserData ? $sessionUserData['department'] : 'Unknown';

    error_log('Final Username for insertion: ' . $userName);
    error_log('Session User Data: ' . print_r($sessionUserData, true));
    error_log('Session ID: ' . session_id());

    // Begin transaction
    $conn->beginTransaction();

    try {
        // Add uploaded_at and updated_at to headers if they don't exist
        if (!in_array('uploaded_at', $headers)) {
            $headers[] = 'uploaded_at';
        }
        if (!in_array('updated_at', $headers)) {
            $headers[] = 'updated_at';
        }
        if (!in_array('person_accountable', $headers)) {
            $headers[] = 'person_accountable';
        }

        // Debug information
        error_log('Headers: ' . print_r($headers, true));

        // Prepare the SQL statement based on the table
        $columns = implode(', ', $headers);
        $placeholders = implode(', ', array_fill(0, count($headers), '?'));
        $sql = "INSERT INTO $tableName ($columns) VALUES ($placeholders)";
        
        // Debug SQL
        error_log('SQL Query: ' . $sql);
        
        $stmt = $conn->prepare($sql);

        // Insert each row and log the upload
        foreach ($data as $rowIndex => $row) {
            // Debug row data
            error_log("Processing row $rowIndex: " . print_r($row, true));
            
            // Create a new array with the same length as headers
            $values = array_fill(0, count($headers), null);
            
            // Fill in the values from the Excel data
            for ($i = 0; $i < count($row); $i++) {
                if (isset($headers[$i])) {
                    $values[$i] = $row[$i];
                }
            }
            
            // Add timestamps and person_accountable at the end
            $currentTimestamp = date('Y-m-d H:i:s');
            
            // Find the indices for our special columns
            $uploadedAtIndex = array_search('uploaded_at', $headers);
            $updatedAtIndex = array_search('updated_at', $headers);
            $personAccountableIndex = array_search('person_accountable', $headers);
            
            // Set the values at the correct indices
            if ($uploadedAtIndex !== false) {
                $values[$uploadedAtIndex] = $currentTimestamp;
            }
            if ($updatedAtIndex !== false) {
                $values[$updatedAtIndex] = $currentTimestamp;
            }
            if ($personAccountableIndex !== false) {
                $values[$personAccountableIndex] = $userName;
            }

            // Debug values array
            error_log('Values to be inserted: ' . print_r($values, true));
            error_log('Number of values: ' . count($values));
            error_log('Number of headers: ' . count($headers));

            try {
                $stmt->execute($values);
                $recordId = $conn->lastInsertId();
                
                // Log the upload action
                $fileInfo = [
                    'file_name' => $file['name'],
                    'file_type' => $file['type'],
                    'file_size' => $file['size'],
                    'uploaded_data' => array_combine($headers, $values)
                ];
                
                $logger->logUpload(
                    $tableName,
                    $recordId,
                    $fileInfo,
                    $userName,
                    $department
                );
            } catch (PDOException $e) {
                error_log('PDO Error on row ' . $rowIndex . ': ' . $e->getMessage());
                throw $e;
            }
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