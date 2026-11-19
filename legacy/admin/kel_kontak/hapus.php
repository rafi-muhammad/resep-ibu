<?php
include 'connection.php'; // untuk memanggil file koneksi.php

if(isset($_GET['id_k'])){
    $delete = mysqli_query($conn, "DELETE FROM kontak WHERE id_k = '".$_GET['id_k']."' ");
    echo '<script>window.location="index.php"</script>';
}
?>