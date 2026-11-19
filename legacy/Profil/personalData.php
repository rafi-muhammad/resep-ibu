<?php

session_start();

require "../Functions/functions.php";


if(!isset($_SESSION["login"])){
    header("Location: ../Homepage/homepage.php");
    exit;
}

$id = $_SESSION["id_user"];
$result = mysqli_query($conn, "SELECT * FROM user WHERE id_user = '$id'");
$row = mysqli_fetch_assoc($result);


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tampilan Tentang Kamu</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">
<style>
body {
  font-family: "Nunito", sans-serif;
  margin: 0;
}
</style>
<link rel="stylesheet" href="../style/style.css">
</head>
<body class="profilpage">


    <!-- Navigation -->
    <header>
        <nav>
            <a href="../Homepage/homepage.php"><img src="../WebAset/Logo.png" class="logo"></a>

            <ul class="nav-links">
                <li><a href='../ResepPopuler/resepPopuler.php'>Resep terpopuler</a></li>
                <li><a href='../../PROGRES/bebas/kategori/kategori.php'>Kategori resep</a></li>
                <li><a href='../../PROGRES/bebas/tentang_kami/tentangkami.php'>Tentang kami</a></li>
                <li><a href='../../PROGRES/bebas/kontak_kami/kontak.php'>Hubungi kami</a></li>
            </ul>

            <div class='nav-profil'>
            
                    <img class='nav-profil-photo' src='../../Resepibu/UserProfil/<?php echo $row['profil_user']; ?>' alt=''>
                
                    <div class='nav-profil-detail'>
                        <a class='nav-profil-name' href='../../Resepibu/Profil/personalData.php' > <?php echo $row['nama_user']; ?> </a>
                        <a class='nav-profil-email' href='../../Resepibu/Profil/personalData.php' > <?php echo $row['email_user']; ?> </a>
                    </div>
                    
                </div> 
            
        </nav>
    </header>
    <!-- Navigation Close -->

    
    
    <!-- Profil -->
    
    <div class="conteiner-profil">

        <!-- Kotak kiri -->    
            <div class="kotak-kiri">
                
                <div class="profil">
                    <img src="../UserProfil/<?php echo $row['profil_user']; ?>" alt="">
                    <div class="profil-teks">
                        <a href="#"><b><?php echo $row['nama_user']; ?></b></a>
                        <a href="mailto: sutisnabhr@gmail.com"><?php echo $row['email_user']; ?></a>
                    </div>
                </div>
                    
                
                <div class="profil-list">
                    
                    <div class="profil-data" style="background-color: #eee;">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.6838 25.213L23.2171 24.041C22.9811 23.4463 22.6145 22.913 22.1451 22.4783L22.0598 22.3997C21.3211 21.7143 20.3505 21.333 19.3425 21.333H12.6571C11.6491 21.333 10.6785 21.7143 9.93845 22.3983L9.85312 22.4783C9.38379 22.913 9.01845 23.4463 8.78112 24.041L8.31445 25.213" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19.3 9.92934C21.1225 11.7518 21.1225 14.7066 19.3 16.529C17.4775 18.3515 14.5228 18.3515 12.7003 16.529C10.8779 14.7066 10.8779 11.7518 12.7003 9.92934C14.5228 8.10689 17.4775 8.10689 19.3 9.92934" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M24.4853 7.51472C29.1715 12.201 29.1715 19.799 24.4853 24.4853C19.799 29.1715 12.201 29.1715 7.51472 24.4853C2.82843 19.799 2.82843 12.201 7.51472 7.51472C12.201 2.82843 19.799 2.82843 24.4853 7.51472" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                            
                        <a href="personalData.php">Personal Data</a>
                    </div>
                        
                    <div class="profil-password">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2222 15.5278C19.1815 14.6918 19.6871 13.3438 19.3089 11.9051C18.9997 10.7265 18.0391 9.76379 16.8648 9.45712C14.5188 8.84379 12.4104 10.6065 12.4104 12.8638C12.4104 13.9291 12.8814 14.8825 13.6245 15.5291C13.8302 15.7078 13.935 15.9758 13.8594 16.2398L12.6519 20.4851C12.5311 20.9091 12.8496 21.3331 13.2901 21.3331H18.5552C18.9958 21.3331 19.3155 20.9158 19.1948 20.4891C18.8551 19.2945 18.2461 17.1505 17.986 16.2358C17.9104 15.9731 18.0165 15.7065 18.2222 15.5278V15.5278Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9227 27.333C22.5181 27.333 27.8648 21.9604 27.8648 15.333C27.8648 8.70559 22.5181 3.33301 15.9227 3.33301C9.32734 3.33301 3.98071 8.70559 3.98071 15.333C3.98071 21.9604 9.32734 27.333 15.9227 27.333Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>


                        <a href="editPassword.php">Ubah Password</a>
                    </div>

                    <div class="profil-shere-recipe">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2917 12.9787C11.5158 13.4069 8.66312 16.6017 8.66357 20.4018V20.874C10.3035 18.8981 12.7243 17.7367 15.2917 17.694V20.1857C15.2918 20.5474 15.4985 20.8772 15.8238 21.0351C16.1492 21.1929 16.5362 21.1511 16.8203 20.9274L22.9895 16.0547C23.2088 15.8822 23.3368 15.6187 23.3368 15.3397C23.3368 15.0608 23.2088 14.7972 22.9895 14.6248L16.8203 9.74539C16.5362 9.52165 16.1492 9.47983 15.8238 9.6377C15.4985 9.79556 15.2918 10.1254 15.2917 10.487V12.9787Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <rect x="3.99512" y="3.99512" width="24.01" height="24.01" rx="4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>



                        <a href="../../PROGRES/upload_resep/resepdibagi.php">Resep yang dibagikan</a>
                    </div>

                    <div class="profil-whishlist-recipe">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.66284 26.0044V9.33077C6.66284 7.12071 8.45445 5.3291 10.6645 5.3291H21.3356C23.5457 5.3291 25.3373 7.12071 25.3373 9.33077V26.0044C25.3375 26.2544 25.1978 26.4836 24.9755 26.598C24.7532 26.7124 24.4855 26.6928 24.2822 26.5473L16.3882 20.9076C16.1561 20.7415 15.844 20.7415 15.6119 20.9076L7.71795 26.5459C7.51481 26.6913 7.24747 26.711 7.02523 26.5969C6.803 26.4829 6.66314 26.2542 6.66284 26.0044Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>


                        <a href="../../PROGRES/simpan-resep/resepdisimpan.php">Resep yang disimpan</a>
                    </div>

                    <div class="profil-logout">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4H24C26.2091 4 28 5.79086 28 8V24C28 26.2091 26.2091 28 24 28H8C5.79086 28 4 26.2091 4 24V8C4 5.79086 5.79086 4 8 4Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16 22.6118V9.3875C16 8.25074 15.3577 7.21155 14.341 6.70318L9.78885 4.42718C8.54891 3.80721 7.07637 3.87346 5.8971 4.60227C4.71784 5.33108 4.00002 6.61852 4 8.00482V23.9945C4 25.3808 4.71781 26.6683 5.89708 27.3971C7.07634 28.1259 8.5489 28.1922 9.78885 27.5722L14.341 25.2961C15.3577 24.7878 16 23.7486 16 22.6118V22.6118Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.9999 14.667V17.3337" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        
                        <a href="logout.php">Logout</a>
                    </div>

                </div>
            </div>
        


        <!-- Kotak Kanan -->
        <div class="kotak-kanan">
            
                    <h3>Personal Data</h3>
                    <hr>

                    <div class="input-profil">
                        <form action="" method="post" enctype = "multipart/form-data">

                            <input type="hidden" name="id" value="<?php echo $id; ?>">
                            <input type="hidden" name="gambarLama" value="<?php echo $row["profil_user"]; ?>">

                            <div class="input-photo-profil">
                                <img src="../UserProfil/<?php echo $row['profil_user']; ?>" alt="" style="width: 100px; height: 100px;">
                                <input type="file" name="gambar">         <!-- Belum ada nama nya -->
                            </div>

                            <div class="input-profil-content">
                                <label for="nama">Nama Lengkap</label>
                                <input type="text" id="nama" name="nama" value="<?php echo $row['nama_user']; ?>">
                            </div>
                            
                            <div class="input-profil-content">
                                <label for="jk">Jenis Kelamain</label>
                                <input type="text" id="jk" name="jk" value="<?php echo $row['jk_user']; ?>">
                            </div>
                            
                            <div class="input-profil-content">
                                <label for="tgl_lhr">Tanggal Lahir</label>
                                <input type="text" id="tgl_lhr" name="tgl_lhr" value="<?php echo $row['tgl_lhr_user']; ?>">
                            </div>
                            
                            <button type="submit" name="submit">Ubah</button>
                        </form>
                    </div>
                </div>

            </div>

    <!-- Profil Close -->
    
</body>
</html>


<?php

// var_dump($_POST["submit"]);
    if(isset($_POST["submit"])){
    
        // var_dump($_POST);
        if(ubah($_POST) > 0){
            echo "
            <script>
                alert('data berhasil diubah!');
                document.location.href = 'personalData.php'
            </script>";
            } else {
                echo "
                <script>
                alert('data gagal diubah!');
                document.location.href = 'personalData.php'
            </script>";
        }
    }
?>