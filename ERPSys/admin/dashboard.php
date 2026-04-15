<?php
session_start();
require_once '../componets/conc.com.php';

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

$pageTitle = "Admin Dashboard";
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => 'is-active']
];
$logoutUrl = 'admin/logout.php';
$dashboardUrl = './dashboard.php';
require_once '../componets/header.com.php';
?>
<section class="section is-flex">

<?php require_once '../componets/side.coc.php'; ?>
        <div class="container" style="margin-left:20px;">
            <h2 class="title is-4">Select a table from the menu to view and manage its records.</h2>
                    <?php
                    $studentCount = (int)mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS c FROM students"))['c'];
                    $courseCount  = (int)mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS c FROM courses"))['c'];
                    $facultyCount = (int)mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS c FROM instructors"))['c'];
                    ?>

<div class="container">
  <h2 class="title is-4">Overview</h2>

  <div class="columns is-multiline">

    <!-- Students -->
    <div class="column is-12-mobile is-4-tablet is-4-desktop">
      <a href="view_table.php?table=students">
        <div class="card has-background-white has-text-centered p-4 is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
             <figure class="image is-128x128">
            <img src="../images/group-users.png" alt="">
            </figure>
          <div class="card-content">
            <p class="heading">Students</p>
            <p class="title is-3 mb-2"><?= $studentCount ?></p>
            <span class="tag is-primary">View</span>
          </div>
        </div>
      </a>
    </div>

    <!-- Courses -->
    <div class="column is-12-mobile is-4-tablet is-4-desktop">
      <a href="view_table.php?table=courses">
        <div class="card has-background-white has-text-centered p-4 is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
             <figure class="image is-128x128">
            <img src="../images/open-book.png" alt="">
            </figure>
          <div class="card-content">
            <p class="heading">Courses</p>
            <p class="title is-3 mb-2"><?= $courseCount ?></p>
            <span class="tag is-link">View</span>
          </div>
        </div>
      </a>
    </div>

    <!-- Faculty -->
    <div class="column is-12-mobile is-4-tablet is-4-desktop">
      <a href="view_table.php?table=instructors">
        <div class="card has-background-white has-text-centered p-4 is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
            <figure class="image is-128x128">
                <img src="../images/school.png" alt="">
            </figure>
          <div class="card-content">
            <p class="heading">Faculty</p>
            <p class="title is-3 mb-2"><?= $facultyCount ?></p>
            <span class="tag is-info">View</span>
          </div>
        </div>
      </a>
    </div>
</section>
</body>
</html>

