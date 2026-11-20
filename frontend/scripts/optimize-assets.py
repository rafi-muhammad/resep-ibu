#!/usr/bin/env python3
"""Konversi aset legacy ke WebP untuk frontend/public/media.

Idempoten: menjalankan ulang menghasilkan berkas dengan nama dan ukuran sama.
Tidak menyentuh legacy/ dan tidak memakai foto stok atau hasil generate.

Jalankan dari mana saja:
    python frontend/scripts/optimize-assets.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

FRONTEND = Path(__file__).resolve().parents[1]
ROOT = FRONTEND.parent
LEGACY = ROOT / "legacy"
MEDIA = FRONTEND / "public" / "media"

BRAND = {
    "logo.png": ("WebAset/Logo.png", "copy"),
    "logo-small.png": ("WebAset/Logobl.png", "copy"),
    "bowl-motif.webp": ("WebAset/Frame105.png", "hero"),
}

# Slug kategori -> berkas tile legacy.
CATEGORIES = {
    "minuman": "Homepage/img/1. Minuman.png",
    "makanan-penutup": "Homepage/img/2. Makanan penutup.png",
    "makanan-berkuah": "Homepage/img/3. Makanan berkuah.png",
    "makanan-pedas": "Homepage/img/4. Makanan Pedas.png",
    "makanan-sehat": "Homepage/img/5. Makanan Sehat.png",
    "olahan-buah": "Homepage/img/6. Olohan Buah.png",
    "lainnya": "Homepage/img/7. Lainnya.png",
}

# Slug resep -> foto legacy. Penempatan demo; bukan klaim isi foto.
# Sumber tidak diketahui lisensinya (lihat docs/audit/asset-inventory.md).
RECIPES = {
    "es-jeruk-peras": "admin/kel_kategori/gambar/63bc324e5b66c.png",
    "wedang-jahe-serai": "admin/kel_resep/img/63be384946884.jpg",
    "teh-lemon-madu": "Homepage/img/1. Minuman.png",
    "pisang-goreng-crispy": "admin/kel_resep/img/63b546a3a8685.jpeg",
    "puding-roti-tawar": "admin/kel_kategori/gambar/63bc377d3ab8e.png",
    "klepon-gula-merah": "admin/kel_resep/img/63be39005599a.jpeg",
    "bolu-kukus-pandan": "admin/kel_resep/img/63bd8815b1b3a.jpeg",
    "soto-ayam-kampung": "admin/kel_resep/img/63bd5f5c0f471.jpg",
    "sayur-lodeh": "admin/kel_resep/img/63bd6cdb62bb6.jpg",
    "sup-bakso-sapi": "admin/kel_kategori/gambar/63bc37126b700.png",
    "rawon-daging": "admin/kel_resep/img/63bd67259cbac.jpg",
    "ayam-geprek-sambal-bawang": "admin/kel_resep/img/63a5d18a1ad4c.jpeg",
    "sambal-goreng-kentang": "admin/kel_kategori/gambar/63bdb0ac93b10.jpg",
    "rendang-daging-sapi": "admin/kel_kategori/gambar/63bc37e4b0b30.png",
    "ikan-tongkol-balado": "admin/kel_kategori/gambar/63c2b1a7dae85.jpeg",
    "gado-gado-sayur": "admin/kel_kategori/gambar/63bc36e46b9b6.png",
    "tumis-kangkung-tempe": "admin/kel_resep/img/63b548353db73.jpg",
    "salad-buah-yogurt": "admin/kel_kategori/gambar/63bc37980b3a6.png",
    "sup-ayam-jagung": "admin/kel_kategori/gambar/63bc37b94a70e.png",
    "es-buah-campur": "admin/kel_resep/img/63be3997f27b0.jpg",
    "mangga-saus-santan": "Homepage/img/6. Olohan Buah.png",
    "rujak-pepaya-muda": "admin/kel_kategori/gambar/63bc3751e3d3a.png",
    "nasi-goreng-kampung": "bagi_Resep/img/63ba837a98a7f.jpg",
    "telur-dadar-padang": "Homepage/img/Makanan.png",
}

AVATARS = {
    "default.webp": "UserProfil/default.jpg",
    "preset-1.webp": "UserProfil/63bcc56c47f24.png",
    "preset-2.webp": "UserProfil/63be6e8185349.jpeg",
    "preset-3.webp": "UserProfil/63be6e949de38.png",
}

# Batas ukuran berdasarkan issue #9.
LIMITS_KB = {"category": 40, "recipe": 120, "hero": 250, "avatar": 60, "copy": None}


def load(path: Path) -> Image.Image:
    with Image.open(path) as opened:
        image = ImageOps.exif_transpose(opened)
        return image.convert("RGB" if opened.format in {"JPEG", "MPO"} else "RGBA")


def save_webp(image: Image.Image, destination: Path, limit_kb: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    for quality in range(86, 54, -4):
        image.save(destination, "WEBP", quality=quality, method=6)
        if destination.stat().st_size <= limit_kb * 1024:
            break


def fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS)


def copy_brand(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(source.read_bytes())


def require(path: Path) -> Path:
    if not path.is_file():
        raise SystemExit(f"Aset sumber tidak ditemukan: {path}")
    return path


def main() -> int:
    written: list[tuple[Path, str]] = []

    for name, (relative, mode) in BRAND.items():
        source = require(LEGACY / relative)
        destination = MEDIA / "brand" / name

        if mode == "copy":
            copy_brand(source, destination)
        else:
            save_webp(load(source), destination, LIMITS_KB["hero"])

        written.append((destination, "brand"))

    for slug, relative in CATEGORIES.items():
        source = require(LEGACY / relative)
        destination = MEDIA / "categories" / f"{slug}.webp"
        save_webp(fit(load(source), (400, 400)), destination, LIMITS_KB["category"])
        written.append((destination, "category"))

    for slug, relative in RECIPES.items():
        source = require(LEGACY / relative)
        destination = MEDIA / "recipes" / f"{slug}.webp"
        save_webp(fit(load(source), (1200, 900)), destination, LIMITS_KB["recipe"])
        written.append((destination, "recipe"))

    for name, relative in AVATARS.items():
        source = require(LEGACY / relative)
        destination = MEDIA / "avatars" / name
        save_webp(fit(load(source), (256, 256)), destination, LIMITS_KB["avatar"])
        written.append((destination, "avatar"))

    total = 0
    for destination, kind in written:
        size = destination.stat().st_size
        total += size
        relative = destination.relative_to(FRONTEND)
        print(f"{size / 1024:7.1f} KB  {kind:8}  {relative}")

    print(f"\n{len(written)} berkas, total {total / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
