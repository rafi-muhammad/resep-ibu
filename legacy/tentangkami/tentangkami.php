<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tentang Kami</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">
    <link rel="shortcut icon" href="favic.png">

<style>
body {
  font-family: "Nunito", sans-serif;
  margin: 0;
}
</style>
</head>
<link rel="stylesheet" href="styletentang.css">
<body>

<!-- HTML Untuk Header -->
    <div class="header">
        <nav>
            <img src="Logo.png" class="logo">
            <ul class="nav-links">
                <li><a href="">Resep terpopuler</a></li>
                <li><a href="../kategori/kategori.php">Kategori resep</a></li>
                <li><a href="../tentang_kami/tentangkami.php">Tentang kami</a></li>
                <li><a href="../kontak_kami/kontak.php">Hubungi kami</a></li>
            </ul>
            <ul class="CTA">
                <li class="daftar">Daftar akun baru</li>
                <li class="masuk">Masuk</li>
            </ul>
        </nav>

<!-- HTML Untuk Konten #1 -->
<?php
include 'connection.php';

$sql = "SELECT * FROM tentang_desk ";
$tentang = $conn->query($sql);
$row = mysqli_fetch_assoc($tentang);
?>
    <div class="container">
        <tr>
            <img src="http://localhost/webpro<?= $row['foto'] ?>" class="gambar">
        </tr>
        <div class="konten">
            <h1 class="head-konten">Tentang Resep Ibu</h1>
            <p class="p-konten"><?php echo $row['deskripsi']; ?></p>
        </div>
    </div>

    <!-- HTML Untuk Foto Anggota -->
    <div class='profile-ang'>
        <h1 class='head-pro'>Tim dibalik resep ibu</h1>
        <div class="row">
        <div class="card">
            <img src="http://localhost/webpro<?= $rowtim['foto_tim'] ?>" class="gambarc">
            <h3 class='head-tim'><?php echo $rowtim['nama']; ?></h3>
            <p class="p-nim"><?php echo $rowtim['nim']; ?></p>
        </div>

        <div class="card">
            <img src="rafi.png" class="gambarc">
            <h3 class='head-tim'>Rafi Muhammad</h3>
            <p class="p-nim">6701213052</p>
        </div>
        <div class="card">
            <img src="rmt.png" class="gambarc">
            <h3 class='head-tim'>Muhammad Rahmat J.</h3>
            <p class="p-nim">6701213044</p>
        </div>
        </div>
    </div>

    <!-- HTML Untuk Lokasi -->
    <div class='lokasi'>
        <h1 class='head-lok'>Lokasi kami</h1>
        <p class="p-lok">Jl. Telekomunikasi No.1, Sukapura, Kec. Dayeuhkolot,
            <br>
            Kabupaten Bandung, Jawa Barat 40257
            <br>
            WhatsApp No: +62811-1213-1415
        </p>
    </div>

    <!-- HTML Untuk Footer -->
    <div class="footer">
    <footer>
        <img src="Logo.png" class="logo">
        <div class="linkfot">
            <ul>
                <li><a href="">Resep terpopuler</a></li>
                <li><a href="../kategori/kategori.php">Kategori resep</a></li>
                <li><a href="../tentang_kami/tentangkami.php">Tentang kami</a></li>
                <li><a href="../kontak_kami/kontak.php">Hubungi kami</a></li>
            </ul>
        </div>
    </footer>
    <div class="bottom">
        <h3>Copyright © ResepIbu Inc.</h3>
    </div>
    </div>
    </div>
</body>
</html>