<?php
$conn = mysqli_connect("localhost", "root", "", "resepibu3");

function upload(){
    $namaFile = $_FILES['gambar']['name'];          // kenapa ada dua [] karena nilai yang dikembalikan oleh $_FILES adalah array asosiatif multi dimensi
    $ukuranFile = $_FILES['gambar']['size'];        // untuk [] yang pertama yaitu gambar didapat dari nama form gambar pada file tambah.php
    $error = $_FILES['gambar']['error'];            // baris ini untuk mengecek apakah ada gambar yang diupload atau tidak
    $tmpName = $_FILES['gambar']['tmp_name'];       // untuk menampung tempat nama tempat penyimpanan sementara


     // cek apakah tidak ada gambar yang diupload
     if( $error === 4 ){                             // error === 4 adalah tidak ada gambar yang diupload, 1, 2 ,3 , dll memiliki arti yang berbeda beda
         echo "<script>
                 alert ('pilih gambar terlebih dahulu!!'); 
               </script>";                                        // memberi tahu ke user dengan menggunakan javasript untuk pilih gambar dulu
         return false;                                           // setelah pesan nya tampil diberhentikan juga function nya
     }

     // cek apakah yang diupload adalah gambar
     $ekstensiGambarValid = ['jpg', 'jpeg','png'];              // kode ini untuk memberi batasan (ekstensi gambar apa saja yang boleh masuk)
     $ekstensiGambar = explode('.', $namaFile) ;                // mengambil ektensi file // explode berfungsi adalah fungsi untuk memecah sebuah string menjadi array
     $ekstensiGambar = strtolower(end($ekstensiGambar)) ;       // end untuk mengambil yang terakhir (sandika.galih.jpg) nah yang diambil adalah jpg nya // strlower untuk mengubah huruf jadi kecil
     if( !in_array($ekstensiGambar, $ekstensiGambarValid) ){    // mambuat kondisi apakah nilai yang ada di $ekstensiGambar ada di $ekstensiGambarValid // in_array untuk mengecek ada nggak sebuah string di dalam sebuah array dan akan mengembalikan nilai bolean
        echo "<script>
                alert ('Yang Anda upload bukan gambar!!'); 
              </script>";
              return false;
     }

     // cek jika ukuran terlalu besar
     if( $ukuranFile > 5000000){
        echo "<script>
                alert ('Yang Anda upload bukan gambar!!'); 
              </script>";
        return false;
     }


     //lolos pengecekan, gambar siap diupload
     //Generate nama gambar baru
     $namaFileBaru = uniqid();      // uniqid untuk membuat string rondom
     $namaFileBaru .= '.';          // .= untuk merangkai string (sama saja dengan nilai yang ada di "uniqid . '.'")
     $namaFileBaru .= $ekstensiGambar;

     move_uploaded_file ($tmpName, '../../../PROGRES/bebas/tentang_kami/' . $namaFileBaru);         // file yang telah diupload sementara di $tmp_name akan dipindahkan ke tempat sesungguhnya atau tempat tujuannya

     return $namaFileBaru;                                          // nama file direturn untuk mengupload ke database

}


// Fungtion untuk mengubah data guyss - Edit profil
function ubah($data){                                                   //function untuk mengubah data
    global $conn;
                            //tidak diberi htmlspecialchars karena inputan id hidden tidak terlihat user
    $desk = htmlspecialchars($data["deskripsi"]);
    $gambarLama = htmlspecialchars($data["gambarLama"]);            

    //cek apakah user pilih gambar baru atau tidak
    if ($_FILES['gambar']['error'] === 4){
        $gambar = $gambarLama;
    } else{
        $gambar = upload();
    }

    // query insert data
    $query = "UPDATE tentang SET
                desk = '$desk', 
                foto = '$gambar'";                      //diberi WHERE agar semua data yang ada pada database tidak berubah

    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}

$result = mysqli_query($conn, "SELECT * FROM tentang");
$row = mysqli_fetch_assoc($result);


?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Input Kategori</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap" rel="stylesheet">
    <!-- <script src="https://cdn.ckeditor.com/4.20.1/standard/ckeditor.js"></script> -->
</head>
<link rel="stylesheet" href="../kel_kategori/styleinp.css">
<body>
    
<div class="header">
        <nav>
            <img src="../kel_kategori/logobk.png" class="logo">
            <ul class="nav-links">
                <li><a href="../#/#">Kelola User</a></li>
                <li><a href="../kel_kontak/index.php">Kelola Support</a></li>
                <li><a href="../kel_kategori/index.php">Kelola Kategori</a></li>
                <li><a href="../kel_resep/list_resep.php">Kelola Resep</a></li>
                <li><a href="../kel_tentang/index.php">Edit tentang</a></li>
                <li><a href="../kel_tim/index.php">Tim Resep Ibu</a></li>
            </ul>
        </nav>
</div>

<div class="head-judul">
    <h1>Edit Tentang Kami</h1>
    <p>Gunakan input dibawah untuk mengubah data pada tentang kamu</p>
</div>

    <div class="container">
    <form action="" method="POST" enctype="multipart/form-data">

    <input type="hidden" name="gambarLama" value="<?php echo $row["foto"]; ?>">

        <table>
            <tr>
                <td>Gambar Header</td>
            </tr>
            <tr>
                <td><input type="file" name="gambar"></td>
            </tr>
            <tr>
                <td>Deskripsi Tentang Kami</td>
            </tr>
            <tr>
                <td><textarea name="deskripsi" id="deskripsi" rows="10" cols="80"></textarea></td>
            </tr>
            <tr class="btn">
                <td><input type="submit" name="upload" value="Upload"></td>
            </tr>
        </table>
    </form>
    <!-- <script>
        CKEDITOR.replace( "deskripsi", {
            filebrowserUploadUrl: "imglangkah.php",
            filebrowserUploadMethod : "form"
        });
    </script> -->
    </div>


</body>
</html>

<?php

// var_dump($_POST["submit"]);
    if(isset($_POST["upload"])){
    
        // var_dump($_POST);
        if(ubah($_POST) > 0){
            echo "
            <script>
                alert('data berhasil diubah!');
                document.location.href = 'index.php'
            </script>";
            } else {
                echo "
                <script>
                alert('data gagal diubah!');
                document.location.href = 'index.php'
            </script>";
        }
    }
?>