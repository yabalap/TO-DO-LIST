<?php
require_once 'config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $db = $database->getConnection();

    // Admin credentials
    $username = 'admin';
    $password = 'admin123';
    $role = 'admin';

    // Hash the password using PHP's password_hash
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // First, check if admin user exists
    $check_query = "SELECT id FROM users WHERE username = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$username]);

    if ($check_stmt->rowCount() > 0) {
        // Update existing admin user
        $query = "UPDATE users SET password = ?, role = ? WHERE username = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$hashed_password, $role, $username]);
        echo "Admin user updated successfully!\n";
    } else {
        // Insert new admin user
        $query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$username, $hashed_password, $role]);
        echo "Admin user created successfully!\n";
    }

    echo "Admin username: " . $username . "\n";
    echo "Admin password: " . $password . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?> 