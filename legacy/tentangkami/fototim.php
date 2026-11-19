<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Input Kategori</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">

</head>
<link rel="stylesheet" href="styletim.css">
<body>
    
<div class="header">
        <nav>
            <img src="logobk.png" class="logo">
            <ul class="nav-links">
                <li><a href="../#/#">Kelola User</a></li>
                <li><a href="../kel_kontak/index.php">Kelola Support</a></li>
                <li><a href="../kel_kategori/index.php">Kelola Kategori</a></li>
                <li><a href="../#/#">Kelola Resep</a></li>
                <li><a href="../#/#">Kelola Tentang Kami</a></li>
            </ul>
        </nav>
</div>

<div class="head-judul">
    <h1>Tambah Anggota Tim</h1>
    <p>Gunakan input dibawah untuk mengubah data pada tentang kamu</p>
</div>

    <div class="container">
    <form action="" method="POST" enctype="multipart/form-data">
        <table>
            <tr>
                <td>Foto Anggota</td>
            </tr>
            <tr>
                <td><input type="file" name="foto_tim"></td>
            </tr>
            <tr>
                 <td>Nama Anggota</td>
            </tr>
            <tr>
                <td><input type="text" name="nama" placeholder="Masukan nama anggota"></td>
            </tr>
            <tr>
                 <td>NIM</td>
            </tr>
            <tr>
                <td><input type="text" name="nim" placeholder="Masukan nim anggota"></td>
            </tr>
 
            <tr class="btn">
                <td><input type="submit" name="upload" value="Upload"></td>
            </tr>
        </table>
    </form>
    </div>

<?php
include "connection.php";

if(isset($_POST['upload'])){

    // menampung inputan dari form
    $foto = $_POST['foto_tim'];
    $nama = $_POST['nama'];
    $nim = $_POST['nim'];

    // ambil data file
    $filename = $_FILES['foto_tim']['name'];
    $tmp_name = $_FILES['foto_tim']['tmp_name'];

    $type1 = explode('.', $filename);
    $type2 = $type1[1];

    $newname = 'anggota'.time().'.'.$type2;

    //tipe yang diizinkan
    $type_file = array('jpg', 'jpeg', 'png');

    // tentukan lokasi file akan dipindahkan
    $dirUpload = dirname(__DIR__)."/gambar/";

    // validasi format
    if(!in_array($type2, $type_file)){
        echo '<script>alert("Format file tidak diizinkan")</script>';
    }else{
        move_uploaded_file($tmp_name, $dirUpload.$newname);
        
        $fotoUpload = "/gambar/" . $newname;

        $insert = "INSERT INTO foto_tim (foto_tim, nama, nim) VALUES ('".$fotoUpload."', '".$nama."', '".$nim."')";
        
        if ($conn->query($insert) === TRUE) {
            echo 'Anggota berhasil diupload';
        } else
            echo "Error: " . $insert . "<br>" . $conn->error;
    }
}
?>
</body>
</html>