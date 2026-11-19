<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">
    <script src="https://cdn.ckeditor.com/4.20.1/standard/ckeditor.js"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<style>
body{
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
<header>
    <nav>
        <a href="homepage.html"><img src="gambar/Group 36.png" class="logo"></a>

        <ul class='nav-links'>
            <li><a href='#' style="color: white;">Resep terpopuler</a></li>
            <li><a href='#' style="color: white;">Kategori resep</a></li>
            <li><a href='#'style="color: white;">Tentang kami</a></li>
            <li><a href='#'style="color: white;">Hubungi kami</a></li>
        </ul>

        <div class='nav-profil'>
    
            <img class='nav-profil-photo' src='gambar/default.jpg' alt=''>
        
            <div class='nav-profil-detail'>
                <a class='nav-profil-name' href='personalData.html' style="color: white;"> Baharudin </a>
                <a class='nav-profil-email' href='personalData.html' style="color: white;"> Baharudin@gmail.com </a>
            </div>
            
        </div>                    
    </nav>
</header>
 <!-- Navigation Close -->
 
    <div class="firstContent-title">
        <h1 style="color: white;">Upload resep untuk para ibu lainnya</h1>
    </div>
        
    <div class="firstContent-text">
        <p style="color: white;">Bagikan resep terbaikmu kepada sesama dengan penuh cinta</p>
    </div>
    
<form action="" method="POST" enctype="multipart/form-data">
    <div class="judul">
        <p style="color: white;"><b>Judul Resep</b></p>
    </div>
        
    <div class="search-container">
        <input class="search-input" type="text" name="judul" placeholder="Masukkan judul resepmu">
    </div>
</div>
<!--First Content Close-->

<!--Second Content-->

    <div class="upload-resep">
        <div class="foto">
            <h3>Foto Resep</h3><br>
            <p>Pilih foto paling jelas dan menarik setiap langkahnya</p><br>
            <div class="card">
                <label><input type="file" id="file" name="gambar">
                    <i class="material-icons">add_photo_alternate</i> &nbsp;
                </label>
            </div>
        </div>

        <div class="tentang">
            <h3>Tentang Resep</h3><br>
            <p>Deskripsikan tentang resep yang ingin dibuat</p><br>
            <textarea rows="4" cols="50" name="tentang" placeholder="Contoh: Resep rendang mudah dibuat oleh siapa saja..."></textarea>
        </div>

        <div class="bahan">
            <h3>Bahan Utama</h3><br>
            <p>Cantumkan bahan-bahan yang dibutuhkan untuk membuat resep</p><br>
            <textarea name="bahan" id="bahan"></textarea>  
        </div>

        <div class="cara">
            <h3>Cara Memasak</h3><br>
            <p>Cantumkan foto dan cara memasak untuk membuat resep setiap langkahnya</p><br>
            <textarea name="langkah" id="langkah"></textarea>
        </div>
        <br><br>
        <div class="form-button">
            <button type="submit" name="upload" class="upload">Upload Resep</button>
        </div>
</form>
    <script>
        CKEDITOR.replace( "bahan", {
            filebrowserUploadUrl: "imglangkah.php",
            filebrowserUploadMethod : "form"
        });
        CKEDITOR.replace( "langkah", {
            filebrowserUploadUrl: "imglangkah.php",
            filebrowserUploadMethod : "form"
        });
    </script>
    </div>

</body>
</html>
x

<?php
include "koneksi.php";

function tambah($data){
    global $conn;

    $judul = $data["judul"];
    $tentang = $data["tentang"];
    $bahan = $data["bahan"];
    $langkah = $data["langkah"];

    $gambar = upload();
    if (!$gambar){
        return false;
    }

    $query = "INSERT INTO resep VALUE ('".''."','".$judul."','".$gambar."','".$tentang."','".$bahan."','".$langkah."')";

    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}

function upload(){
    $namaFile = $_FILES["gambar"]["name"];
    $ukuranFile = $_FILES["gambar"]["size"];
    $eror = $_FILES["gambar"]["error"];
    $tmpName = $_FILES["gambar"]["tmp_name"];   

    if($eror === 4 ) //menandakan gambar tidak ada yg diupload
    {
        echo "<script>
                alert ('pilih gambar terlebih dahulu!!'); 
             </script>";
        return false;
    }
    
    $ekstensiGambarValid = ["jpg","jpeg","png"];
    $ekstensiGambar = explode(".", $namaFile); //explode utk mecah string jadi array
    $ekstensiGambar = strtolower(end($ekstensiGambar)); //ubah huruf jd kecil
    
    // tanda (!) = dia cek yg diupload gmbr/bukan 
    if(!in_array($ekstensiGambar, $ekstensiGambarValid)){
        echo "<script>
                alert ('Yang Anda upload bukan gambar!!'); 
             </script>";
        return false;
    } 
    
    if($ukuranFile > 5000000){
        echo "<script>
                alert ('Yang Anda upload bukan gambar!!'); 
             </script>";
        return false;
    }
    
    $namaFileBaru = uniqid(); //utk random nama foto
    $namaFileBaru .= "."; //dikasih titik
    $namaFileBaru .= $ekstensiGambar; //tambahin ekstensi
    
    move_uploaded_file($tmpName, "img/".$namaFileBaru);
    return $namaFileBaru;
}

if(isset($_POST["upload"])){
    // cek apakah data berhasil di tambahkan atau tidak
    if(tambah($_POST) > 0){                                             //tambah() yang ada pada if itu adalah function yang berasal dari file function.php
        echo "
            <script>
                alert('data berhasil ditambahkan!');
            </script>
        ";
    } else {
        echo "
        <script>
            alert('data gagal ditambahkan!');
        </script>
        ";
    }
}



// $sql = "INSERT INTO resep VALUE ('".''."','".$judul."','".$namaFileBaru."','".$tentang."','".$bahan."','".$langkah."')";
// if ($conn->query($sql) === TRUE) {
//     echo "New record created successfully";
//   } else {
//     echo "Error: " . $sql . "<br>" . $conn->error;
//   }
//   $conn->close();
// }
?>