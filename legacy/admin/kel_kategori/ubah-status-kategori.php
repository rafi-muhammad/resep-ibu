<?php
require "../functions.php";

$status = $_GET["status"];

$pengunjung = mysqli_query($conn, "UPDATE kategori SET status_kategori =$status WHERE id_kategori='$_GET[id_kategori]'");

if ($pengunjung){
    echo "<script>alert('Status visitor berhasil diubah');</script>";
    echo "<meta http-equiv='refresh' content='1;url=index.php'>";
}
?>