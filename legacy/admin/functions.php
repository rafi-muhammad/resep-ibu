<?php
$conn = mysqli_connect("localhost", "root", "", "resepibu3");


function query($query) {
    global $conn;
    $result = mysqli_query($conn, $query);
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }

    return $rows;
}



function hapus($id){                                                    //function untuk menghapus data
    global $conn;
    mysqli_query($conn, "DELETE FROM user WHERE id_user = $id");
    
    return mysqli_affected_rows($conn);
}

function kategoriHapus($id){                                                    //function untuk menghapus data
    global $conn;
    mysqli_query($conn, "DELETE FROM kategori WHERE id_kategori = $id");
    
    return mysqli_affected_rows($conn);
}



function cari($keyword){
    $query = "SELECT * FROM user 
                WHERE nama_user LIKE '%$keyword%' OR
                     jk_user LIKE '%$keyword%' OR
                     tgl_lhr_user LIKE '%$keyword%'";

    return query($query);
}



function kategori($data) {    // $data diambil dari $_POST pada file registrasi
    global $conn;
    
    $nama = $data["judul"];

    $gambar = upload();
    if(!$gambar){
        return false;
    }

    // tambahkan userbaru ke database
    mysqli_query($conn, "INSERT INTO kategori VALUES
                         ('', '$nama', '$gambar', 0)");

    return mysqli_affected_rows($conn);
}



// EDIT PROFIL BORRRRRR

// upload gambar 
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

     move_uploaded_file ($tmpName, 'gambar/' . $namaFileBaru);         // file yang telah diupload sementara di $tmp_name akan dipindahkan ke tempat sesungguhnya atau tempat tujuannya

     return $namaFileBaru;                                          // nama file direturn untuk mengupload ke database

}



//UBAH PROFIL
function ubah($data){                                                   //function untuk mengubah data
    global $conn;
    // ambil data dari tiap elemen 
    $id = $data["id"];                              //tidak diberi htmlspecialchars karena inputan id hidden tidak terlihat user
    $nama = htmlspecialchars($data["nama"]);
    $jk = htmlspecialchars($data["jk"]);
    $tgLahir = htmlspecialchars($data["tgLahir"]);
    $gambarLama = htmlspecialchars($data["gambarLama"]);

    
    // $jurusan = htmlspecialchars($data["jurusan"]);

    //cek apakah user pilih gambar baru atau tidak



    //Jangan lupa diaktifkan kembali

    // if ( $_FILES['gambar']['error'] === 4){
    //     $gambar = $gambarLama;
    // } else{
    //     $gambar = upload();
    // }






    // query insert data
    $query = "UPDATE user SET
                nama_user = '$nama', 
                jk_user = '$jk',
                tgl_lhr_user = '$tgLahir',
                profil_user = '$gambarLama'
              WHERE id_user = $id ";                      //diberi WHERE agar semua data yang ada pada database tidak berubah

    mysqli_query($conn, $query);

    return mysqli_affected_rows($conn);
}



