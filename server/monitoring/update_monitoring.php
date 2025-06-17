<?php
// Prevent any output before headers
ob_start();

// Enable error reporting but don't display errors
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once '../cors.php';
require_once '../config/database.php';
require_once '../audit/audit_logger.php';

// Set content type to JSON
header('Content-Type: application/json; charset=UTF-8');

// Only allow PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Start session if not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Get the request body
    $json = file_get_contents('php://input');
    if (!$json) {
        throw new Exception('No data received');
    }

    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Get the ID from the URL
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if (!$id) {
        throw new Exception('ID is required');
    }

    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Initialize audit logger
    $logger = new AuditLogger();

    // Get all tables that store documents
    $tables = [
        'pcab_documents',
        'iso_certifying_body_documents',
        'dti_sec_cda_documents',
        'bir_documents',
        'lgu_documents',
        'sec_documents',
        'sss_documents',
        'philhealth_documents',
        'pag_ibig_fund_documents',
        'dole_accredited_training_centers_documents',
        'nbi_documents',
        'bir_accredited_cpa_documents',
        'company_appraiser_banks_documents',
        'bank_documents',
        'prc_documents',
        'dole_accredited_trainers_documents',
        'company_lto_suppliers_documents'
    ];

    $updated = false;
    $updatedTable = '';

    // Try to update in each table
    foreach ($tables as $table) {
        try {
            // First check if the record exists
            $checkQuery = "SELECT * FROM $table WHERE id = :id";
            $checkStmt = $db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() === 0) {
                continue; // Skip this table if record doesn't exist
            }

            $oldData = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            $query = "UPDATE $table 
                     SET expiration_date = :expiration_date,
                         process_days = :process_days,
                         link_proof = :link_proof,
                         special_description = :special_description,
                         progress = :progress,
                         department = :department,
                         person_accountable = :person_accountable,
                         status = :status,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id";
            
            $stmt = $db->prepare($query);
            
            // Bind all parameters
            $stmt->bindParam(':expiration_date', $data['expiration_date']);
            $stmt->bindParam(':process_days', $data['process_days']);
            $stmt->bindParam(':link_proof', $data['link_proof']);
            $stmt->bindParam(':special_description', $data['special_description']);
            $stmt->bindParam(':progress', $data['progress']);
            $stmt->bindParam(':department', $data['department']);
            $stmt->bindParam(':person_accountable', $data['person_accountable']);
            $stmt->bindParam(':status', $data['status']);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute() && $stmt->rowCount() > 0) {
                $updated = true;
                $updatedTable = $table;
                
                // Prepare new data for audit log
                $newData = [
                    'expiration_date' => $data['expiration_date'],
                    'process_days' => $data['process_days'],
                    'link_proof' => $data['link_proof'],
                    'special_description' => $data['special_description'],
                    'progress' => $data['progress'],
                    'department' => $data['department'],
                    'person_accountable' => $data['person_accountable'],
                    'status' => $data['status']
                ];
                
                // Log the update action using person_accountable from the data
                $logger->logUpdate(
                    $table,
                    $id,
                    $oldData,
                    $newData,
                    $data['person_accountable'], // Use person_accountable from the data
                    $data['department'] // Use department from the data
                );
                
                break;
            }
        } catch (PDOException $e) {
            error_log("Error updating table $table: " . $e->getMessage());
            continue;
        }
    }

    if (!$updated) {
        throw new Exception('Record not found in any table');
    }

    // Clear any output buffer
    ob_clean();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Record updated successfully',
        'table' => $updatedTable
    ]);

} catch (Exception $e) {
    // Clear any output buffer
    ob_clean();
    
    error_log("Error in update_monitoring.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

// End output buffering and send
ob_end_flush();
?> 