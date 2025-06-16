<?php
header('Content-Type: application/json');
require_once '../config/Database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Get all tables
    $tablesQuery = $conn->query("SHOW TABLES");
    $tables = $tablesQuery->fetchAll(PDO::FETCH_COLUMN);
    
    $result = [];
    
    foreach ($tables as $table) {
        // Skip the users table
        if ($table === 'users') continue;
        
        // Get all records from the table
        $query = "SELECT * FROM `$table`";
        $stmt = $conn->query($query);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result[$table] = [
            'count' => count($records),
            'records' => $records
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $result
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 