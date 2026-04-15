<?php
session_start();
$pageTitle = "Admin Login";
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Admin Login', 'url' => 'index.php', 'class' => 'is-active']
];
$dashboardUrl = 'dashboard.php';
require_once '../componets/header.com.php';
?>
<section class="section">
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-half">
                <h1 class="title is-2 has-text-centered">Admin Login</h1>
                <?php
                if (isset($_SESSION['error'])) {
                    echo "<div class='notification is-danger mb-2'>" . htmlspecialchars($_SESSION['error']) . "</div>";
                    unset($_SESSION['error']);
                }
                ?>
                <div class="box login-form-container">
                    <form action="auth.php" method="POST">
                        <div class="field">
                            <label class="label" for="username">Username</label>
                            <div class="control">
                                <input class="input" type="text" id="username" name="username" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="password">Password</label>
                            <div class="control">
                                <input class="input" type="password" id="password" name="password" required>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button class="button is-primary is-fullwidth" type="submit">Login</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="has-text-centered back-button-container">
                    <a href="../index.php" class="button is-light">Back to Home</a>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
</html>
