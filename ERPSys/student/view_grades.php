<?php
session_start();
require_once '../componets/conc.com.php';

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

$pageTitle = "My Grades";
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

// 2. Fetch Marks
$query = "
    SELECT c.CourseCode, c.CourseName, a.AssessmentName, sm.MarksObtained, a.MaxMarks, a.AssessmentDate
    FROM studentmarks sm
    JOIN assessments a ON sm.AssessmentID = a.AssessmentID
    JOIN classes cl ON a.ClassID = cl.ClassID
    JOIN courses c ON cl.CourseID = c.CourseID
    WHERE sm.StudentID = ?
    ORDER BY c.CourseCode, a.AssessmentDate DESC
";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$marks = $stmt->get_result();
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
                        <li><a href="view_profile.php">View Profile</a></li>
                        <li><a href="view_courses.php">View Courses</a></li>
                        <li><a href="view_grades.php" class="is-active">View Grades</a></li>
                        <li><a style="background-color: var(--alert-red);color:white;" href="print_profile.php">Print Information</a></li>
                    </ul>
                </aside>
            </div>

            <!-- CONTENT -->
            <div class="column">
                <h1 class="title is-4">Assessment Results</h1>
                
                <?php if ($marks && $marks->num_rows > 0): ?>
                    <div class="box">
                        <div class="table-container">
                            <table class="table is-fullwidth is-striped is-hoverable">
                                <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Assessment</th>
                                        <th>Date</th>
                                        <th class="has-text-right">Marks</th>
                                        <th class="has-text-centered">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($row = $marks->fetch_assoc()): 
                                        $percent = ($row['MarksObtained'] / $row['MaxMarks']) * 100;
                                        $statusColor = ($percent >= 50) ? 'is-success' : 'is-danger';
                                        $statusText = ($percent >= 50) ? 'PASS' : 'FAIL';
                                    ?>
                                    <tr>
                                        <td>
                                            <strong><?php echo htmlspecialchars($row['CourseCode']); ?></strong>
                                            <br><small class="has-text-grey"><?php echo htmlspecialchars($row['CourseName']); ?></small>
                                        </td>
                                        <td><?php echo htmlspecialchars($row['AssessmentName']); ?></td>
                                        <td><?php echo htmlspecialchars($row['AssessmentDate']); ?></td>
                                        <td class="has-text-right">
                                            <?php echo $row['MarksObtained']; ?> / <?php echo $row['MaxMarks']; ?>
                                        </td>
                                        <td class="has-text-centered">
                                            <span class="tag <?php echo $statusColor; ?> is-light">
                                                <?php echo $statusText; ?> (<?php echo round($percent); ?>%)
                                            </span>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="notification is-light">No assessment records found.</div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
</body>
</html>
