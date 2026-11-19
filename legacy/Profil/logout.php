<?php
session_start();        // memulai session
$_SESSION = [];         // Untuk menghapus session
session_unset();        // Untuk menghapus session
session_destroy();      // Untuk menghapus session

header("Location: ../Homepage/homepage.php");
exit;

?>