<?php
session_start();
require_once '../componets/conc.com.php';

// -- Auth check
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: index.php");
    exit();
}

// -- Get table/action/id from GET (sanitized where needed)
$tableName = isset($_GET['table']) ? mysqli_real_escape_string($conn, $_GET['table']) : '';
$action    = isset($_GET['action']) ? $_GET['action'] : ''; // 'create'|'edit'|'delete' (GET view)
$recordId  = isset($_GET['id']) ? mysqli_real_escape_string($conn, $_GET['id']) : '';

// minimal table presence check
if (empty($tableName)) {
    header("Location: dashboard.php");
    exit();
}
$tblCheck = mysqli_query($conn, "SHOW TABLES LIKE '" . mysqli_real_escape_string($conn, $tableName) . "'");
if (!$tblCheck || mysqli_num_rows($tblCheck) == 0) {
    die('Table not found.');
}

// Helper: fetch columns and primary key
function get_table_columns_and_pk($conn, $table) {
    $cols = [];
    $pk = '';
    $res = mysqli_query($conn, "DESCRIBE `" . mysqli_real_escape_string($conn, $table) . "`");
    while ($r = mysqli_fetch_assoc($res)) {
        $cols[] = $r;
        if ($r['Key'] === 'PRI') $pk = $r['Field'];
    }
    // fallback pk
    if (!$pk && count($cols) > 0) $pk = $cols[0]['Field'];
    return [$cols, $pk];
}

list($columnsMeta, $primaryKey) = get_table_columns_and_pk($conn, $tableName);

// Build list of allowed column names for form processing
$allowedCols = array_map(function($c){ return $c['Field']; }, $columnsMeta);

// ---------- HANDLE POST ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // expect action from submit button value
    $postAction = $_POST['action'] ?? '';
    $postTable  = $_POST['table'] ?? '';
    if ($postTable !== $tableName) {
        // sanity check: posted table must match GET table (or you can remove this)
        $_SESSION['error'] = "Table mismatch.";
        header("Location: manage_table.php?table=" . urlencode($tableName) . "&action=" . urlencode($action) . ($recordId ? "&id=" . urlencode($recordId) : ""));
        exit();
    }

    // Filter POST to only allowed columns
    $inputData = [];
    foreach ($_POST as $k => $v) {
        if (in_array($k, $allowedCols, true)) {
            // treat empty string as null? you can change behavior here
            $inputData[$k] = ($v === '') ? null : $v;
        }
    }

    // ---------- CREATE ----------
    if ($postAction === 'create') {
        // Prepare INSERT: only include columns present in $inputData (and allowedCols)
        $cols = array_keys($inputData);
        if (count($cols) === 0) {
            $_SESSION['error'] = "No data provided.";
        } else {
            $placeholders = implode(',', array_fill(0, count($cols), '?'));
            $fieldList = implode(', ', array_map(function($c){ return "`$c`"; }, $cols));
            $sql = "INSERT INTO `" . mysqli_real_escape_string($conn, $tableName) . "` ($fieldList) VALUES ($placeholders)";
            $stmt = mysqli_prepare($conn, $sql);
            if (!$stmt) {
                $_SESSION['error'] = "Prepare failed: " . mysqli_error($conn);
            } else {
                // bind all as strings (use 's' for each param)
                $types = str_repeat('s', count($cols));
                $values = array_map(function($v){ return ($v === null) ? null : (string)$v; }, array_values($inputData));
                $refs = [];
                foreach ($values as $i => $val) $refs[$i] = &$values[$i];
                array_unshift($refs, $types);
                call_user_func_array([$stmt, 'bind_param'], $refs);
                $exec = $stmt->execute();
                if ($exec) {
                    $_SESSION['success'] = "Record created successfully.";
                } else {
                    $_SESSION['error'] = "Insert failed: " . $stmt->error;
                }
                $stmt->close();
            }
        }
        header("Location: view_table.php?table=" . urlencode($tableName));
        exit();
    }

    // ---------- UPDATE ----------
    if ($postAction === 'update') {
        $id = $_POST['id'] ?? '';
        if ($id === '') {
            $_SESSION['error'] = "Missing record id for update.";
            header("Location: view_table.php?table=" . urlencode($tableName));
            exit();
        }
        $updateCols = array_filter(array_keys($inputData), function($c) use ($primaryKey){ return $c !== $primaryKey; });
        if (count($updateCols) === 0) {
            $_SESSION['error'] = "Nothing to update.";
            header("Location: view_table.php?table=" . urlencode($tableName));
            exit();
        }
        $setParts = [];
        foreach ($updateCols as $c) $setParts[] = "`$c` = ?";
        $sql = "UPDATE `" . mysqli_real_escape_string($conn, $tableName) . "` SET " . implode(', ', $setParts) . " WHERE `" . mysqli_real_escape_string($conn, $primaryKey) . "` = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt) {
            $_SESSION['error'] = "Prepare failed: " . mysqli_error($conn);
            header("Location: view_table.php?table=" . urlencode($tableName));
            exit();
        }
        // bind params: first the update values in order, then id
        $types = str_repeat('s', count($updateCols)) . 's';
        $values = [];
        foreach ($updateCols as $c) $values[] = ($inputData[$c] === null) ? null : (string)$inputData[$c];
        $values[] = (string)$id;
        $refs = [];
        foreach ($values as $i => $val) $refs[$i] = &$values[$i];
        array_unshift($refs, $types);
        call_user_func_array([$stmt, 'bind_param'], $refs);
        $exec = $stmt->execute();
        if ($exec) {
            $_SESSION['success'] = "Record updated successfully.";
        } else {
            $_SESSION['error'] = "Update failed: " . $stmt->error;
        }
        $stmt->close();
        header("Location: view_table.php?table=" . urlencode($tableName));
        exit();
    }

    // ---------- DELETE ---------- //
    if ($postAction === 'delete') {
        $id = $_POST['id'] ?? '';
        if ($id === '') {
            $_SESSION['error'] = "Missing record id for delete.";
            header("Location: view_table.php?table=" . urlencode($tableName));
            exit();
        }
        $sql = "DELETE FROM `" . mysqli_real_escape_string($conn, $tableName) . "` WHERE `" . mysqli_real_escape_string($conn, $primaryKey) . "` = ? LIMIT 1";
        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt) {
            $_SESSION['error'] = "Prepare failed: " . mysqli_error($conn);
            header("Location: view_table.php?table=" . urlencode($tableName));
            exit();
        }
        $stmt->bind_param('s', $id);
        $exec = $stmt->execute();
        if ($exec) {
            $_SESSION['success'] = "Record deleted successfully.";
        } else {
            $_SESSION['error'] = "Delete failed: " . $stmt->error;
        }
        $stmt->close();
        header("Location: view_table.php?table=" . urlencode($tableName));
        exit();
    }

    header("Location: view_table.php?table=" . urlencode($tableName));
    exit();
}

$recordData = [];
if ($action === 'edit' && $recordId !== '') {
    $sql = "SELECT * FROM `" . mysqli_real_escape_string($conn, $tableName) . "` WHERE `" . mysqli_real_escape_string($conn, $primaryKey) . "` = ? LIMIT 1";
    if ($stmt = mysqli_prepare($conn, $sql)) {
        $stmt->bind_param('s', $recordId);
        $stmt->execute();
        $res = $stmt->get_result();
        $recordData = $res->fetch_assoc() ?: [];
        $stmt->close();
    }
}

$pageTitle = ucfirst($action) . " Record - " . htmlspecialchars($tableName);
$basePath = '../';
$showNavbar = true;
$navItems = [
    ['label' => 'Home', 'url' => '../index.php', 'class' => ''],
    ['label' => 'Dashboard', 'url' => 'dashboard.php', 'class' => ''],
    ['label' => 'View Table', 'url' => 'view_table.php?table=' . urlencode($tableName), 'class' => '']
];
$logoutUrl = 'admin/logout.php';
$dashboardUrl = './dashboard.php';
require_once '../componets/header.com.php';
?>

<section class="section">
    <div class="container">
        <div class="dashboard-header">
            <div class="level">
                <div class="level-left">
                    <h1 class="title is-2"><?php echo ucfirst($action); ?> Record - <?php echo htmlspecialchars($tableName); ?></h1>
                </div>
                <div class="level-right">
                    <a href="view_table.php?table=<?php echo urlencode($tableName); ?>" class="button is-link">Back to Table</a>
                </div>
            </div>
        </div>

        <?php
        if (isset($_SESSION['error'])) {
            echo "<div class='notification is-danger mb-2'>" . htmlspecialchars($_SESSION['error']) . "</div>";
            unset($_SESSION['error']);
        }
        if (isset($_SESSION['success'])) {
            echo "<div class='notification is-success mb-2'>" . htmlspecialchars($_SESSION['success']) . "</div>";
            unset($_SESSION['success']);
        }
        ?>

        <?php if ($action === 'delete'): ?>
            <div class="box">
                <h2 class="title is-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this record?</p>
                <form method="POST" action="manage_table.php?table=<?php echo urlencode($tableName); ?>">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="table" value="<?php echo htmlspecialchars($tableName); ?>">
                    <input type="hidden" name="id" value="<?php echo htmlspecialchars($recordId); ?>">
                    <div class="field is-grouped mt-2">
                        <div class="control">
                            <button type="submit" class="button is-danger">Delete</button>
                        </div>
                        <div class="control">
                            <a href="view_table.php?table=<?php echo urlencode($tableName); ?>" class="button is-light">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        <?php else: ?>
            <div class="box">
                <form method="POST" action="manage_table.php?table=<?php echo urlencode($tableName); ?>">
                    <!-- Do not include an 'action' hidden input. The submit button sets action -->
                    <input type="hidden" name="table" value="<?php echo htmlspecialchars($tableName); ?>">
                    <?php if ($action === 'edit' && $primaryKey): ?>
                        <input type="hidden" name="id" value="<?php echo htmlspecialchars($recordId); ?>">
                    <?php endif; ?>

                    <?php foreach ($columnsMeta as $column): ?>
                        <?php
                        $colName = $column['Field'];
                        // If creating, skip auto-increment primary key fields
                        if ($action === 'create' && $column['Extra'] === 'auto_increment') continue;
                        // For delete form we don't show fields (handled above)
                        ?>
                        <div class="field">
                            <label class="label" for="<?php echo htmlspecialchars($colName); ?>">
                                <?php echo htmlspecialchars($colName); ?>
                                <?php if ($column['Null'] === 'NO' && $column['Key'] !== 'PRI'): ?>
                                    <span class="has-text-danger">*</span>
                                <?php endif; ?>
                            </label>
                            <div class="control">
                                <?php
                                $value = $recordData[$colName] ?? '';
                                $isRequired = ($column['Null'] === 'NO' && $column['Key'] !== 'PRI');

                                // determine input type
                                $type = 'text';
                                if (stripos($column['Type'], 'int') !== false) $type = 'number';
                                elseif (stripos($column['Type'], 'date') !== false) $type = 'date';
                                elseif (stripos($column['Type'], 'time') !== false) $type = 'time';
                                elseif (stripos($column['Type'], 'text') !== false) $type = 'textarea';
                                elseif (stripos($column['Type'], 'enum') !== false) $type = 'text'; // could parse enum options
                                ?>

                                <?php if ($type === 'textarea'): ?>
                                    <textarea class="textarea" id="<?php echo htmlspecialchars($colName); ?>" name="<?php echo htmlspecialchars($colName); ?>" <?php echo $isRequired ? 'required' : ''; ?>><?php echo htmlspecialchars($value); ?></textarea>
                                <?php else: ?>
                                    <input class="input" type="<?php echo htmlspecialchars($type); ?>"
                                           id="<?php echo htmlspecialchars($colName); ?>"
                                           name="<?php echo htmlspecialchars($colName); ?>"
                                           value="<?php echo htmlspecialchars($value); ?>"
                                           <?php echo $isRequired ? 'required' : ''; ?>>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>

                    <div class="field is-grouped mt-2">
                        <div class="control">
                            <?php if ($action === 'edit'): ?>
                                <button type="submit" name="action" value="update" class="button is-primary">Update Record</button>
                            <?php else: ?>
                                <button type="submit" name="action" value="create" class="button is-primary">Create Record</button>
                            <?php endif; ?>
                        </div>
                        <div class="control">
                            <a href="view_table.php?table=<?php echo urlencode($tableName); ?>" class="button is-light">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        <?php endif; ?>
    </div>
</section>
</body>
</html>
