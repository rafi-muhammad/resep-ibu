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
                <li><a href="../kel_user/kelolauser.php">Kelola User</a></li>
                <li><a href="../kel_kontak/index.php">Kelola Support</a></li>
                <li><a href="../kel_kategori/index.php">Kelola Kategori</a></li>
                <li><a href="../kel_resep/list_resep.php">Kelola Resep</a></li>
                <li><a href="../kel_tentang/index.php">Edit tentang</a></li>
                <li><a href="../kel_tim/index.php">Tim Resep Ibu</a></li>
            </ul>
        </nav>
</div>
<button class="btn"><a href="inputan.php">Tambahkan data</a></button>
<center>

  <h1><b>DAFTAR KATEGORI</b></h1>
  <table border="1" width="400">
    <tr>
      <th>ID</th>
      <th>Judul</th>
      <th>Foto</th>
      <th>Status</th>
      <th>Ubah status</th>
      <th>Action</th>
    </tr>
    <?php
    // include "connection.php";
    require "../functions.php";
    $kategori = query("SELECT * FROM kategori");
    // var_dump($kategori);
?>

  <?php $i = 1; ?>
  <?php foreach ($kategori as $row): ?>
    <tr>
      <td> <?=$row['id_kategori'];?> </td>
      <td> <?=$row['judul'];?> </td>
      <td><img src="gambar/<?= $row['foto'];?>" width="100"></td>
      <td> <?=$row['status_kategori'];?></td>
      <td><?php
            // status 0 = aktif
            // status 1 = non-aktif
            if($row['status_kategori'] == "0"){
                echo '<button class="delete"><a href="ubah-status-kategori.php?id_kategori='.$row['id_kategori'].'&status=1">Non-Aktif<a></button>';
            } else {
                echo '<button class="edit"><a href="ubah-status-kategori.php?id_kategori='.$row['id_kategori'].'&status=0">Aktif<a></button>';
            }
            ?></td>
      <td>
        <a href="hapus.php?id=<?= $row['id_kategori'];?>" class="delete">Hapus</a>
      </td>
    </tr>

    <?php $i++; ?>
        <?php endforeach; 
        ?>

  </table>
</center>
</body>
</html>