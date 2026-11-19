<!-- content 1 -->
<div class="contentdbs">
                <div class="main-contentkat">   
                    <div class="contentkat-box">
                    
                    
                            <?php 
                                $conn = mysqli_connect("localhost", "root", "", "resepibu3");
                                $perHal   = 4;
                                $data     = mysqli_query($conn, "SELECT * FROM resep") ;
                                $jmlBaris = mysqli_num_rows($data);
                                $jmlpage  = ceil($jmlBaris / $perHal);
                                if(isset($_GET['halaman'])){
                                    $halamanaktif = $_GET['halaman']; 
                                }else{
                                    $halamanaktif = 1;
                                }
                                $awal = ($halamanaktif * $perHal) - $perHal;
                                $no = $awal + 1;
                                $resep = mysqli_query($conn, "SELECT user.id_user, user.nama_user, resep.id_resep, resep.judul_resep, resep.foto_menu, resep.viewers FROM resep JOIN user USING (id_user) LIMIT $awal, $perHal");
                                if(mysqli_num_rows($resep) > 0){
                                while($row = mysqli_fetch_array($resep)){
                            ?>

                                    <div class="card">

                                        <div class="foto-resep">
                                            <img src="../../PROGRES/upload_resep/img/<?= $row['foto_menu'];?>" alt="" style = "   border-radius: 0px;">
                                        </div>

                                        <div class="nama-resep">
                                            <a href="#"><b><?php echo $row ['judul_resep']; ?></b></a>
                                        </div>

                                        <div class="penulis">
                                            <a href="#">oleh <?php echo $row ['nama_user']; ?></a>
                                        </div>

                                        <!-- Ratting -->


                                        <div class="kanan">
                                            <a href="../bebas/detailresep/detailresep.php?id_resep=<?= $row['id_resep']; ?>">Lihat Resep</a>
                                        </div>
                                        <br>
                                        <div class="hapus">
                                            <a href="hapus.php?id_resep=<?= $row['id_resep']; ?>">Hapus</a>
                                        </div>
                                        <!-- Ratting Close -->
                                    </div>
                            <?php }}else{ ?>
                                <tr>
                                    <td colspan="8">Tidak ada data</td>
                                </tr>
                            <?php }?>
                                        
                    
                    <div class="pagecenter">
                            <div class="page">
                                <?php if($halamanaktif > 1){?>
                                    <a href="?halaman=<?php echo $halamanaktif - 1 ?>">&laquo;</a>
                                <?php }?>
                                    <!-- NAVIGASI -->  
                                    <?php $i = $no + 1;  ?>
                                    <?php for($i = 1; $i <= $jmlpage; $i++){?>
                                        <?php if( $i == $halamanaktif){?>
                                         <a href="?halaman=<?php echo $i;?>" class="active"><?php echo $i;?></a>
                                        <?php } else{ ?>
                                        <a href="?halaman=<?php echo $i;?>"><?php echo $i;?></a>
                                        <?php }?>
                                    <?php } ?>        
                                <?php if($halamanaktif < $jmlpage){?>
                                    <a href="?halaman=<?php echo $halamanaktif + 1 ?>">&raquo;</a>
                                <?php }?>                        
                                     <!-- NAVIGASI -->
                            </div>

    <!-- content 1 end -->