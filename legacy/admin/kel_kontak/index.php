<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>List Support</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../kel_kategori/inpkat.css">
</head>
<link rel="stylesheet" href="admkon.css?v=<?php echo time(); ?>">
<body>
<div class="header">
        <nav>
            <img src="Logo.png" class="logo">
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
<center>

  <h1><b>DAFTAR FEEDBACK</b></h1>
  
<table border="1" width="600">
    <tr>
      <th>ID</th>
      <th>Nama</th>
      <th>Email</th>
      <th>Keluhan</th>
      <th>Action</th>
    </tr>
<?php
    include "connection.php";
    $show = mysqli_query($conn, "SELECT * FROM kontak");
    while ($data = mysqli_fetch_array($show)) {
    ?>
    <tr>
      <td> <?= $data['id_k']; ?> </td>
      <td> <?= $data['nama']; ?> </td>
      <td> <?= $data['email']; ?> </td>
      <td> <?= $data['deskripsi']; ?></td>
      <td>
        <a href="hapus.php?id=<?= $data['id_k'];?>" class="delete">Hapus</a>
      </td>
    </tr>
<?php 
} 
?>
    </table>
  </center>
</body>
</html>