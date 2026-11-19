<?php

session_start();
require "../Functions/functions.php";

if(isset($_SESSION["login"])){
    header("Location: ../Homepage/homepage.php");
    exit;
}

if(isset($_POST{"Daftar"})){
    if(registrasi($_POST) > 0){
        echo "<script>
                alert('Berhasil ditambahkan!');
              </script>";

              echo "<meta http-equiv='refresh' content='1;url=login.php'>";
    } else {
        echo mysqli_error($conn);
    }

}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrasi</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">
    <link rel="stylesheet" href="../style/style.css">
<style>
body{
    font-family: "Nunito", sans-serif;
    margin: 0;
}
</style>
</head>
<body class="login-registrasi">

  <!-- Navigation -->
        <header>
            <nav>
                <img src="../WebAset/Logo.png" class="logo">

                <ul class="nav-links">
                    <li><a href="">Resep terpopuler</a></li>
                    <li><a href="">Kategori resep</a></li>
                    <li><a href="">Tentang kami</a></li>
                    <li><a href="">Hubungi kami</a></li>
                </ul>

                <ul class="CTA">
                <li class="daftar"><a href="registrasi.php">Daftar akun baru</a> </li>
                    <li class="masuk"><a href="login.php" style = "color: white;">Masuk</a></li>
                </ul>
            </nav>
        </header>
  <!-- Navigation Close -->

    <div class="container">
        
        <div class="form-registrasi">
            
            
            <form action="" method="POST">
                
                <h2>Daftar ke ResepIbu</h2>

                <div class="form-content">
                    <label class="form-label">Nama lengkap</label>
                    <input class="form-input" name="nama" type="text" placeholder="Masukkan nama lengkap">
                </div>
                
                <div class="form-content">
                    <label class="form-label">Email</label>
                    <input class="form-input" name="email" type="email" placeholder="Masukkan email">
                </div>
                
                <div class="form-content">
                    <label class="form-label">Password</label>
                    <input class="form-input" name="password" type="password" placeholder="Masukkan password">
                </div>
                
                <div class="form-content">
                    <label class="form-label">Konfirmasi Password</label>
                    <input class="form-input" name="password2" type="password" placeholder="Masukkan konfirmasi password">
                </div>

                <div class="form-button">
                    <button name="Daftar" type="submit" class="button1">Daftar</button>
                    <p>Atau</p>
                    <button name="DaftarFB" type="submit" class="button2">Daftar melalui Facebook</button>
                </div>
            </form>
        </div>
    </div>
         
</body>
</html>


