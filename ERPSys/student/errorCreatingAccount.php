<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Creating Account</title>
</head>
<body>
    <section class="section">
        <div class="container">
            <div class="notification is-danger has-text-centered">
                <h1 class="title is-3">Error Creating Account</h1>
                <p>There was an error creating your account. Please try again later.</p>
                <br>
                <?php
                $error = $_GET['error'] ?? 'Unknown error';
echo htmlspecialchars($error); ?>
                <a href="index.php" class="button is-link">Go to Login Page</a>
            </div>
        </div>
    </section>
</body>
</html>