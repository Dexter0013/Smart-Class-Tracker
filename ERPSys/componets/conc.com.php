<?php
//$host = "sql302.infinityfree.com";
//$username = "if0_40974628";
//$password = "LacSxZWpY4am5";
//$database = "if0_40974628_student_db";

//$conn = mysqli_connect($host, $username, $password, $database);

//if (!$conn) {
  //  die("Connection failed: " . mysqli_connect_error());
//}

$host = "localhost";
$username = "root";
$password = "";
$database = "studentdb";

$conn = mysqli_connect($host, $username, $password, $database);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>

