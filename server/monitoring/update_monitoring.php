<?php
require_once '../cors.php';

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set content type
header('Content-Type: application/json; charset=UTF-8');

// Only allow PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

require_once '../config/database.php';

try {
    // Get the request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Get the ID from the URL
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if (!$id) {
        throw new Exception('ID is required');
    }

    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

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

    // Try to update in each table
    foreach ($tables as $table) {
        $query = "UPDATE $table 
                 SET expiration_date = :expiration_date,
                     link_proof = :link_proof,
                     special_description = :special_description,
                     progress = :progress,
                     department = :department,
                     person_accountable = :person_accountable,
                     status = :status,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':expiration_date', $data['expiration_date']);
        $stmt->bindParam(':link_proof', $data['link_proof']);
        $stmt->bindParam(':special_description', $data['special_description']);
        $stmt->bindParam(':progress', $data['progress']);
        $stmt->bindParam(':department', $data['department']);
        $stmt->bindParam(':person_accountable', $data['person_accountable']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute() && $stmt->rowCount() > 0) {
            $updated = true;
            break;
        }
    }

    if (!$updated) {
        throw new Exception('Record not found');
    }

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Record updated successfully'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 