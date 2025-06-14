-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS todo_list;

-- Select the database
USE todo_list;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user with hashed password
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2y$10$o5yJI9GRMVV6RLN3ExN6H.FZms3g5S0amR2G0lsyQmy9CfYvTG4ym', 'admin'); 