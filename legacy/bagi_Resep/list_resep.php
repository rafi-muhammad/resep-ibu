
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>List Resep</title>
</head>
<body>

    <h1><b>DAFTAR UPLOAD RESEP</b></h1>

    <form action="" method="post" >
        <div class="search__container">
            <input class="search__input" type="text" name="keyword" autofocus placeholder="Masukan Keyword Pencarian ..." autocomplate="off"> <!-- Autofocus Digunakan untuk input keyword automatis aktif // aoutocomplate untuk rekomendasi keyword (off) -->
            <button type="submit" name="cari">Cari</button>
        </div>      
    </form>

    <div class="table-container">
    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
            <th>ID Resep</th>
            <th>Judul Resep</th>
            <th>Foto Resep 1</th>
            <!-- <th>Foto Resep 2</th>
            <th>Foto Resep 3</th> -->
            <th>Tentang Resep</th>
            <th>Bahan Utama</th>
            <th>Cara Memasak</th>
            <th>Aksi</th>
        </tr>

        <?php
        include "koneksi.php";
        $show = mysqli_query($conn, "SELECT * FROM resep");
        while ($data = mysqli_fetch_array($show)) {
        ?> 

        <tr>
            <td><?= $data['ID_Resep']; ?></td>
            <td><?= $data['judul_resep']; ?></td>
            <td><img src="img/<?php echo $data['foto_menu']; ?>" alt="" width="74"></td>
            <td><?= $data['tentang_resep']; ?></td>
            <td><?= $data['bahan_utama']; ?></td>
            <td><?= $data['cara_masak']; ?></td>
            <td><a href="delete_resep.php?id=<?php echo $data['ID_Resep'];?>">Hapus</a></td>
        </tr>
        <?php } ?>

    </table>
    </div>
    
</body>
</html>

