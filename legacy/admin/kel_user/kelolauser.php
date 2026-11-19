<?php 

require '../functions.php';
$user = query("SELECT * FROM user"); // lemari untuk menampung baju //query()  adalah function yang berasal dari file function.php

if (isset($_POST["keyword"])){
    $user = cari($_POST["keyword"]); // kondisinya dimana ketika tombol cari ditekan maka akan ditimbah $mahasiswa dengan value yang ada dibaris ini
}

?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../kel_kategori/inpkat.css">
    
    <style>
body{
    font-family: "Nunito", sans-serif;
}
</style>

    <title>Kelola User</title>
</head>
<body>

<div class="header">
        <nav>
            <img src="../kel_kategori/Logo.png" class="logo">
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
    <h1><b>DAFTAR USER</b></h1>

    


    <br>

    <div class="table-container">

        <table border= '1' cellpadding='10' cellspacing='0'>
            <tr>
                <th>No. </th>
                <th>Nama</th>
                <th>Email</th>
                <th>Password</th>
                <th>Jenis Kelamin</th>
                <th>Tanggal Lahir</th>
                <th>Foto Profil</th>
                <th>Status</th>
                <th>Ubah Status</th>
                <th>Aksi</th>
        </tr>
        
        <?php $i = 1; ?>
        <?php foreach ( $user as $row) : ?>

            <tr>
                <td><?= $i; ?></td>
                <td><?= $row ["nama_user"]; ?></td>
                <td><?= $row ["email_user"]; ?></td>
                <td><?= $row ["pass_user"]; ?></td>
                <td><?= $row ["jk_user"]; ?></td>  <!-- row didapat dari $mahasiswa -->
                <td><?= $row ["tgl_lhr_user"]; ?></td>
                <td>
                    <img src="../../UserProfil/<?php echo $row["profil_user"]; ?>" alt="" width="75">
                </td>
                <td><?= $row ["status_user"]; ?></td>
                <td><?php
                        // status 0 = aktif
                        // status 1 = non-aktif
                        if($row['status_user'] == "0"){
                            echo '<button class="delete"><a href="ubah-status-user.php?id_user='.$row['id_user'].'&status=1">Non-Aktif<a></button>';
                        } else {
                            echo '<button class="edit"><a href="ubah-status-user.php?id_user='.$row['id_user'].'&status=0">Aktif<a></button>';
                        }
                        ?></td>
                <td>
                    <!-- Masih belum kelar -->
                    <a href="hapus.php?id=<?php echo $row["id_user"]; ?>" class="delete">Hapus</a> <!-- untuk syntax lebih pendeknya dapat hapus (php echo dan ganti dengan =) -->
                    <!-- Masih belum kelar -->
                </td>
        </tr>
    </div>

        <?php $i++; ?>
        <?php endforeach; 
        ?>
    </table>

    </center>
</body>
</html>