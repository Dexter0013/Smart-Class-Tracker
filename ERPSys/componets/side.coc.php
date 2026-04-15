<ul class="panel is-info " style="height:100vh; overflow-y:hidden; padding:10px;margin-right:20px;position:sticky;top:0;margin:0;">
    <h1 class="panel-heading">Tables</h1>

<?php
$activeTable = $activeTable ?? '';
$tablesResult = mysqli_query($conn, "SHOW TABLES");

while ($row = mysqli_fetch_row($tablesResult)) {
    $loopTable = $row[0];

    $isActiveStyle = ($loopTable === $activeTable)
        ? 'background: var(--accent-lightest); font-weight: bold;color: white;'
        : '';
?>
    <li class="panel-block is-hoverable button m-1" style=" <?= $isActiveStyle ?>">
        <a href="view_table.php?table=<?= urlencode($loopTable); ?>"
           class="panel-link mr-5">
            <?= htmlspecialchars(ucfirst($loopTable)); ?>
        </a>
    </li>
<?php } ?>
</ul>
