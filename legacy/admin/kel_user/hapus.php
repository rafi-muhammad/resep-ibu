<?php
require '../functions.php';


$id = $_GET["id"];

if( hapus($id) > 0){                                        //hapus() yang ada pada if itu adalah function yang berasal dari file function.php
    echo "
        <script>
            alert('data berhasil dihapus!');
            document.location.href = 'kelolauser.php';
        </script>
    ";
} else{
    echo "
        <script>
            alert('data gagal dihapus!');
            document.location.href = 'kelolauser.php';
        </script>
    ";
}
?>
