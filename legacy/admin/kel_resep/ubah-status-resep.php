<?php
require "../functions.php";

$status = $_GET["status"];

$pengunjung = mysqli_query($conn, "UPDATE resep SET status_resep =$status WHERE id_resep='$_GET[id_resep]'");

if ($pengunjung){
    echo "<script>alert('Status visitor berhasil diubah');</script>";
    echo "<meta http-equiv='refresh' content='1;url=list_resep.php'>";
}
?>