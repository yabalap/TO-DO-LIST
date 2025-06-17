<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';

try {
    // Validate ID parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        throw new Exception('ID parameter is required');
    }

    $id = $_GET['id'];

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

    $foundData = null;
    $foundTable = null;

    // Search for the record in each table
    foreach ($tables as $table) {
        $query = "SELECT 
                    id,
                    type,
                    department,
                    description,
                    person_accountable as personAccountable,
                    renewal_frequency as renewalFrequency,
                    status,
                    link_proof as linkProof,
                    validity_date as validityDate,
                    due_date as dueDate,
                    expiration_date as expirationDate,
                    uploaded_at as uploadedDate,
                    updated_at as updatedDate,
                    progress,
                    special_description
                  FROM $table 
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            $foundData = $data;
            $foundTable = $table;
            break;
        }
    }

    if (!$foundData) {
        throw new Exception('Record not found');
    }

    // Add table name to the data
    $foundData['table_name'] = $foundTable;

    // Return the data
    echo json_encode([
        'success' => true,
        'data' => $foundData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 