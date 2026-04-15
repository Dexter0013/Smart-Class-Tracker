<?php
session_start();
require_once '../componets/conc.com.php';
$activeTable = isset($_GET['table']) ? $_GET['table'] : '';

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}
$tableName = isset($_GET['table']) ? mysqli_real_escape_string($conn, $_GET['table']) : '';

if (empty($tableName)) {
    header("Location: dashboard.php");
    exit();
}
$pageTitle = "View Table - " . htmlspecialchars($tableName);
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => ''],
    ['label' => 'View Table', 'url' => '#', 'class' => 'is-active']
];
$logoutUrl = 'admin/logout.php';
$dashboardUrl = './dashboard.php';
require_once '../componets/header.com.php';
?>
<section class="section is-flex">
<?php require_once '../componets/side.coc.php'; ?>
    <div class="container" style="margin-left:20px; width:100%;">
        <div class="dashboard-header">
            <div class="level">
                <div class="level-left">
                    <h1 class="title is-2">Table: <?php echo htmlspecialchars($tableName); ?></h1>
                </div>
                <div class="level-right">
                    <a href="manage_table.php?table=<?php echo urlencode($tableName); ?>&action=create" class="button is-success">Add New Record</a>
                    <a href="dashboard.php" class="button is-primary">Back to Dashboard</a>
                </div>
            </div>
        </div>
        
        <?php
        // Get all data from the specified table
        $query = "SELECT * FROM `$tableName`";
        $result = mysqli_query($conn, $query);
        
        if ($result && mysqli_num_rows($result) > 0) {
            echo "<div class='table-container'>";
            echo "<table class='table is-striped is-fullwidth is-hoverable'>";
            echo "<thead><tr>";
            
            // Get column names and primary key
            $fields = mysqli_fetch_fields($result);
            $primaryKey = '';
            $fieldNames = [];
            foreach ($fields as $field) {
                $fieldNames[] = $field->name;
                if ($field->flags & MYSQLI_PRI_KEY_FLAG) {
                    $primaryKey = $field->name;
                }
                echo "<th>" . htmlspecialchars($field->name) . "</th>";
            }
            echo "<th>Actions</th>";
            echo "</tr></thead><tbody>";
            
            // Reset result pointer
            mysqli_data_seek($result, 0);
            
            // Display table data
            while ($row = mysqli_fetch_assoc($result)) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>" . htmlspecialchars($value ?? '') . "</td>";
                }
                // Add Edit and Delete buttons
                if ($primaryKey && isset($row[$primaryKey])) {
                    $primaryValue = $row[$primaryKey];
                    echo "<td>";
                    echo "<a href='manage_table.php?table=" . urlencode($tableName) . "&action=edit&id=" . urlencode($primaryValue) . "' class='button is-small is-warning'>Edit</a> ";
                    echo "<a href='manage_table.php?table=" . urlencode($tableName) . "&action=delete&id=" . urlencode($primaryValue) . "' class='button is-small is-danger' onclick=\"return confirm('Are you sure you want to delete this record?');\">Delete</a>";
                    echo "</td>";
                } else {
                    echo "<td>-</td>";
                }
                echo "</tr>";
            }
            
            echo "</tbody></table></div>";
        } else {
            echo "<div class='notification is-warning empty-state'>No data found in this table.</div>";
        }
        ?>
    </div>
</section>
</body>
</html>

