<?php
// Start output buffering to catch any unwanted output
ob_start();

// Enable error logging
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', '../logs/php_errors.log');

// Function to log messages
function logMessage($message, $data = null) {
    $logMessage = date('Y-m-d H:i:s') . " - " . $message;
    if ($data !== null) {
        $logMessage .= " - Data: " . json_encode($data, JSON_PRETTY_PRINT);
    }
    error_log($logMessage);
}

// Set custom error handler
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Function to send JSON response
function sendJsonResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Function to send error response
function sendErrorResponse($message, $code = 400) {
    http_response_code($code);
    sendJsonResponse(false, $message);
}

try {
    logMessage("Script started");
    
    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        logMessage("Invalid request method", $_SERVER['REQUEST_METHOD']);
        sendErrorResponse('Method not allowed. Only POST requests are accepted.', 405);
    }

    // Get the request body
    $requestBody = file_get_contents('php://input');
    if ($requestBody === false) {
        logMessage("Failed to read request body");
        sendErrorResponse('Failed to read request body');
    }

    logMessage("Received request body", $requestBody);

    $data = json_decode($requestBody, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        logMessage("JSON decode error", json_last_error_msg());
        sendErrorResponse('Invalid JSON data: ' . json_last_error_msg());
    }

    logMessage("Decoded request data", $data);

    // Validate required fields
    if (!isset($data['id']) || !isset($data['status'])) {
        logMessage("Missing required fields", $data);
        sendErrorResponse('Missing required fields: id and status are required');
    }

    // Validate status value
    $validStatuses = ['approved', 'rejected'];
    if (!in_array(strtolower($data['status']), $validStatuses)) {
        logMessage("Invalid status value", $data['status']);
        sendErrorResponse('Invalid status value. Must be either "approved" or "rejected"');
    }

    // Initialize database connection
    require_once '../config/Database.php';
    
    try {
        logMessage("Attempting database connection");
        $database = new Database();
        $conn = $database->getConnection();
        
        if (!$conn) {
            throw new Exception("Failed to connect to database");
        }
        logMessage("Database connection successful");

        // Get list of actual tables in the database
        $tablesQuery = $conn->query("SHOW TABLES");
        $actualTables = $tablesQuery->fetchAll(PDO::FETCH_COLUMN);
        logMessage("Found tables in database", $actualTables);

        // Define all document tables to check
        $documentTables = [
            'bir_documents',
            'pcab_documents',
            'iso_certifying_body_documents',
            'iso_scope_documents',
            'iso_scope_extension_documents',
            'iso_scope_reduction_documents',
            'iso_scope_suspension_documents',
            'iso_scope_withdrawal_documents',
            'iso_scope_merge_documents',
            'iso_scope_split_documents',
            'iso_scope_termination_documents',
            'iso_scope_reinstatement_documents',
            'iso_scope_renewal_documents',
            'iso_scope_cancellation_documents',
            'iso_scope_expiration_documents',
            'iso_scope_revocation_documents',
            'iso_scope_surrender_documents',
            'iso_scope_voluntary_withdrawal_documents',
            'iso_scope_involuntary_withdrawal_documents',
            'iso_scope_automatic_withdrawal_documents',
            'iso_scope_automatic_cancellation_documents',
            'iso_scope_automatic_expiration_documents',
            'iso_scope_automatic_revocation_documents',
            'iso_scope_automatic_surrender_documents',
            'iso_scope_automatic_voluntary_withdrawal_documents',
            'iso_scope_automatic_involuntary_withdrawal_documents',
            'iso_scope_automatic_termination_documents',
            'iso_scope_automatic_reinstatement_documents',
            'iso_scope_automatic_renewal_documents',
            'iso_scope_automatic_merge_documents',
            'iso_scope_automatic_split_documents',
            'iso_scope_automatic_transfer_documents',
            'iso_scope_automatic_suspension_documents',
            'iso_scope_automatic_reduction_documents',
            'iso_scope_automatic_extension_documents',
            'bank_documents',
            'bir_accredited_cpa_documents',
            'company_appraiser_banks_documents',
            'company_lto_suppliers_documents',
            'dole_accredited_trainers_documents',
            'dole_accredited_training_centers_documents',
            'dti_sec_cda_documents',
            'lgu_documents',
            'nbi_documents',
            'pag_ibig_fund_documents',
            'philhealth_documents',
            'prc_documents',
            'sec_documents',
            'sss_documents'
        ];

        // Filter to only include tables that exist
        $tables = array_intersect($documentTables, $actualTables);
        logMessage("Tables to check", $tables);

        $updated = false;
        // Set the correct status and progress values based on the action
        $status = strtolower($data['status']) === 'approved' ? 'Approved' : 'Rejected';
        $progress = strtolower($data['status']) === 'approved' ? 'Completed' : 'Pending';
        $lastError = null;

        logMessage("Attempting to update record", [
            'id' => $data['id'],
            'status' => $status,
            'progress' => $progress
        ]);

        // Try to update in each table
        foreach ($tables as $table) {
            try {
                logMessage("Checking table", $table);
                
                // First check if the record exists
                $checkQuery = "SELECT * FROM `$table` WHERE id = ?";
                $checkStmt = $conn->prepare($checkQuery);
                $checkStmt->execute([$data['id']]);
                
                if ($checkStmt->rowCount() === 0) {
                    logMessage("No record found in table", $table);
                    continue;
                }

                // Update status and progress fields
                $updateQuery = "UPDATE `$table` SET status = ?, progress = ? WHERE id = ?";
                $updateStmt = $conn->prepare($updateQuery);
                
                if ($updateStmt->execute([$status, $progress, $data['id']])) {
                    if ($updateStmt->rowCount() > 0) {
                        $updated = true;
                        logMessage("Update successful in table", $table);
                        break;
                    }
                }
            } catch (Exception $e) {
                $lastError = "Error processing table $table: " . $e->getMessage();
                logMessage("Error in table", [
                    'table' => $table,
                    'error' => $e->getMessage()
                ]);
                continue;
            }
        }

        if (!$updated) {
            $errorMessage = $lastError ? "Update failed: $lastError" : "No record found with ID: " . $data['id'];
            logMessage("Update failed", $errorMessage);
            sendErrorResponse($errorMessage, 404);
        }

        // Send success response
        logMessage("Update successful, sending response");
        sendJsonResponse(true, 'Status updated successfully', [
            'id' => $data['id'],
            'status' => $status,
            'progress' => $progress
        ]);

    } catch (Exception $e) {
        logMessage("Database error", $e->getMessage());
        sendErrorResponse('Database error: ' . $e->getMessage(), 500);
    }

} catch (Throwable $e) {
    logMessage("Unexpected error", $e->getMessage());
    sendErrorResponse('An unexpected error occurred: ' . $e->getMessage(), 500);
} finally {
    ob_end_flush();
}
?> 