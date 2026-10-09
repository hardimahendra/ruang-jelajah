# Ruang Jelajah — Design Context

## Product

Ruang Jelajah adalah katalog lanskap Indonesia berbasis konten live Unsplash. Detail foto menampilkan lokasi hanya ketika metadata Unsplash menyediakannya, serta memberi atribusi langsung kepada fotografer.

## Visual direction

- **Subject:** jurnal lapangan untuk melihat lanskap dan konteks tempatnya.
- **Audience:** pelancong Indonesia yang ingin mengumpulkan referensi lokasi secara jujur.
- **Signature:** kartu editorial membuka lembar metadata lokasi dengan bayangan bata-oranye.
- **Palette:** `--cream #f1ede3`, `--ink #1d2927`, `--sand #d8c7ac`, `--ember #d96042`, `--mist #bdc6bd`.
- **Typography:** Arial untuk navigasi dan data; Georgia untuk narasi dan ritme perjalanan.
- **Runtime ownership:** token utama berada di `app/globals.css`; detail overlay berada di `app/details.css` dan hanya memakai nilai visual yang sama.

## Content rule

Lokasi tidak pernah ditebak dari gambar atau dari lokasi akun fotografer. Kartu hanya terbit bila metadata foto memuat lokasi; detail menautkan sumber foto serta fotografer di Unsplash.
