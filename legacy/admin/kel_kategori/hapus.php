<?php
include 'connection.php'; // untuk memanggil file koneksi.php

if(isset($_GET['id'])){
    $delete = mysqli_query($conn, "DELETE FROM kategori WHERE id_kategori = '".$_GET['id']."' ");
    echo '<script>window.location="index.php"</script>';
}
?>