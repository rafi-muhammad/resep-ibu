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

                    <div class="card-container">
 <?php 
                                $conn = mysqli_connect("localhost", "root", "", "resepibu3");
                                $perHal   = 4;
                                $data     = mysqli_query($conn, "SELECT * FROM resep WHERE status_resep = 0") ;
                                $jmlBaris = mysqli_num_rows($data);
                                $jmlpage  = ceil($jmlBaris / $perHal);
                                if(isset($_GET['halaman'])){
                                    $halamanaktif = $_GET['halaman']; 
                                }else{
                                    $halamanaktif = 1;
                                }
                                $awal = ($halamanaktif * $perHal) - $perHal;
                                $no = $awal + 1;
                                $resep = mysqli_query($conn, "SELECT user.id_user, user.nama_user, resep.id_resep, resep.judul_resep, resep.foto_menu, resep.viewers FROM resep JOIN user USING (id_user) WHERE status_resep = 0 LIMIT $awal, $perHal");
                                if(mysqli_num_rows($resep) > 0){
                                while($row = mysqli_fetch_array($resep)){
                            ?>

                                    <div class="card">

                                        <div class="foto-resep">
                                            <img src="../../PROGRES/upload_resep/img/<?= $row['foto_menu'];?>" alt="" style = "   border-radius: 0px;">
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
                                        <br>
                                        <!-- Ratting Close -->
                                    </div>
                            <?php }}else{ ?>
                                <tr>
                                    <td colspan="8">Tidak ada data</td>
                                </tr>
                            <?php }?>
                                        
                    </div>
                    <div class="pagecenter">
                            <div class="page" style = "display: inline-block;">
                                <?php if($halamanaktif > 1){?>
                                    <a href="?halaman=<?php echo $halamanaktif - 1 ?>" 
                                    style = "color: black;
                                      float: left;
                                      padding: 8px 16px;
                                      text-decoration: none;
                                      color: white;" >&laquo;</a>
                                <?php }?>
                                    <!-- NAVIGASI -->  
                                    <?php $i = $no + 1;  ?>
                                    <?php for($i = 1; $i <= $jmlpage; $i++){?>
                                        <?php if( $i == $halamanaktif){?>
                                         <a href="?halaman=<?php echo $i;?>" class="active" 
                                         style = "color: black;
                                                  float: left;
                                                  padding: 8px 16px;
                                                  text-decoration: none;
                                                  color: white;">
                                         <?php echo $i;?></a>
                                        <?php } else{ ?>
                                        <a href="?halaman=<?php echo $i;?>" 
                                            style = "color: black;
                                            float: left;
                                            padding: 8px 16px;
                                            text-decoration: none;
                                            color: white;">
                                        <?php echo $i;?></a>
                                        <?php }?>
                                    <?php } ?>        
                                <?php if($halamanaktif < $jmlpage){?>
                                    <a href="?halaman=<?php echo $halamanaktif + 1 ?>" 
                                        style = "color: black;
                                        float: left;
                                        padding: 8px 16px;
                                        text-decoration: none;
                                        color: white;">
                                    &raquo;</a>
                                <?php }?>                        
                                     <!-- NAVIGASI -->
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