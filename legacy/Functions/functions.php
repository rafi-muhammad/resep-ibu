<?php

$conn = mysqli_connect("localhost", "root", "", "resepibu3");


// Function buat queri di homepage
function query($query) {
    global $conn;
    $result = mysqli_query($conn, $query);
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }

    return $rows;
}


// Function registrasi untuk user mendaftarkan diri
    function registrasi($data) {    // $data diambil dari $_POST pada file registrasi
        global $conn;
        
        $nama = $data["nama"];
        $email = $data["email"];                
        $password = mysqli_real_escape_string($conn, $data['password']);        //mysqli_real_escape_string memungkinkan user memasukan password ada tanda kutip, dan tanda kutipnya dimasukan ke database secara aman
        $password2 = mysqli_real_escape_string($conn, $data['password2']);      //mysqli_real_escape_string harus memiliki 2 parameter (conneksi databasenya dan datanya)

        // cek username sudah ada atau belum
        $result = mysqli_query($conn, "SELECT email_user FROM user WHERE email_user = '$email'"); // mengecek username apakah ada yang duplikat atau tidak
        
        if (mysqli_fetch_assoc($result)){
            echo "<script>
                    alert ('Email yang sudah terdaftar'); 
                </script>";
            
            return false;
        }

        // cek konfirmasi password
        if ($password !== $password2){                                          //melakukan pengecekan apakah password dan password 2 sama atau tidak
            echo "<script>
                    alert ('konfirmasi password tidak sesuai!'); 
                  </script>";
                    
            return false;                                                       // memberhentikan function jika kondisinya salah
        }
        // enkripsi password
        $password = password_hash($password, PASSWORD_DEFAULT);
        
        // tambahkan userbaru ke database
        mysqli_query($conn, "INSERT INTO user VALUES
                            ('', '$nama', '$email', '$password', '', '', 'default.jpg')");

        return mysqli_affected_rows($conn); 
    }



//Function untuk mengupload foto guysss
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
    
         move_uploaded_file ($tmpName, '../UserProfil/' . $namaFileBaru);         // file yang telah diupload sementara di $tmp_name akan dipindahkan ke tempat sesungguhnya atau tempat tujuannya
    
         return $namaFileBaru;                                          // nama file direturn untuk mengupload ke database
    
    }


// Fungtion untuk mengubah data guyss - Edit profil
    function ubah($data){                                                   //function untuk mengubah data
        global $conn;
        // ambil data dari tiap elemen 
        $id = $data["id"];                              //tidak diberi htmlspecialchars karena inputan id hidden tidak terlihat user
        $nama = htmlspecialchars($data["nama"]);
        $jk = htmlspecialchars($data["jk"]);
        $tgl_lhr = htmlspecialchars($data["tgl_lhr"]);
        $gambarLama = htmlspecialchars($data["gambarLama"]);            
    
        //cek apakah user pilih gambar baru atau tidak
        if ($_FILES['gambar']['error'] === 4){
            $gambar = $gambarLama;
        } else{
            $gambar = upload();
        }
    
        // query insert data
        $query = "UPDATE user SET
                    nama_user = '$nama', 
                    jk_user = '$jk',
                    tgl_lhr_user = '$tgl_lhr',
                    profil_user = '$gambar'
                  WHERE id_user = $id ";                      //diberi WHERE agar semua data yang ada pada database tidak berubah
    
        mysqli_query($conn, $query);
    
        return mysqli_affected_rows($conn);
    }



// Function untuk mengubah password guysss
    function ubahPassword($data){
        global $conn;

        $id = $data["id"];
        $CurrentPassword = mysqli_real_escape_string($conn, $data["CurrentPassword"]);
        $password = mysqli_real_escape_string($conn, $data["NewPassword"]);
        $password2 = mysqli_real_escape_string($conn, $data["ConfirmPassword"]);

        $result = mysqli_query($conn, "SELECT * FROM user WHERE id_user = '$id'");
        $row = mysqli_fetch_assoc($result);

        if (!password_verify ($CurrentPassword, $row["pass_user"])){
            
            echo "<script>
                    alert ('Maaf password yang Anda masukan salah'); 
                  </script>";

            return false;
        }

        if ($password !== $password2){
            echo "<script>
                    alert ('konfirmasi password tidak sesuai!'); 
                  </script>";
            
            return false;
        }

        $password = password_hash($password, PASSWORD_DEFAULT);
        $query = "UPDATE user SET pass_user = '$password' WHERE id_user = '$id' ";

        mysqli_query($conn, $query);
        
        return mysqli_affected_rows($conn);


    }




?>