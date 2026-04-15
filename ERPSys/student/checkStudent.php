<?php
session_start();
require_once '../componets/conc.com.php';

/* helper to redirect with error */
function fail($message) {
    header("Location: errorCreatingAccount.php?error=" . urlencode($message));
    exit();
}

/* ---------------- REQUEST METHOD ---------------- */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail("Invalid request method");
}

/* ---------------- INPUT ---------------- */
$studentInput = trim($_POST['roll_number'] ?? '');
$username     = trim($_POST['username'] ?? '');
$password     = trim($_POST['password'] ?? '');
$email        = trim($_POST['email'] ?? '');

/* ---------------- VALIDATION ---------------- */
if ($studentInput === '' || $username === '' || $password === '') {
    fail("Missing required fields");
}

/* ---------------- CHECK STUDENT EXISTS ---------------- */
/* assumes roll_number == StudentID */
$stmt = $conn->prepare(
    "SELECT StudentID FROM students WHERE StudentID = ? LIMIT 1"
);

if (!$stmt) {
    fail("Database error (student check)");
}

$stmt->bind_param("i", $studentInput);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    fail("Student does not exist");
}

$studentID = (int)$result->fetch_assoc()['StudentID'];
$stmt->close();

/* ---------------- CREATE USER ---------------- */
$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$role = 'Student';

/* Email must exist due to DB constraint */
if ($email === '') {
    $email = $username . '@local';
}

$stmt = $conn->prepare(
    "INSERT INTO users 
     (Username, PasswordHash, Role, Email, CreatedAt)
     VALUES (?, ?, ?, ?, NOW())"
);

if (!$stmt) {
    fail("Database error (user create)");
}

$stmt->bind_param("ssss", $username, $passwordHash, $role, $email);

if (!$stmt->execute()) {
    fail("Username or email already exists");
}

$userID = $stmt->insert_id;
$stmt->close();

/* ---------------- MAP STUDENTUSER ---------------- */
$stmt = $conn->prepare(
    "INSERT INTO studentusers (UserID, StudentID)
     VALUES (?, ?)"
);

if (!$stmt) {
    $conn->query("DELETE FROM users WHERE UserID = $userID");
    fail("Database error (student mapping)");
}

$stmt->bind_param("ii", $userID, $studentID);

if (!$stmt->execute()) {
    $conn->query("DELETE FROM users WHERE UserID = $userID");
    fail("Student already has an account");
}

$stmt->close();

/* ---------------- SUCCESS ---------------- */
$_SESSION['user_id'] = $userID;
$_SESSION['username'] = $username;
$_SESSION['logged_in'] = true;
$_SESSION['role'] = 'Student';

header("Location: dashboard.php");
exit();
?>
