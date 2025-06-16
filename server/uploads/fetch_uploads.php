<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS and JSON response
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Get all tables that store uploads
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

    $allData = [];

    // Fetch data from each table
    foreach ($tables as $table) {
        $query = "SELECT * FROM $table";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add table name to each row
        foreach ($data as &$row) {
            $row['table_name'] = $table;
        }
        
        $allData = array_merge($allData, $data);
    }

    // Return the data
    echo json_encode([
        'success' => true,
        'data' => $allData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 