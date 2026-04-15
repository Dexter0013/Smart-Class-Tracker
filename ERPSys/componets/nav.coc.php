<?php
// Navbar Component
// Usage: Set $navItems array and $navBasePath before including this file
// Example:
// $navItems = [
//     ['label' => 'Home', 'url' => 'index.php', 'class' => ''],
//     ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => 'is-active']
// ];
// $navBasePath = '../'; // or '' for root


$navBasePath = isset($navBasePath) ? $navBasePath : '';
$navItems = isset($navItems) ? $navItems : [];
$showLogo = isset($showLogo) ? $showLogo : true;
?>
<nav class="navbar" role="navigation" aria-label="main navigation" style="position:sticky; top:0; z-index:100; background-color:white;">
    <div class="navbar-brand">
        <?php if ($showLogo): ?>
    <?php
// Navbar Component
// Usage: Set $navItems array and $navBasePath before including this file
// Example:
// $navItems = [
//     ['label' => 'Home', 'url' => 'index.php', 'class' => ''],
//     ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => 'is-active']
// ];
// $navBasePath = '../'; // or '' for root

$navBasePath = isset($navBasePath) ? $navBasePath : '';
$navItems = isset($navItems) ? $navItems : [];
$showLogo = isset($showLogo) ? $showLogo : true;
?>



        <?php
            // Redirect to dashboard if logged in, otherwise to home
            $logoLink = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] 
                ? (isset($dashboardUrl) ? $dashboardUrl : $navBasePath . 'dashboard.php')
                : $navBasePath . 'index.php';
            ?>
            <a class="navbar-item" style="position:sticky; top:0;" href="<?php echo $logoLink; ?>">
                <img src="<?php echo $navBasePath; ?>images/logoNew.png" alt="Barak Valley Engineering College Logo" class="navbar-logo">
            </a>
        <?php endif; ?>
        
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>
    
    <div id="navbarMenu" class="navbar-menu">
        <div class="navbar-start">
            <?php foreach ($navItems as $item): ?>
                <?php
                // If this is the Dashboard link and dashboardUrl is set, use it
                $itemUrl = $item['url'];
                if (strtolower($item['label']) == 'dashboard' && isset($dashboardUrl)) {
                    $itemUrl = $dashboardUrl;
                }
                ?>
                <a class="navbar-item <?php echo isset($item['class']) ? $item['class'] : ''; ?>" 
                   href="<?php echo $navBasePath . $itemUrl; ?>">
                    <?php echo htmlspecialchars($item['label']); ?>
                </a>
            <?php endforeach; ?>
        </div>
        
        <div class="navbar-end">
            <?php if (isset($_SESSION['logged_in']) && $_SESSION['logged_in']): ?>
                <div class="navbar-item">
                    <div class="buttons">
                        <span class="button is-static">
                            <?php echo htmlspecialchars($_SESSION['username'] ?? 'User'); ?>
                        </span>
                        <?php if (isset($logoutUrl)): ?>
                            <a href="<?php echo $navBasePath . $logoutUrl; ?>" class="button is-danger">
                                Logout
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            <?php else: ?>
                <?php if (isset($loginUrl)): ?>
                    <div class="navbar-item">
                        <a href="<?php echo $navBasePath . $loginUrl; ?>" class="button is-primary">
                            Login
                        </a>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </div>
</nav>


