<?php

session_start();

require "../Functions/functions.php";


if(isset($_SESSION["login"])){
    $id = $_SESSION["id_user"];
    $result = mysqli_query($conn, "SELECT * FROM user WHERE id_user = '$id'");
    $row = mysqli_fetch_assoc($result);

    // $card = query("SELECT user.id_user, user.nama_user, resep.id_resep, resep.judul_resep, resep.foto_menu, resep.viewers 
    // FROM resep JOIN user USING (id_user)");
    // $rowCard = mysqli_fetch_assoc($card);
    // var_dump($card);
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
<link rel="stylesheet" href="../style/style.css">
<body>


<!-- First Content -->
    <div class="firstContent">

        <!-- Navigation -->
<?php if (isset($_SESSION["login"])) : ?>
    <header>
            <nav>
                <img src='../WebAset/Logo.png' class='logo'>

                <ul class='nav-links'>
                    <li><a href='../ResepPopuler/resepPopuler.php'>Resep terpopuler</a></li>
                    <li><a href='../../PROGRES/bebas/kategori/kategori.php'>Kategori resep</a></li>
                    <li><a href='../../PROGRES/bebas/tentang_kami/tentangkami.php'>Tentang kami</a></li>
                    <li><a href='../../PROGRES/bebas/kontak_kami/kontak.php'>Hubungi kami</a></li>
                </ul>

                <div class='nav-profil'>
            
                    <img class='nav-profil-photo' src='../UserProfil/<?php echo $row['profil_user']; ?>' alt=''>
                
                    <div class='nav-profil-detail'>
                        <a class='nav-profil-name' href='../Profil/personalData.php'> <?php echo $row['nama_user']; ?> </a>
                        <a class='nav-profil-email' href='../Profil/personalData.php'> <?php echo $row['email_user']; ?> </a>
                    </div>
                    
                </div>                    
            </nav>
    </header>

<?php else: ?>
    <header>
            <nav>
                <img src='../WebAset/Logo.png' class='logo'>

                <ul class='nav-links'>
                    <li><a href='../ResepPopuler/resepPopuler.php'>Resep terpopuler</a></li>
                    <li><a href='../../PROGRES/bebas/kategori/kategori.php'>Kategori resep</a></li>
                    <li><a href='../../PROGRES/bebas/tentang_kami/tentangkami.php'>Tentang kami</a></li>
                    <li><a href='../../PROGRES/bebas/kontak_kami/kontak.php'>Hubungi kami</a></li>
                </ul>

                <ul class='CTA'>
                    <li class='daftar'><a href="../Login_Registrasi/registrasi.php">Daftar akun baru</a></li>
                    <li class='masuk'><a href="../Login_Registrasi/login.php" style = "color: white;">Masuk</a></li>
                </ul>
            </nav>
    </header>
<?php endif; ?>
        <!-- Navigation Close -->


        <div class="firstContent-title">
            <h1>Cari ribuan resep dari ratusan ibu di Indonesia</h1>
        </div>
        
        <div class="firstContent-text">
            <p>Cari resep favorit kamu di Resep ibu ada lebih dari 5.000 Resep dari semua pengguna</p>
        </div>
        
        
        <form action="../Search/search.php" method="get">
            <div class="search-container">

                    <input class="search-input" type="text" name="cari" placeholder="Cari resep makanan favorit">

                    <button class="search-button" type="submit" name="search">
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

<div class="secondContent-top">
    <h2>Resep terpopuler</h2>
    <a href="../ResepPopuler/resepPopuler.php">Lihat semua</a>
</div> 

<!-- Card -->

<?php
// require "../Functions/functions.php";
$sqlPopuler = ("SELECT user.id_user, user.nama_user, resep.id_resep, resep.judul_resep, resep.foto_menu, resep.viewers FROM resep JOIN user USING (id_user) WHERE status_resep = 0 ORDER BY viewers DESC LIMIT 5 ");

// var_dump($sql);

$cardResepPoluler = $conn->query($sqlPopuler);

// $hitung = count(mysqli_fetch_assoc($cardResepPoluler));
// echo $hitung;
// var_dump(mysqli_fetch_assoc($cardResepPoluler));
?>
<div class="card-container">
        <?php
        while($row = mysqli_fetch_assoc($cardResepPoluler)){
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



<!-- Kagegori -->
        
        <div class="container_kategori">
            <h2><b>Kategori resep</b></h2>
        
            <?php
                $sql = "SELECT * FROM kategori WHERE status_kategori = 0 limit 6 ";
                $kategori = $conn->query($sql);
            ?>

                <div class="kategori-items">

                        <?php
                            while($row = mysqli_fetch_assoc($kategori)){
                        ?>

                    <div class="kategori-detail">
                        <img src="../../../Resepibu/admin/kel_kategori/gambar/<?= $row['foto'] ?>" alt="">
                        <a href="../../PROGRES/bebas/detilkategori/detilkategori.php?id_kategori=<?= $row['id_kategori']; ?>" style="text-decoration: none; color: black;"><?php echo $row['judul']; ?></a>
                    </div>

                    <?php
                            }
                    ?>

                    <div class="kategori-detail">
                        <img src="img/7. Lainnya.png" alt="">
                        <a href="../../PROGRES/bebas/kategori/kategori.php">Lainnya</a>
                    </div>

                </div>
        </div>

<!-- Kategori close -->
    



<!-- Content 2 -->

<div class="konten2">

        <h2>Semua Resep Masakan</h2>
        <p>Menyediakan semua resep masakan rumahan dari seluruh ibu di Indonesia</p>
            
            <?php
            // require "../Functions/functions.php";
            $sqlAll = ("SELECT user.id_user, user.nama_user, resep.id_resep, resep.judul_resep, resep.foto_menu, resep.viewers FROM resep JOIN user USING (id_user) WHERE status_resep = 0 LIMIT 10 ");

            // var_dump($sql);

            $cardResepAll = $conn->query($sqlAll);
            ?>
            
            
            <div class="card-container">
                    <?php while($row = mysqli_fetch_assoc($cardResepAll)){ ?>
                        <!-- Card 1 -->
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
            
            <div class="button">

                <button><a href="../search/revisi.php" style = "color: white; text-decoration: none;">Lihat semua Resep</a></button>
            </div>

    </div>

<!-- Content 2 Close -->




<!-- Footer -->

<div class="footer">
        <footer>
            <img src="../WebAset/Logo.png" class="logo">
            <div class="linkfot">
                <ul>
                    <li><a href="../ResepPopuler/resepPopuler.php">Resep terpopuler</a></li>
                    <li><a href="../../PROGRES/bebas/kategori/kategori.php">Kategori resep</a></li>
                    <li><a href="../../PROGRES/bebas/tentang_kami/tentangkami.php">Tentang kami</a></li>
                    <li><a href="../../PROGRES/bebas/kontak_kami/kontak.php">Hubungi kami</a></li>
                </ul>
            </div>
        </footer>
        
        <div class="bottom">
            <h3>Copyright © ResepIbu Inc.</h3>
        </div>
    </div>

<!-- Footer Close -->
    
</body>
</html>