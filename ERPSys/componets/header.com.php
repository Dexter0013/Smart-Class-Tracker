<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) : 'Page'; ?></title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <link rel="stylesheet" href="<?php echo isset($basePath) ? $basePath . 'styles/styles.css' : '../styles/styles.css'; ?>">
</head>
<body>
<?php
// Include navbar if navItems are set or showNavbar is true
if (isset($navItems) || (isset($showNavbar) && $showNavbar)) {
    $navBasePath = isset($basePath) ? $basePath : '';
    // nav.coc.php is in the same directory as header.com.php
    $navPath = __DIR__ . '/nav.coc.php';
    if (file_exists($navPath)) {
        require_once $navPath;
    }
}
?>
