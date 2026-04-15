<?php
session_start();
require_once '../componets/conc.com.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $_SESSION['error'] = "Please fill in all fields";
        header("Location: index.php");
        exit();
    }
    
    $stmt = $conn->prepare("SELECT UserID, Username, PasswordHash FROM users WHERE Username = ? AND Role = 'Admin' LIMIT 1");

    if (!$stmt) {
        $_SESSION['error'] = "Unable to process login right now";
        header("Location: index.php");
        exit();
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && ($user = mysqli_fetch_assoc($result))) {
        $storedPassword = $user['PasswordHash'];
        $isValidPassword = password_verify($password, $storedPassword) || hash_equals($storedPassword, $password);

        if (!$isValidPassword) {
            $_SESSION['error'] = "Invalid username or password";
            $stmt->close();
            header("Location: index.php");
            exit();
        }

        $_SESSION['user_id'] = $user['UserID'];
        $_SESSION['username'] = $user['Username'];
        $_SESSION['logged_in'] = true;
        $_SESSION['role'] = 'Admin';

        $stmt->close();
        header("Location: dashboard.php");
        exit();
    } else {
        $_SESSION['error'] = "Invalid username or password";
        $stmt->close();
        header("Location: index.php");
        exit();
    }
} else {
    header("Location: index.php");
    exit();
}
?>

