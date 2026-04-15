<?php
session_start();

require_once '../componets/conc.com.php';

/* ---- Page config ---- */
$pageTitle = "Student Create Account";
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Student Create Account', 'url' => 'createStudent.php', 'class' => 'is-active']
];
$dashboardUrl = 'dashboard.php';

/* ---- Layout ---- */
require_once '../componets/header.com.php';
?>

<section class="section">
    <div class="container" style="max-width:420px;margin-top:60px;">
        <div class="box">

            <h1 class="title is-4 has-text-centered">
                Student Registration
            </h1>

            <!-- ✅ FORM MATCHES BACKEND EXACTLY -->
            <form action="checkStudent.php" method="POST">

                <!-- Roll Number -->
                <div class="field">
                    <label class="label">Roll Number</label>
                    <div class="control">
                        <input class="input"
                               type="text"
                               name="roll_number"
                               placeholder="Enter your roll number"
                               required>
                    </div>
                </div>

                <!-- Username -->
                <div class="field">
                    <label class="label">Username</label>
                    <div class="control">
                        <input class="input"
                               type="text"
                               name="username"
                               placeholder="Choose a username"
                               required>
                    </div>
                </div>

                <!-- Password -->
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input"
                               type="password"
                               name="password"
                               placeholder="Create a password"
                               required>
                    </div>
                </div>

                <!-- Submit -->
                <div class="field mt-4">
                    <div class="control">
                        <button class="button is-primary is-fullwidth">
                            Create Account
                        </button>
                    </div>
                </div>

            </form>

            <p class="has-text-centered mt-3">
                <a href="index.php">Back to Login</a>
            </p>

        </div>
    </div>
</section>

