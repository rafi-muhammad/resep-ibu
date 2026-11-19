<?php
require "../Functions/functions.php";
session_start();

if(isset($_SESSION["login"])){
    $id = $_SESSION["id_user"];
    $result = mysqli_query($conn, "SELECT * FROM user WHERE id_user = '$id'");
    $row = mysqli_fetch_assoc($result);
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">
    
<style>
body {
  font-family: "Nunito", sans-serif;
  margin: 0;
}
</style>
</head>
<link rel="stylesheet" href="style.css">
<body>


<!-- First Content -->
    <div class="firstContent-search">
  <!-- Navigation -->

  <?php if (isset($_SESSION["login"])) : ?>
    <header>
            <nav>
                <a href="../Homepage/homepage.php"><img src='../WebAset/Logobl.png' class='logo'></a>

                <ul class='nav-links'>
                    <li><a href='../ResepPopuler/resepPopuler.php' style= "color: white;">Resep terpopuler</a></li>
                    <li><a href='../../PROGRES/bebas/kategori/kategori.php' style= "color: white;">Kategori resep</a></li>
                    <li><a href='../../PROGRES/bebas/tentang_kami/tentangkami.php' style= "color: white;">Tentang kami</a></li>
                    <li><a href='../../PROGRES/bebas/kontak_kami/kontak.php' style= "color: white;">Hubungi kami</a></li>
                </ul>

                <div class='nav-profil'>
            
                    <img class='nav-profil-photo' src='../UserProfil/<?php echo $row['profil_user']; ?>' alt=''>
                
                    <div class='nav-profil-detail'>
                        <a class='nav-profil-name' href='../Profil/personalData.php' style= "color: white;"> <?php echo $row['nama_user']; ?> </a>
                        <a class='nav-profil-email' href='../Profil/personalData.php' style= "color: white;"> <?php echo $row['email_user']; ?> </a>
                    </div>
                    
                </div>                    
            </nav>
    </header>

<?php else: ?>
    <header>
            <nav>
            <a href="../Homepage/homepage.php"><img src='../WebAset/Logobl.png' class='logo'></a>

                <ul class='nav-links'>
                    <li><a href='../ResepPopuler/resepPopuler.php' style= "color: white;">Resep terpopuler</a></li>
                    <li><a href='../../PROGRES/bebas/kategori/kategori.php' style= "color: white;">Kategori resep</a></li>
                    <li><a href='../../PROGRES/bebas/tentang_kami/tentangkami.php' style= "color: white;">Tentang kami</a></li>
                    <li><a href='../../PROGRES/bebas/kontak_kami/kontak.php' style= "color: white;">Hubungi kami</a></li>
                </ul>

                <ul class='CTA'>
                    <li class='daftar'><a href="../Login_Registrasi/registrasi.php">Daftar akun baru</a></li>
                    <li class='masuk'><a href="../Login_Registrasi/login.php">Masuk</a></li>
                </ul>
            </nav>
    </header>
<?php endif; ?>

 <!-- Navigation Close -->


<?php

$keyword = $_GET['cari'];
$sql = ("SELECT user.id_user, user.nama_user, resep.id_resep, resep.judul_resep, resep.foto_menu, resep.viewers FROM resep JOIN user USING (id_user) WHERE status_resep = 0 AND resep.judul_resep LIKE '%$keyword%';");
$card = $conn->query($sql);

// $hitung = count(mysqli_fetch_assoc($card));





?>



        <div class="firstContent-title">
            <h1 style="color: white;">Resep yang kamu cari </h1>
        </div>
        
        <div class="firstContent-text">
            <p style="color: white;">Kamu mencari resep “<?= $keyword ?>”</p>
        </div>
        
        
        <form action="../Search/search.php" method="get">
            <div class="search-container">
                <input class="search-input" type="text" name="cari" placeholder="Cari resep makanan favorit" >
                
                <button class="search-button" name="search" type="submit">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16.5879" cy="16.588" r="10.5929" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M30.0051 30.0051L24.0776 24.0776" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </form>

    </div>

<!-- First Content Close -->




<!-- Second Content -->

<!-- <div class="secondContent-top"> -->


<!-- Card -->

     <div class="card-container">

        <!-- Card 1 -->
        <?php
        while($row = mysqli_fetch_assoc($card)){
        ?>
    <div class="card">
        <div class="foto-resep">
            <img src="../../PROGRES/upload_resep/img/<?= $row['foto_menu'];?>">
        </div>
                
        <div class="nama-resep">
            <a href="#"><b><?php echo $row ['judul_resep']; ?></b></a>
        </div>
                
        <div class="penulis">
            <a href="#">oleh <?php echo $row ['nama_user']; ?></a>
        </div>
                
                <!-- Ratting -->
        <div class="kanan">
            <a href="../../PROGRES/bebas/detailresep/detailresep.php?id_resep=<?= $row['id_resep']; ?>">Lihat Resep</a>
        </div>
                
                
    </div>
        <?php
        }
        ?>
</div>

        
<!-- Second Content close -->


<!-- Footer -->

<div class="footer">
    <footer>
        <img src="../WebAset/Logo.png" class="logo">
        <div class="linkfot">
            <ul>
                <li><a href="resepmingguini.html">Resep terpopuler</a></li>
                    <li><a href="../Rahmat/kategori/kategori.html">Kategori resep</a></li>
                    <li><a href="../Rahmat/tentangkami/tentangkami.html">Tentang kami</a></li>
                    <li><a href="../Rahmat/kontak/kontak.html">Hubungi kami</a></li>
            </ul>
        </div>
    </footer>
    
    <div class="bottom">
        <h3>Copyright © ResepIbu Inc.</h3>
    </div>
</div>

<!-- Footer close -->
    

    
</body>
</html>