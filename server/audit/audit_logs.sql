CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    changes JSON NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_name (user_name),
    INDEX idx_department (department),
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 