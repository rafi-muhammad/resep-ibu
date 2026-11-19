<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "resepibu";

//create connection
$conn = new mysqli($servername, $username, $password, $dbname);

//check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }
  else{
  }
?>