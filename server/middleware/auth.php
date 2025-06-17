<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

function authenticateRequest() {
    // First check session
    if (isSessionValid()) {
        return [
            'authenticated' => true,
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role']
        ];
    }

    // If session is not valid, check JWT
    $headers = getallheaders();
    $jwt = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if (!$jwt) {
        return ['authenticated' => false, 'message' => 'No token provided'];
    }

    try {
        $decoded = JWT::decode($jwt, new Key(JWT_SECRET_KEY, 'HS256'));
        
        // If JWT is valid, set session data
        $userData = [
            'id' => $decoded->data->id,
            'username' => $decoded->data->username,
            'role' => $decoded->data->role
        ];
        setSessionData($userData);

        return [
            'authenticated' => true,
            'user_id' => $decoded->data->id,
            'username' => $decoded->data->username,
            'role' => $decoded->data->role
        ];
    } catch (Exception $e) {
        return ['authenticated' => false, 'message' => 'Invalid token'];
    }
}

function requireAuth() {
    $auth = authenticateRequest();
    
    if (!$auth['authenticated']) {
        http_response_code(401);
        echo json_encode(['message' => $auth['message'] ?? 'Authentication required']);
        exit();
    }
    
    return $auth;
}

function requireRole($allowedRoles) {
    $auth = requireAuth();
    
    if (!in_array($auth['role'], $allowedRoles)) {
        http_response_code(403);
        echo json_encode(['message' => 'Access denied']);
        exit();
    }
    
    return $auth;
}
?> 