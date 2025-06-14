<?php
// JWT Configuration
define('JWT_SECRET_KEY', 'your-super-secret-key-change-this-in-production');
define('JWT_ISSUER', 'todo-list-app');
define('JWT_AUDIENCE', 'todo-list-users');
define('JWT_EXPIRATION', 3600); // 1 hour in seconds
?> 