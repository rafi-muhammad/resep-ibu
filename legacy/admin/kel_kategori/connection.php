<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "resepibu3";

$con = new mysqli($servername, $username, $password, $dbname);
$conn = mysqli_connect($servername, $username, $password, $dbname);

if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}
?>