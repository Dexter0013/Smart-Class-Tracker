<?php
$pageTitle = "Home - Navigation";
$basePath = '';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => 'index.php', 'class' => 'is-active']
];
require_once 'componets/header.com.php';
?>
<style>
  body,section {
    background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.1) 100%), url('./images/grad11.jpg');
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: center;
    min-height: 100vh;
    margin: 0;
    padding: 0;
  }
  p { color: white;
        text-align: center;
        padding: 10px;
        font-size: 1.8em; 
        font-weight: bold;}
</style>
<section class="section">
    <div class="container-centered" styles="flex flex-direction: column; align-items: center;">
        <h1 class="title is-1 has-text-centered">Welcome</h1>
        <img src="./images/logoNew.png" alt="BVEC logo" style="display: block; margin-left: auto; margin-right: auto; width: 200px; height: auto;">
        <p>Please select your section:</p>
        <div class="buttons is-centered">
            <a href="admin/" class="button is-primary is-large">Admin</a>
            <a href="student/" class="button is-info is-large">Student</a>
        </div>
    </div>
</section>
</body>
</html>

