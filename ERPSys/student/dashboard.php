<?php
session_start();
require_once '../componets/conc.com.php'; // Assuming this contains your $conn (mysqli) connection

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

// Debugging session to identify the issue
if (!isset($_SESSION['user_id']) || !isset($_SESSION['username'])) {
    echo '<div class="notification is-danger">Session variables are not set. Please log in again.</div>';
    exit();
}

// Ensure session is active
if (session_status() !== PHP_SESSION_ACTIVE) {
    echo '<div class="notification is-danger">Session is not active. Ensure session_start() is called at the top of the script.</div>';
    exit();
}

$pageTitle = "Student Dashboard";
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => 'is-active']
];
$logoutUrl = 'student/logout.php';
$dashboardUrl = './dashboard.php';
require_once '../componets/header.com.php';

// ---------------------------------------------------------
// 1. FETCH STUDENT ID (Bridge UserID -> StudentID)
// ---------------------------------------------------------
$current_user_id = $_SESSION['user_id'];
$student_id = null;

$stmt = $conn->prepare("SELECT StudentID FROM studentusers WHERE UserID = ?");
$stmt->bind_param("i", $current_user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $student_id = $row['StudentID'];
} else {
    // Fallback for testing if bridge table is empty
    $student_id = 1; 
}
$stmt->close();

// ---------------------------------------------------------
// 2. FETCH ENROLLED CLASSES (Schedule)
// ---------------------------------------------------------
$schedule_query = "
    SELECT c.CourseCode, c.CourseName, cl.Schedule, cl.Location, i.InstructorName 
    FROM enrollments e
    JOIN classes cl ON e.ClassID = cl.ClassID
    JOIN courses c ON cl.CourseID = c.CourseID
    JOIN instructors i ON cl.InstructorID = i.InstructorID
    WHERE e.StudentID = ?
";
$stmt = $conn->prepare($schedule_query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$schedule_result = $stmt->get_result();

// ---------------------------------------------------------
// 3. FETCH RECENT RESULTS (Marks)
// ---------------------------------------------------------
$marks_query = "
    SELECT c.CourseCode, a.AssessmentName, sm.MarksObtained, a.MaxMarks 
    FROM studentmarks sm
    JOIN assessments a ON sm.AssessmentID = a.AssessmentID
    JOIN classes cl ON a.ClassID = cl.ClassID
    JOIN courses c ON cl.CourseID = c.CourseID
    WHERE sm.StudentID = ?
    ORDER BY a.AssessmentDate DESC LIMIT 5
";
$stmt = $conn->prepare($marks_query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$marks_result = $stmt->get_result();

?>
<section class="section">
    <div class="container">
        <div class="dashboard-header mb-5">
            <div class="level">
                <div class="level-left">
                    <div>
                        <h1 class="title is-2">Student Dashboard</h1>
                        <p class="subtitle">Welcome back, <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong>!</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="columns">
            <!-- SIDEBAR MENU -->
            <div class="column is-narrow is-3">
                <aside class="menu box">
                    <p class="menu-label">Student Options</p>
                    <ul class="menu-list">
                        <li><a href="dashboard.php" class="is-active">Overview</a></li>
                        <li><a href="view_profile.php">View Profile</a></li>
                        <li><a href="view_courses.php">View Courses</a></li>
                        <li><a href="view_grades.php">View Grades</a></li>
                        <li><a style="background-color: var(--alert-red);color:white;" href="print_profile.php">Print Information</a></li>
                    </ul>
                </aside>
            </div>

            <!-- MAIN DASHBOARD CONTENT -->
            <div class="column">
                
                <div class="columns is-multiline">
                    
                    <!-- PANEL 1: MY SCHEDULE -->
                    <div class="column is-12-mobile is-8-tablet">
                        <div class="card" style="height: 100%;">
                            <header class="card-header has-background-info-light">
                                <p class="card-header-title has-text-info-dark">
                                    My Enrolled Classes
                                </p>
                            </header>
                            <div class="card-content">
                                <?php if ($schedule_result && $schedule_result->num_rows > 0): ?>
                                    <div class="table-container">
                                        <table class="table is-striped is-fullwidth is-hoverable is-narrow">
                                            <thead>
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Instructor</th>
                                                    <th>Schedule</th>
                                                    <th>Room</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php while ($row = $schedule_result->fetch_assoc()): ?>
                                                <tr>
                                                    <td>
                                                        <strong><?php echo htmlspecialchars($row['CourseCode']); ?></strong><br>
                                                        <small><?php echo htmlspecialchars($row['CourseName']); ?></small>
                                                    </td>
                                                    <td><?php echo htmlspecialchars($row['InstructorName']); ?></td>
                                                    <td><?php echo htmlspecialchars($row['Schedule']); ?></td>
                                                    <td><?php echo htmlspecialchars($row['Location']); ?></td>
                                                </tr>
                                                <?php endwhile; ?>
                                            </tbody>
                                        </table>
                                    </div>
                                <?php else: ?>
                                    <div class="notification is-light">You are not enrolled in any classes yet.</div>
                                <?php endif; ?>
                            </div>
                            <footer class="card-footer">
                                <a href="view_courses.php" class="card-footer-item">View All Details</a>
                            </footer>
                        </div>
                    </div>

                    <!-- PANEL 2: RECENT MARKS -->
                    <div class="column is-12-mobile is-4-tablet">
                        <div class="card" style="height: 100%;">
                            <header class="card-header has-background-success-light">
                                <p class="card-header-title has-text-success-dark">
                                    Recent Results
                                </p>
                            </header>
                            <div class="card-content">
                                <?php if ($marks_result && $marks_result->num_rows > 0): ?>
                                    <table class="table is-fullwidth is-narrow">
                                        <tbody>
                                            <?php while ($row = $marks_result->fetch_assoc()): 
                                                $percent = ($row['MarksObtained'] / $row['MaxMarks']) * 100;
                                                $tagClass = ($percent >= 50) ? 'is-success' : 'is-danger';
                                            ?>
                                            <tr>
                                                <td>
                                                    <span class="tag is-light"><?php echo htmlspecialchars($row['CourseCode']); ?></span>
                                                    <div style="font-size: 0.85em; margin-top: 2px;"><?php echo htmlspecialchars($row['AssessmentName']); ?></div>
                                                </td>
                                                <td class="has-text-right">
                                                    <span class="tag <?php echo $tagClass; ?> is-light">
                                                        <?php echo $row['MarksObtained']; ?> / <?php echo $row['MaxMarks']; ?>
                                                    </span>
                                                </td>
                                            </tr>
                                            <?php endwhile; ?>
                                        </tbody>
                                    </table>
                                <?php else: ?>
                                    <div class="notification is-light">No recent marks found.</div>
                                <?php endif; ?>
                            </div>
                            <footer class="card-footer">
                                <a href="view_grades.php" class="card-footer-item">View All Grades</a>
                            </footer>
                        </div>
                    </div>

                </div> <!-- end inner columns -->
            </div> <!-- end main column -->
        </div>
    </div>
</section>
</body>
</html>
