
<?php 

require "../functions.php";
$resep = query("SELECT * FROM bio_tim"); 

if (isset($_POST["keyword"])){
    $resep = cari($_POST["keyword"]); // kondisinya dimana ketika tombol cari ditekan maka akan ditimbah $mahasiswa dengan value yang ada dibaris ini
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../kel_kategori/inpkat.css">
    <title>List Resep</title>
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
<button class="btn"><a href="edittim.php">Tambahkan anggota</a></button>
<center>

    <h1><b>DAFTAR TIM</b></h1>
    
    <div class="table-container">
    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
            <th>Nama</th>
            <th>NIM</th>
            <th>Foto Resep</th>
            <th>Status</th>
            <th>Ubah status</th>
            <th>Aksi</th>
        </tr>

        <?php $i = 1; ?>
        <?php foreach ( $resep as $row) : ?>

        <tr>
            <td><?= $row['nama']; ?></td>
            <td><?= $row['nim']; ?></td>
            <td><img src="../../../PROGRES/bebas/tentang_kami/<?php echo $row['foto']; ?>" alt="" width="74"></td>
            <td><?= $row['status_tim']; ?></td>
            <td><?php
                // status 0 = aktif
                // status 1 = non-aktif
                if($row['status_tim'] == "0"){
                    echo '<button class="delete"><a href="ubah-status-tim.php?id_tim='.$row['id_tim'].'&status=1">Non-Aktif<a></button>';
                } else {
                    echo '<button class="edit"><a href="ubah-status-tim.php?id_tim='.$row['id_tim'].'&status=0">Aktif<a></button>';
                }
                ?></td>
            <td><a href="hapus.php?id_tim=<?php echo $row['id_tim'];?>" class="delete">Hapus</a> 
            <!-- <a href="#">Status</a> -->
        </td>
        </tr>

        <?php $i++; ?>
        <?php endforeach; 
        ?>

    </table>
    </div>
    
</center>
</body>
</html>



       
