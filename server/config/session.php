<?php
// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1); // Enable in production with HTTPS
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.gc_maxlifetime', 3600); // 1 hour
ini_set('session.cookie_lifetime', 3600); // 1 hour

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Function to regenerate session ID periodically
function regenerateSession() {
    if (!isset($_SESSION['last_regeneration'])) {
        $_SESSION['last_regeneration'] = time();
    } else {
        $interval = 300; // 5 minutes
        if (time() - $_SESSION['last_regeneration'] >= $interval) {
            session_regenerate_id(true);
            $_SESSION['last_regeneration'] = time();
        }
    }
}

// Function to set session data
function setSessionData($userData) {
    $_SESSION['user_id'] = $userData['id'];
    $_SESSION['username'] = $userData['username'];
    $_SESSION['role'] = $userData['role'];
    $_SESSION['last_activity'] = time();
    regenerateSession();
}

// Function to clear session data
function clearSessionData() {
    session_unset();
    session_destroy();
}

// Function to check if session is valid
function isSessionValid() {
    if (!isset($_SESSION['last_activity'])) {
        return false;
    }
    
    $timeout = 3600; // 1 hour
    if (time() - $_SESSION['last_activity'] > $timeout) {
        clearSessionData();
        return false;
    }
    
    $_SESSION['last_activity'] = time();
    return true;
}
?> 