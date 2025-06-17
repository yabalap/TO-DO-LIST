<?php
require_once '../config/cors.php';
require_once '../config/database.php';

class AuditLogger {
    private $pdo;

    public function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }

    public function log($action, $tableName, $recordId, $changes, $userName = null, $department = null) {
        try {
            // Get user info from session if not provided
            if (!$userName || !$department) {
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                $userName = $userName ?? $_SESSION['name'] ?? 'Unknown';
                $department = $department ?? $_SESSION['department'] ?? 'Unknown';
            }

            // Get IP address
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

            $query = "INSERT INTO audit_logs (
                        timestamp,
                        user_name,
                        department,
                        action,
                        table_name,
                        record_id,
                        changes,
                        ip_address
                    ) VALUES (
                        NOW(),
                        :user_name,
                        :department,
                        :action,
                        :table_name,
                        :record_id,
                        :changes,
                        :ip_address
                    )";

            $stmt = $this->pdo->prepare($query);
            
            $stmt->bindParam(':user_name', $userName);
            $stmt->bindParam(':department', $department);
            $stmt->bindParam(':action', $action);
            $stmt->bindParam(':table_name', $tableName);
            $stmt->bindParam(':record_id', $recordId);
            $stmt->bindParam(':changes', $changes);
            $stmt->bindParam(':ip_address', $ipAddress);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Audit logging failed: " . $e->getMessage());
            return false;
        }
    }

    public function logCreate($tableName, $recordId, $data, $userName = null, $department = null) {
        $changes = json_encode([
            'type' => 'create',
            'data' => $data
        ]);
        return $this->log('create', $tableName, $recordId, $changes, $userName, $department);
    }

    public function logUpdate($tableName, $recordId, $oldData, $newData, $userName = null, $department = null) {
        $changes = json_encode([
            'type' => 'update',
            'old_data' => $oldData,
            'new_data' => $newData
        ]);
        return $this->log('update', $tableName, $recordId, $changes, $userName, $department);
    }

    public function logDelete($tableName, $recordId, $data, $userName = null, $department = null) {
        $changes = json_encode([
            'type' => 'delete',
            'data' => $data
        ]);
        return $this->log('delete', $tableName, $recordId, $changes, $userName, $department);
    }

    public function logUpload($tableName, $recordId, $fileInfo, $userName = null, $department = null) {
        $changes = json_encode([
            'type' => 'upload',
            'file_info' => $fileInfo
        ]);
        return $this->log('upload', $tableName, $recordId, $changes, $userName, $department);
    }
}

// Function wrapper for easier use
function logAudit($userName, $department, $action, $tableName, $recordId, $changes, $ipAddress = null) {
    try {
        $logger = new AuditLogger();
        return $logger->log($action, $tableName, $recordId, $changes, $userName, $department);
    } catch (Exception $e) {
        error_log("Error in logAudit function: " . $e->getMessage());
        return false;
    }
}
?> 