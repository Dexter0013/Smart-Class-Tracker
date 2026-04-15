<?php
// Start the session to access session variables
session_start();

// Clear all session variables
$_SESSION = array();

// Delete the session cookie if it exists
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', array(
        'expires' => time() - 42000,
        'path' => '/',
        'domain' => '',
        'secure' => false,
        'httponly' => true
    ));
}

// Completely destroy the session
if (session_destroy()) {
    // Redirect to login page after successful session destruction
    header("Location: index.php");
    exit();
} else {
    // If session destruction fails, still redirect
    header("Location: index.php");
    exit();
}
?>

