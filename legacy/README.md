# Arsip legacy Resep Ibu

Folder ini berisi situs PHP/MySQL asli **apa adanya**. Isi kode tidak diubah, tidak dirapikan, dan tidak diperbaiki.

## Status

- **Tidak untuk dijalankan di publik.**
- Tidak ada autentikasi atau otorisasi admin.
- Rentan SQL injection, XSS, CSRF, dan upload file tidak aman.
- Tidak ada test, logging, atau penanganan error.
- Dua file mengalami parse error pada PHP 8.5.

## Kredensial

Delapan file berisi kredensial database lokal default:

```text
localhost / root / (password kosong)
```

Nama database yang dipakai tidak konsisten: `resepibu` dan `resepibu3`.

Nilai tersebut adalah default XAMPP, bukan secret aktif, dan tidak memberikan akses ke sistem mana pun. Tetap jangan dipakai ulang. Untuk Phase 2, kredensial harus berasal dari environment variable.

## Integritas

Arsip dipindahkan tanpa perubahan isi. Fingerprint SHA-256 agregat 162 file:

```text
e054d179b4dd8dd92ee74420a4c6a4e1912f855bbf20885b6b4056f183977212
```

File metadata OS (`desktop.ini`, `.DS_Store`) tetap ada di disk untuk kelengkapan arsip, tetapi tidak di-track Git.

## Aset

Foto resep dan avatar berasal dari unggahan pengguna. Status lisensi **UNKNOWN**. Jangan mempublikasikan ulang tanpa izin.
