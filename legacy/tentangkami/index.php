<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola Kategori</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">

</head>
<link rel="stylesheet" href="inpkat.css">
<body>
<div class="header">
        <nav>
            <img src="Logo.png" class="logo">
            <ul class="nav-links">
                <li><a href="../#/#">Kelola User</a></li>
                <li><a href="../kel_kontak/index.php">Kelola Support</a></li>
                <li><a href="../kel_kategori/index.php">Kelola Kategori</a></li>
                <li><a href="../#/#">Kelola Resep</a></li>
            </ul>
        </nav>
</div>
<button class="btn"><a href="inputan.php">Tambahkan data</a></button>
<table border="1" width="400">
    <tr>
      <th>Judul</th>
      <th>Foto</th>
      <th>Action</th>
    </tr>
<?php
    include "connection.php";
    $show = mysqli_query($conn, "SELECT * FROM tentang_deskripsi");
    while ($data = mysqli_fetch_array($show)) {
    ?>
    <tr>
      <td> <?=$data['deskripsi'];?> </td>
      <td><img src="gambar/<?= $data['foto'];?>" width="100"></td>
      <td>
        <a href="editdeskripsi.php?id=<?= $data['id_tg'];?>">edit</a>
      </td>
    </tr>
<?php 
} 
?>
    </table>
</body>
</html>