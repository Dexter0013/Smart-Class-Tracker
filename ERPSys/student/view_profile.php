<?php
session_start();
require_once '../componets/conc.com.php';

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

$pageTitle = "My Profile";
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => '']
];
$logoutUrl = 'student/logout.php';
$dashboardUrl = './dashboard.php';
require_once '../componets/header.com.php';

// 1. Get Student ID
$current_user_id = $_SESSION['user_id'];
$student_id = null;
$stmt = $conn->prepare("SELECT StudentID FROM studentusers WHERE UserID = ?");
$stmt->bind_param("i", $current_user_id);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) $student_id = $row['StudentID'];
$stmt->close();

// 2. Fetch Profile Data
$profile_query = "
    SELECT s.*, d.DepartmentName 
    FROM students s
    LEFT JOIN departments d ON s.Major_DepartmentID = d.DepartmentID
    WHERE s.StudentID = ?
";
$stmt = $conn->prepare($profile_query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$profile = $stmt->get_result()->fetch_assoc();
?>

<section class="section">
    <div class="container">
        <div class="columns">
            <!-- SIDEBAR -->
            <div class="column is-narrow is-3">
                <aside class="menu box">
                    <p class="menu-label">Student Options</p>
                    <ul class="menu-list">
                        <li><a href="dashboard.php">Overview</a></li>
                        <li><a href="view_profile.php" class="is-active">View Profile</a></li>
                        <li><a href="view_courses.php">View Courses</a></li>
                        <li><a href="view_grades.php">View Grades</a></li>
                        <li><a style="background-color: var(--alert-red);color:white;" href="print_profile.php">Print Information</a></li>
                    </ul>
                </aside>
            </div>

            <!-- CONTENT -->
            <div class="column">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">My Personal Information</p>
                    </header>
                    <div class="card-content">
                        <?php if ($profile): ?>
                        <div class="content">
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <label class="label">Full Name</label>
                                    <p class="box"><?php echo htmlspecialchars($profile['Name']); ?></p>
                                </div>
                                <div class="column is-6">
                                    <label class="label">RollNo</label>
                                    <p class="box"><?php echo htmlspecialchars($profile['StudentID']); ?></p>
                                </div>
                                <div class="column is-6">
                                    <label class="label">Email Address</label>
                                    <p class="box"><?php echo htmlspecialchars($profile['Email']); ?></p>
                                </div>
                                <div class="column is-6">
                                    <label class="label">Phone Number</label>
                                    <p class="box"><?php echo htmlspecialchars($profile['PhoneNumber'] ?? 'N/A'); ?></p>
                                </div>
                                <div class="column is-6">
                                    <label class="label">Department / Major</label>
                                    <p class="box has-background-info-light has-text-info-dark">
                                        <?php echo htmlspecialchars($profile['DepartmentName'] ?? 'Undeclared'); ?>
                                    </p>
                                </div>
                                <div class="column is-6">
                                    <label class="label">Date of Birth</label>
                                    <p class="box"><?php echo htmlspecialchars($profile['DateOfBirth']); ?></p>
                                </div>
                                <div class="column is-6">
                                    <label class="label">Enrollment Date</label>
                                    <p class="box"><?php echo htmlspecialchars($profile['EnrollmentDate']); ?></p>
                                </div>
                            </div>
                        </div>
                        <?php else: ?>
                            <div class="notification is-danger">Profile not found.</div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>
