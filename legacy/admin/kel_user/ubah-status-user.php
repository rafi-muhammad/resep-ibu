<?php
require "../functions.php";

$status = $_GET["status"];

$pengunjung = mysqli_query($conn, "UPDATE user SET status_user =$status WHERE id_user='$_GET[id_user]'");

if ($pengunjung){
    echo "<script>alert('Status visitor berhasil diubah');</script>";
    echo "<meta http-equiv='refresh' content='1;url=kelolauser.php'>";
}
?>