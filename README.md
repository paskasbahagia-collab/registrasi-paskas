# Sistem Registrasi & Rekapitulasi Peserta Paskas Bahagia

Aplikasi web modern, elegan, dan responsif untuk registrasi peserta acara **Silaturahmi Akbar Pasukan Amal Sholeh (PASKAS) Bahagia**. Dilengkapi dengan tampilan landing page dashboard interaktif berestetika tinggi (terinspirasi dari konsep travel showcase slider), sistem pendaftaran Individu & Kelompok (Rombongan), rekapitulasi data lengkap dengan grafik analitik, ekspor Excel/CSV, serta konfigurasi batas waktu (deadline) dan integrasi database **Supabase** & deployment ke **Vercel**.

---

## Fitur Utama

### 1. Dashboard Interaktif (Showcase Slider)
- **Tampilan Hero Mewah**: Desain visual elegan dengan tipografi modern, gradien sinematik, dan partikel glow.
- **Kartu Pilihan Interaktif ("Gambar Kecil")**:
  - Menu kartu miniatur (*Jadwal Acara, Lokasi & Venue, Transportasi, Seragam & Kit, Layanan Medis, Kontak Panitia*).
  - Ketika kartu diklik, muncul jendela modal detail interaktif dengan informasi lengkap dan foto resolusi tinggi.
  - Terdapat tombol **"Kembali ke Dashboard"** yang nyaman dan mulus.
  - Kontrol navigasi slider (`< >`) dengan indikator progress dan nomor urut `01 / 06` seperti pada gambar referensi.
- **Hitung Mundur Batas Waktu (Countdown Timer)**:
  - Menampilkan sisa waktu (Hari : Jam : Menit : Detik) menuju batas akhir pendaftaran.
  - Menampilkan status pendaftaran aktif (*Buka / Tutup*).

### 2. Formulir Registrasi (Individu & Kelompok)
- **Pilihan Registrasi Fleksibel**:
  - **Registrasi Individu**: Pendaftaran untuk 1 orang peserta mandiri.
  - **Registrasi Kelompok / Rombongan**: Pendaftaran rombongan sekaligus (misalnya 1 bus kafilah daerah). Dilengkapi form data koordinator rombongan dan tombol dinamis **"+ Tambah Anggota"**.
- **Kelengkapan Data Peserta**:
  - Nama Lengkap
  - Jenis Kelamin (Laki-laki / Perempuan)
  - Wilayah / Asal Daerah (auto-suggest datalist kota)
  - Nomor WhatsApp
  - Alamat Email Resmi
  - Nomor HP Darurat (Keluarga / Kerabat)
  - Tanggal & Jam Kedatangan
  - Berangkat Menggunakan Kendaraan Apa (*Bus Panitia, Mobil Pribadi, Sepeda Motor, Kereta Api, Pesawat, Elf/HiAce, Kapal Laut, Lainnya*)
  - Tanggal & Jam Kepulangan
  - Pulang Menggunakan Kendaraan Apa
  - Ukuran Baju Seragam (*S, M, L, XL, XXL, 3XL, 4XL*)
  - Riwayat Kesehatan (*Penyakit kambuhan seperti asma, alergi, maag, atau tombol cepat "Alhamdulillah Sehat"*)
  - Catatan Tambahan
- **Perayaan & E-Tiket Digital**:
  - Animasi konfeti saat berhasil mendaftar.
  - Muncul E-Tiket Bukti Pendaftaran digital dengan nomor registrasi unik (misal `PKB-IND-2026-XXXX`), barcode QR, dan tombol cetak langsung.

### 3. Halaman Rekapitulasi Data Peserta
- **Kartu Metrik Ringkasan**:
  - Total Peserta Terdaftar (Individu vs Kelompok)
  - Proporsi Gender (Ikhwan & Akhwat)
  - Jumlah Wilayah yang Berpartisipasi & Wilayah Terbanyak
  - Jumlah Peserta dengan Perhatian Medis Khusus
- **Grafik Analitik Interaktif**:
  - Distribusi Ukuran Baju Seragam (Bar Chart)
  - Pilihan Moda Transportasi Kedatangan (Doughnut Chart)
- **Pencarian & Multi-Filter**:
  - Pencarian instan berdasarkan Nama, Kode Tiket, Wilayah, atau Nomor HP.
  - Filter berdasarkan Jenis Registrasi, Gender, Wilayah, dan Ukuran Baju.
- **Tabel Data Responsif**:
  - Pagination rapi (8 data per halaman).
  - Modal lihat profil peserta lengkap.
  - Tombol hapus data.
- **Ekspor & Cetak**:
  - **Ekspor ke Microsoft Excel (.xlsx)** via SheetJS
  - **Ekspor ke format CSV**
  - **Cetak Rekap (Print Friendly)**

### 4. Pengaturan Sistem & Deadline
- **Batas Waktu Pengisian (Deadline)**:
  - Input tanggal & jam batas akhir registrasi.
  - Saklar manual pendaftaran (Buka / Tutup).
  - Pesan penutupan formulir otomatis saat waktu habis.
- **Koneksi Database Supabase**:
  - Masukkan URL Proyek dan Public Anon Key Supabase langsung di antarmuka web.
  - Tombol *Tes Koneksi* dan *Upload Data Lokal ke Cloud*.
  - **Fallback Otomatis**: Jika Supabase belum diisi, aplikasi langsung aktif menggunakan **LocalStorage** sehingga tidak pernah macet atau error!

---

## Panduan Menjalankan Secara Lokal

Aplikasi dibuat menggunakan **Vanilla HTML5, CSS3, dan JavaScript modern** tanpa perlu instalasi Node.js atau build tools yang rumit!

1. Cukup buka file `index.html` langsung di browser favorit Anda (Google Chrome, Microsoft Edge, Firefox, Safari).
2. Atau jalankan ekstensi **Live Server** di VS Code / Antigravity IDE jika diinginkan.

---

## Panduan Integrasi Supabase

1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru gratis.
2. Buka menu **SQL Editor** di dashboard Supabase Anda.
3. Buka file [`schema.sql`](file:///d:/PASKAS%20BAHAGIA/pemograman/registrasi%20peserta%20paskas/schema.sql) pada project ini, lalu salin dan jalankan seluruh kodenya di SQL Editor.
4. Buka menu **Project Settings > API** di Supabase:
   - Salin **Project URL**
   - Salin **anon public API Key**
5. Di aplikasi website Paskas Bahagia, klik ikon **Pengaturan** di pojok kanan atas, buka tab **Database Supabase**, tempelkan URL & Key, lalu klik **Simpan Kredensial** & **Tes Koneksi**.
6. Selesai! Semua data pendaftaran dari seluruh penjuru Indonesia akan langsung tersimpan di cloud database Supabase secara real-time.

---

## Panduan Deployment ke Vercel

Aplikasi ini sudah dilengkapi dengan file `vercel.json` dan siap online 24/7 di Vercel:

1. Buat repositori baru di akun **GitHub** Anda (misalnya: `registrasi-paskas-bahagia`).
2. Unggah semua file dari folder ini ke repositori tersebut:
   - `index.html`
   - `css/style.css`
   - `js/app.js`
   - `js/supabase-config.js`
   - `vercel.json`
   - `schema.sql`
3. Masuk ke [https://vercel.com](https://vercel.com) menggunakan akun GitHub Anda.
4. Klik tombol **"Add New..." > "Project"**.
5. Pilih repositori GitHub Anda tadi.
6. Pada bagian **Framework Preset**, biarkan terpilih **Other**.
7. Klik tombol **Deploy**!
8. Dalam waktu sekitar 10 detik, website Anda sudah aktif dengan URL gratis seperti:
   `https://registrasi-paskas-bahagia.vercel.app`

---

## Struktur Berkas

```
registrasi peserta paskas/
├── index.html              # Halaman utama aplikasi (Single Page Application)
├── css/
│   └── style.css           # Desain antarmuka & styling modern
├── js/
│   ├── app.js              # Logika UI, carousel, formulir, rekap & chart
│   └── supabase-config.js  # Layanan database Supabase & LocalStorage
├── schema.sql              # Skrip SQL untuk membuat tabel di Supabase
├── vercel.json             # Konfigurasi deployment Vercel
└── README.md               # Dokumentasi lengkap sistem
```

Semoga sistem registrasi ini membawa keberkahan dan kelancaran untuk seluruh agenda **Paskas Bahagia**!
