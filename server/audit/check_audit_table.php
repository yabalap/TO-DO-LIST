<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Check if audit_logs table exists
    $checkTable = $db->query("SHOW TABLES LIKE 'audit_logs'");
    
    if ($checkTable->rowCount() === 0) {
        // Create audit_logs table
        $createTable = "CREATE TABLE audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_name VARCHAR(255) NOT NULL,
            department VARCHAR(255) NOT NULL,
            action VARCHAR(50) NOT NULL,
            table_name VARCHAR(255) NOT NULL,
            record_id INT NOT NULL,
            changes TEXT,
            ip_address VARCHAR(45),
            INDEX idx_timestamp (timestamp),
            INDEX idx_user_name (user_name),
            INDEX idx_department (department),
            INDEX idx_action (action),
            INDEX idx_table_name (table_name),
            INDEX idx_record_id (record_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->exec($createTable);
        echo "Audit logs table created successfully\n";
    } else {
        echo "Audit logs table already exists\n";
    }

    // Verify table structure
    $columns = $db->query("SHOW COLUMNS FROM audit_logs")->fetchAll(PDO::FETCH_COLUMN);
    echo "Table columns: " . implode(", ", $columns) . "\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?> 