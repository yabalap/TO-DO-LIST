-- Select the database
USE todo_list;

-- Create employee table
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Create stored procedure to add new employee with user account
DELIMITER //
CREATE PROCEDURE add_employee_with_user(
    IN p_name VARCHAR(100),
    IN p_department VARCHAR(100),
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_role ENUM('admin', 'employee')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error occurred while creating employee and user account';
    END;

    -- Start transaction
    START TRANSACTION;

    -- Validate input parameters
    IF p_name IS NULL OR p_name = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Name cannot be empty';
    END IF;

    IF p_department IS NULL OR p_department = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Department cannot be empty';
    END IF;

    IF p_username IS NULL OR p_username = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Username cannot be empty';
    END IF;

    IF p_password IS NULL OR p_password = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Password cannot be empty';
    END IF;

    -- Check if username already exists
    IF EXISTS (SELECT 1 FROM users WHERE username = p_username) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Username already exists';
    END IF;

    -- Hash password using SHA2
    SET @hashed_password = SHA2(p_password, 256);

    -- Insert into users table
    INSERT INTO users (username, password, role)
    VALUES (p_username, @hashed_password, p_role);
    
    -- Insert into employee table
    INSERT INTO employee (name, department, username)
    VALUES (p_name, p_department, p_username);

    -- Commit transaction
    COMMIT;
END //
DELIMITER ;

-- Create stored procedure to update employee and user
DELIMITER //
CREATE PROCEDURE update_employee_and_user(
    IN p_username VARCHAR(50),
    IN p_name VARCHAR(100),
    IN p_department VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_role ENUM('admin', 'employee')
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error occurred while updating employee and user account';
    END;

    -- Start transaction
    START TRANSACTION;

    -- Check if employee exists
    IF NOT EXISTS (SELECT 1 FROM employee WHERE username = p_username) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Employee not found';
    END IF;

    -- Update employee
    UPDATE employee 
    SET name = COALESCE(p_name, name),
        department = COALESCE(p_department, department)
    WHERE username = p_username;

    -- Update user if password or role is provided
    IF p_password IS NOT NULL AND p_password != '' THEN
        SET @hashed_password = SHA2(p_password, 256);
        UPDATE users 
        SET password = @hashed_password,
            role = COALESCE(p_role, role)
        WHERE username = p_username;
    ELSEIF p_role IS NOT NULL THEN
        UPDATE users 
        SET role = p_role
        WHERE username = p_username;
    END IF;

    -- Commit transaction
    COMMIT;
END //
DELIMITER ;

-- Create stored procedure to delete employee and user
DELIMITER //
CREATE PROCEDURE delete_employee_and_user(
    IN p_username VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error occurred while deleting employee and user account';
    END;

    -- Start transaction
    START TRANSACTION;

    -- Check if employee exists
    IF NOT EXISTS (SELECT 1 FROM employee WHERE username = p_username) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Employee not found';
    END IF;

    -- Delete employee (user will be deleted automatically due to ON DELETE CASCADE)
    DELETE FROM employee WHERE username = p_username;

    -- Commit transaction
    COMMIT;
END //
DELIMITER ;

-- Example usage:
-- Add new employee: CALL add_employee_with_user('John Doe', 'IT Department', 'johndoe', 'password123', 'employee');
-- Update employee: CALL update_employee_and_user('johndoe', 'John Doe Updated', 'HR Department', 'newpassword123', 'admin');
-- Delete employee: CALL delete_employee_and_user('johndoe');