<?php
class Database {
    private $host = "localhost";
    private $db_name = "todo_list";
    private $username = "root";
    private $password = "admin";  // XAMPP default has no password
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
            return $this->conn;
        } catch(PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
}
?> 