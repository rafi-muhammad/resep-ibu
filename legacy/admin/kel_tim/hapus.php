<?php
require "../functions.php";
// if(isset($_GET['id_resep'])){ 
$id = $_GET['id_tim'];

// $getdata = mysqli_query($conn, "SELECT foto_menu1,foto_menu2, foto_menu3 FROM resep WHERE id_resep='$id_resep'");
// $data = mysqli_fetch_object($getdata);
// unlink('./img/'.$data->foto_menu1, './img/'.$data->foto_menu2, './img/'.$data->foto_menu3 );

$ambildata = mysqli_query($conn, "DELETE FROM bio_tim WHERE id_tim='$id'");
echo "<meta http-equiv='refresh' content='1;url=index.php'>";
echo "<h5>Data sedang dihapus...<h5>";

// }
?> 