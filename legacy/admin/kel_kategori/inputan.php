<?php
require "../functions.php";
if(isset($_POST{"upload"})){
    if(kategori($_POST) > 0){
        echo "<script>
            alert('Berhasil ditambahkan!');
          </script>";

      echo "<meta http-equiv='refresh' content='1;url=index.php'>";
    } else {
        echo mysqli_error($conn);
    }
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Input Kategori</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">

</head>
<link rel="stylesheet" href="styleinp.css">
<body>
    
<div class="header">
        <nav>
            <img src="logobk.png" class="logo">
            <ul class="nav-links">
            <li><a href="../kel_user/kelolauser.php">Kelola User</a></li>
                <li><a href="../kel_kontak/index.php">Kelola Support</a></li>
                <li><a href="../kel_kategori/index.php">Kelola Kategori</a></li>
                <li><a href="../kel_resep/list_resep.php">Kelola Resep</a></li>
                <li><a href="../kel_tentang/index.php">Edit tentang</a></li>
                <li><a href="../kel_tim/index.php">Tim Resep Ibu</a></li>
            </ul>
        </nav>
</div>

<div class="head-judul">
    <h1>Input Kategori</h1>
    <p>Tambahkan Kategori baru untuk Resepibu</p>
</div>

    <div class="container">
    <form action="" method="POST" enctype="multipart/form-data">
        <table>
            <tr>
                <td>Nama Kategori</td>
            </tr>
            <tr>
                <td><input type="text" name="judul"></td>
            </tr>
            <tr>
                <td>Gambar Kategori</td>
            </tr>
            <tr>
                <td><input type="file" name="gambar"></td>
            </tr>
            <tr class="btn">
                <td><input type="submit" name="upload" value="Upload"></td>
            </tr>
        </table>
    </form>
    </div>


</body>
</html>