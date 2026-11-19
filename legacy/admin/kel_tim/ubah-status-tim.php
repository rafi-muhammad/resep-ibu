<?php
require "../functions.php";

$status = $_GET["status"];

$pengunjung = mysqli_query($conn, "UPDATE bio_tim SET status_tim =$status WHERE id_tim='$_GET[id_tim]'");

if ($pengunjung){
    echo "<script>alert('Status visitor berhasil diubah');</script>";
    echo "<meta http-equiv='refresh' content='1;url=index.php'>";
}
?>