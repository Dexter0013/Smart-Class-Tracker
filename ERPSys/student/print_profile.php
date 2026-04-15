<?php
session_start();
require_once '../componets/conc.com.php';

/* ---------- AUTH CHECK (MATCH DASHBOARD) ---------- */
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

if (!isset($_SESSION['user_id'])) {
    die("Unauthorized: user_id missing");
}

$userID = $_SESSION['user_id'];

/* ---------- FETCH StudentID ---------- */
$stmt = $conn->prepare("
    SELECT StudentID 
    FROM studentusers 
    WHERE UserID = ?
");
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Unauthorized: student mapping missing");
}

$studentID = $result->fetch_assoc()['StudentID'];
$stmt->close();

/* ---------- Profile ---------- */
$profile = $conn->query("
    SELECT * FROM students 
    WHERE StudentID = $studentID
")->fetch_assoc();

/* ---------- Grades---------- */
$stmt = $conn->prepare("
    SELECT 
        c.CourseCode,
        c.CourseName,
        a.AssessmentName,
        sm.MarksObtained,
        a.MaxMarks,
        a.AssessmentDate
    FROM studentmarks sm
    JOIN assessments a ON sm.AssessmentID = a.AssessmentID
    JOIN classes cl ON a.ClassID = cl.ClassID
    JOIN courses c ON cl.CourseID = c.CourseID
    WHERE sm.StudentID = ?
    ORDER BY c.CourseCode, a.AssessmentDate DESC
");
$stmt->bind_param("i", $studentID);
$stmt->execute();
$result = $stmt->get_result();

/* Group by course */
$courses = [];
while ($row = $result->fetch_assoc()) {
    $code = $row['CourseCode'];
    if (!isset($courses[$code])) {
        $courses[$code] = [
            'name' => $row['CourseName'],
            'assessments' => []
        ];
    }
    $courses[$code]['assessments'][] = $row;
}
$stmt->close();
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student Report</title>

    <style>
        body { font-family: Arial, sans-serif; color: #000; }
        h1 { text-align: center; }
        h2 { margin-top: 30px; border-bottom: 1px solid #000; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 6px; }
        .print-btn { margin: 20px 0; }
        @media print { .print-btn { display: none; } }
    </style>
</head>
<body style="background-color: #f0f0f0;">

<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

<div style="text-align: center; margin-bottom: 20px; ">
    <img src="../images/logoNew.png" alt=""  style="max-height: 100px;">
    <h1>Student Report</h1>
</div>

<h2>Profile</h2>
<p><strong>Student ID:</strong> <?= htmlspecialchars($profile['StudentID']) ?></p>
<p><strong>Name:</strong> <?= htmlspecialchars($profile['Name'] ?? '') ?></p>

<h2>Courses & Grades</h2>

<?php foreach ($courses as $code => $course): ?>
    <h3><?= htmlspecialchars($code . ' - ' . $course['name']) ?></h3>
    <table style="border: 2px solid #000; margin-bottom: 30px;border-radius: 8px; overflow: hidden;">
        <tr style="background-color:#73AF6F;">
            <th>Assessment</th>
            <th>Date</th>
            <th>Marks</th>
        </tr>
        <?php foreach ($course['assessments'] as $a): ?>
        <tr>
            <td><?= htmlspecialchars($a['AssessmentName']) ?></td>
            <td><?= htmlspecialchars($a['AssessmentDate']) ?></td>
            <td><?= htmlspecialchars($a['MarksObtained']) ?> / <?= htmlspecialchars($a['MaxMarks']) ?></td>
        </tr>
        <?php endforeach; ?>
    </table>
<?php endforeach; ?>

</body>
</html>
