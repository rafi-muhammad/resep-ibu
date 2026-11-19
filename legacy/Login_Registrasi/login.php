<?php

session_start();
require "../Functions/functions.php";


if ( isset($_POST["Daftar"])){
    
    $email = $_POST["email"];
    $password = $_POST["password"];
    
    $result = mysqli_query($conn, "SELECT * FROM user WHERE email_user = '$email' AND status_user = 0");

    if (mysqli_num_rows($result) === 1){
        
        $row = mysqli_fetch_assoc($result);

        if ( password_verify ($password, $row["pass_user"])){

            $_SESSION["login"] = true;
            $_SESSION["id_user"] = $row["id_user"];

        } else {
            $error = true;
        }
    } else{
        $error = true;
    }
}


if(isset($_SESSION["login"])){
    header("Location: ../Homepage/homepage.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
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
                
                <h2>Log In ke Akun Anda</h2>
                
                <?php if( isset($error)) : ?>
                    <div class="form-content">
                        <label class="form-label">Email</label>
                        <input class="form-input-error" name="email" type="email" placeholder="Masukkan email">
                    </div>
                
                    <div class="form-content">
                        <label class="form-label">Password</label>
                        <input class="form-input-error" name="password" type="password" placeholder="Masukkan password">
                    </div>
                    
                    <a href="#">Lupa Password?</a>

                    <p class="login-error">Maaf, email atau password yang Anda masukan salah</p>

                    <div class="form-button">
                        <button name="Daftar" type="submit" class="button1">Masuk</button>
                    </div>

                <?php else: ?>
                    <div class="form-content">
                        <label class="form-label">Email</label>
                        <input class="form-input" name="email" type="email" placeholder="Masukkan email">
                    </div>
                    
                    <div class="form-content">
                        <label class="form-label">Password</label>
                        <input class="form-input" name="password" type="password" placeholder="Masukkan password">
                    </div>
                    
                    <a href="#">Lupa Password?</a>

                    <div class="form-button">
                        <button name="Daftar" type="submit" class="button1">Masuk</button>
                    </div>

                <?php endif; ?>
            
            </form>
        </div>
    </div>
         
</body>
</html>


