<?php
session_start();
require_once '../componets/conc.com.php';

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

$pageTitle = "My Courses";
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
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) $student_id = $row['StudentID'];
$stmt->close();

// 2. Fetch Courses
$query = "
    SELECT c.CourseCode, c.CourseName, c.Credits, cl.Schedule, cl.Location, i.InstructorName, e.FinalGrade
    FROM enrollments e
    JOIN classes cl ON e.ClassID = cl.ClassID
    JOIN courses c ON cl.CourseID = c.CourseID
    JOIN instructors i ON cl.InstructorID = i.InstructorID
    WHERE e.StudentID = ?
";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$courses = $stmt->get_result();
?>

<section class="section">
    <div class="container">
        <div class="columns is-variable is-gapless-mobile">
            <!-- SIDEBAR -->
            <div class="column is-narrow is-hidden-mobile" style="width: 20%;">
                <aside class="menu box is-hidden-mobile">
                    <p class="menu-label">Student Options</p>
                    <ul class="menu-list">
                        <li><a href="dashboard.php">Overview</a></li>
                        <li><a href="view_profile.php">View Profile</a></li>
                        <li><a href="view_courses.php" class="is-active">View Courses</a></li>
                        <li><a href="view_grades.php">View Grades</a></li>
                        <li><a style="background-color: var(--alert-red);color:white;" href="print_profile.php">Print Information</a></li>
                    </ul>
                </aside>
            </div>

            <!-- CONTENT -->
            <div class="column">
                <h1 class="title is-4">My Enrolled Courses</h1>
                
                <?php if ($courses && $courses->num_rows > 0): ?>
                    <div class="columns is-multiline">
                        <?php while ($row = $courses->fetch_assoc()): ?>
                        <div class="column is-12">
                            <div class="card">
                                <div class="card-content">
                                    <div class="level">
                                        <div class="level-left">
                                            <div>
                                                <p class="title is-5">
                                                    <?php echo htmlspecialchars($row['CourseCode']); ?>: 
                                                    <?php echo htmlspecialchars($row['CourseName']); ?>
                                                </p><br>
                                                <p class="subtitle is-6 has-text-grey">
                                                    Instructor: <?php echo htmlspecialchars($row['InstructorName']); ?>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="level-right">
                                            <span class="tag is-info is-light is-medium">
                                                <?php echo htmlspecialchars($row['Credits']); ?> Credits
                                            </span>
                                        </div>
                                    </div>
                                    <div class="content mt-3">
                                        <div class="tags are-medium">
                                            <span class="tag is-white">📅 <?php echo htmlspecialchars($row['Schedule']); ?></span>
                                            <span class="tag is-white">📍 <?php echo htmlspecialchars($row['Location']); ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endwhile; ?>
                    </div>
                <?php else: ?>
                    <div class="notification is-warning">You are not currently enrolled in any courses.</div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
</body>
</html>
