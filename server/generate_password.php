<?php
$password = "admin123"; // Change this to your desired admin password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
echo "Hashed password for admin: " . $hashed_password;
?> 