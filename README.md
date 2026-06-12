# Inkfinity

Inkfinity adalah aplikasi pemesanan layanan fotocopy dan print berbasis **React Native Expo**. Aplikasi ini dibuat untuk membantu pelanggan dalam melihat daftar layanan, membuat pesanan, mengunggah file dokumen, melihat estimasi harga, serta memantau status pesanan secara realtime.

Aplikasi ini dirancang sebagai **prototype aplikasi online / MVP sederhana** untuk layanan fotocopy dan print. Inkfinity sudah terhubung dengan **Supabase** sebagai database online, storage file, dan realtime server. Dengan sistem ini, user dapat membuat pesanan melalui HP, sedangkan admin dapat menerima dan mengelola pesanan melalui laptop.

---

## Deskripsi Singkat Aplikasi

Inkfinity merupakan aplikasi layanan pemesanan fotocopy dan print yang mempermudah pelanggan dalam melakukan pemesanan secara digital. User dapat memilih layanan, mengisi jumlah pesanan, mengunggah file dokumen, melihat estimasi harga otomatis, dan memantau status pesanan.

Admin dapat login melalui akun khusus untuk melihat seluruh pesanan yang masuk, membuka file yang diunggah user, serta mengubah status pesanan menjadi **Sedang Diproses**, **Selesai**, atau **Dibatalkan**. Perubahan status tersebut akan tampil pada riwayat pesanan user secara realtime.

---

## Tujuan Aplikasi

Tujuan dibuatnya aplikasi Inkfinity adalah untuk mempermudah proses pemesanan layanan fotocopy dan print yang biasanya masih dilakukan secara manual. Melalui aplikasi ini, pelanggan dapat melakukan pemesanan dengan lebih cepat, jelas, dan praktis.

Selain itu, aplikasi ini juga membantu admin atau pemilik layanan fotocopy dalam mengelola pesanan yang masuk. Admin dapat melihat data pesanan, file dokumen, total harga, catatan, dan status pesanan melalui dashboard admin.

---

## Latar Belakang Masalah

Pada layanan fotocopy dan print, proses pemesanan sering dilakukan secara langsung atau melalui chat biasa. Cara tersebut terkadang membuat pesanan sulit dikelola karena data pesanan, file dokumen, jumlah lembar, catatan, dan status pengerjaan tidak tersusun dengan rapi.

Inkfinity hadir sebagai solusi digital sederhana untuk membantu user melakukan pemesanan secara lebih terstruktur. Dengan adanya sistem online dan realtime, user dapat mengirim pesanan dari HP, sedangkan admin dapat langsung melihat pesanan tersebut melalui laptop.

---

## Status Project

Project Inkfinity saat ini berada pada tahap:

```text
Prototype Online / MVP Sederhana
```

Artinya, fitur utama aplikasi sudah berjalan dan dapat digunakan untuk simulasi pemesanan secara nyata, seperti:

```text
User membuat pesanan dari HP
File dokumen terupload online
Pesanan masuk ke database Supabase
Admin melihat pesanan dari laptop
Admin mengubah status pesanan
Status user berubah secara realtime
```

Namun, aplikasi ini belum disebut sebagai aplikasi produksi penuh karena masih dapat dikembangkan lagi pada bagian keamanan login, pembayaran, notifikasi, dan dashboard admin yang lebih lengkap.

---

## 3 Pilar Utama Produk

### 1. Aplikasi Berjalan

Inkfinity merupakan aplikasi berbasis React Native Expo yang dapat dijalankan melalui **Expo Go** di HP dan melalui **web browser** di laptop. Aplikasi ini sudah dapat digunakan untuk melakukan pemesanan layanan fotocopy dan print.

### 2. Menyelesaikan Permasalahan Nyata

Aplikasi ini membantu menyelesaikan masalah pemesanan fotocopy dan print yang masih dilakukan secara manual. Dengan Inkfinity, user dapat memilih layanan, mengunggah file, melihat estimasi harga, dan memantau status pesanan.

### 3. Memiliki Fitur Inti

Inkfinity memiliki fitur inti yang mendukung alur pemesanan, yaitu login user, sign up user, login admin, daftar layanan, form pemesanan, upload file dokumen, estimasi harga otomatis, riwayat pemesanan, admin dashboard, dan update status realtime.

---

## Fitur Aplikasi

### 1. Login dan Sign Up User

User dapat membuat akun melalui halaman Sign Up dengan mengisi nama lengkap, username, dan password. Setelah akun berhasil dibuat, user dapat login untuk masuk ke halaman utama aplikasi.

Catatan: Pada versi saat ini, akun user masih disimpan secara lokal di perangkat menggunakan AsyncStorage. Jadi akun yang dibuat di satu perangkat belum otomatis tersedia di perangkat lain.

### 2. Login Admin

Admin dapat login melalui halaman login yang sama menggunakan akun khusus admin. Akun admin digunakan untuk masuk ke halaman Admin Dashboard dan mengelola pesanan user.

Akun admin demo:

```text
Username: admin
Password: inkfinity123
```

### 3. Halaman Utama

Setelah login, user akan masuk ke halaman utama Inkfinity. Pada halaman ini terdapat menu untuk melihat layanan, membuka riwayat pemesanan, dan logout.

### 4. Daftar Layanan

Aplikasi menampilkan daftar layanan fotocopy dan print yang dapat dipilih oleh user.

Layanan yang tersedia:

```text
Print Hitam Putih
Print Warna
Fotocopy
Scan Dokumen
Jilid
Laminating
```

Setiap layanan memiliki informasi harga, deskripsi, dan tombol untuk memilih layanan.

### 5. Form Pemesanan

Setelah memilih layanan, user dapat mengisi form pemesanan. Data yang diisi meliputi:

```text
Nama pemesan
Layanan yang dipilih
Jumlah pesanan
File dokumen
Catatan pesanan
```

### 6. Upload File Dokumen

User dapat memilih dan mengunggah file dokumen yang ingin dipesan untuk dicetak atau diproses. File yang dipilih akan diunggah ke **Supabase Storage**.

Jenis file yang didukung:

```text
PDF
DOC
DOCX
JPG
PNG
```

File yang berhasil diunggah akan tersimpan secara online, lalu link file tersebut akan disimpan di database Supabase bersama data pesanan.

### 7. Estimasi Harga Otomatis

Aplikasi akan menghitung estimasi total harga berdasarkan layanan yang dipilih dan jumlah yang dimasukkan user.

Contoh:

```text
Layanan: Print Hitam Putih
Harga: Rp500 / lembar
Jumlah: 10
Estimasi Total: Rp5.000
```

### 8. Detail Pesanan

Setelah user mengirim pesanan, aplikasi akan menampilkan detail pesanan. Detail tersebut berisi nama pemesan, layanan, jumlah, nama file, total harga, tanggal, catatan, dan status pesanan.

### 9. Riwayat Pemesanan User

User dapat membuka halaman Riwayat Pemesanan untuk melihat daftar pesanan yang pernah dibuat. Riwayat ini akan menampilkan status terbaru dari pesanan.

Status pesanan dapat berubah secara realtime setelah admin melakukan update status dari dashboard admin.

### 10. Admin Dashboard

Admin dapat melihat seluruh pesanan yang masuk dari user. Pada halaman Admin Dashboard, admin dapat melihat detail pesanan seperti nama user, layanan, jumlah, file, catatan, total harga, tanggal, dan status pesanan.

### 11. Buka File Pesanan

Admin dapat membuka file dokumen yang sudah diunggah oleh user. File tersebut tersimpan di Supabase Storage dan dapat diakses melalui link file.

### 12. Update Status Pesanan

Admin dapat mengubah status pesanan melalui tombol yang tersedia.

Status pesanan terdiri dari:

```text
Menunggu Diproses
Sedang Diproses
Selesai
Dibatalkan
```

Perubahan status akan tersimpan di Supabase dan dapat terlihat pada halaman riwayat user secara realtime.

---

## Alur Penggunaan Aplikasi

### Alur User

```text
Buka aplikasi
→ Buat akun user
→ Login sebagai user
→ Masuk halaman utama
→ Pilih Lihat Layanan
→ Pilih salah satu layanan
→ Isi form pemesanan
→ Pilih dan upload file dokumen
→ Lihat estimasi harga otomatis
→ Kirim pesanan
→ Pesanan masuk ke Supabase
→ User melihat detail pesanan
→ User membuka riwayat pemesanan
→ User memantau status pesanan
```

### Alur Admin

```text
Buka aplikasi di laptop
→ Login sebagai admin
→ Masuk Admin Dashboard
→ Melihat semua pesanan user
→ Membuka file pesanan
→ Mengubah status pesanan
→ Status tersimpan ke Supabase
→ Status user berubah secara realtime
```

### Alur Realtime

```text
User membuat pesanan dari HP
→ Data pesanan masuk ke Supabase Database
→ File masuk ke Supabase Storage
→ Admin Dashboard laptop menerima data pesanan
→ Admin mengubah status pesanan
→ Supabase memperbarui data status
→ Riwayat user ikut berubah secara realtime
```

---

## Alur Status Pesanan

```text
User membuat pesanan
→ Status awal: Menunggu Diproses
→ Admin klik Proses
→ Status berubah: Sedang Diproses
→ Admin klik Selesai
→ Status berubah: Selesai
```

Jika pesanan tidak dapat diproses, admin dapat mengubah status menjadi:

```text
Dibatalkan
```

---

## Alur Demo Presentasi

Berikut alur demo yang dapat digunakan saat presentasi:

```text
1. Buka aplikasi Inkfinity.
2. Tampilkan halaman login.
3. Klik tombol Buat Akun User.
4. Daftarkan akun user baru.
5. Login sebagai user melalui HP.
6. Masuk ke halaman utama.
7. Klik Lihat Layanan.
8. Pilih salah satu layanan, misalnya Print Hitam Putih.
9. Isi jumlah pesanan.
10. Klik Pilih File untuk memilih dokumen.
11. Tampilkan estimasi harga otomatis.
12. Klik Kirim Pesanan.
13. Tampilkan halaman detail pesanan.
14. Buka Riwayat Pemesanan.
15. Tunjukkan status awal pesanan, yaitu Menunggu Diproses.
16. Buka aplikasi di laptop sebagai admin.
17. Login menggunakan akun admin.
18. Tampilkan Admin Dashboard.
19. Tunjukkan bahwa pesanan dari HP user muncul di dashboard admin.
20. Admin membuka file pesanan.
21. Admin mengubah status menjadi Sedang Diproses.
22. Admin mengubah status menjadi Selesai.
23. Kembali ke HP user.
24. Buka Riwayat Pemesanan.
25. Tunjukkan bahwa status pesanan sudah berubah menjadi Selesai.
```

---

## Teknologi yang Digunakan

Aplikasi Inkfinity dibuat menggunakan beberapa teknologi berikut:

```text
React Native
Expo
JavaScript
Expo Go
Supabase Database
Supabase Storage
Supabase Realtime
AsyncStorage
Expo Document Picker
Expo File System Legacy
Base64 ArrayBuffer
Google Fonts Crimson Text
```

---

## Fungsi Teknologi

### React Native

React Native digunakan untuk membangun tampilan dan logika aplikasi mobile.

### Expo

Expo digunakan untuk menjalankan, menguji, dan mengembangkan aplikasi React Native dengan lebih mudah.

### Supabase Database

Supabase Database digunakan untuk menyimpan data pesanan secara online.

### Supabase Storage

Supabase Storage digunakan untuk menyimpan file dokumen yang diunggah oleh user.

### Supabase Realtime

Supabase Realtime digunakan agar perubahan data pesanan dan status dapat langsung terlihat oleh user dan admin.

### AsyncStorage

AsyncStorage digunakan untuk menyimpan data akun user secara lokal pada perangkat.

### Expo Document Picker

Expo Document Picker digunakan agar user dapat memilih file dokumen dari perangkat.

### Expo File System Legacy

Expo File System Legacy digunakan untuk membaca file yang dipilih user agar dapat diunggah ke Supabase Storage.

---

## Struktur Penyimpanan Data

Pada aplikasi ini, data dibagi menjadi dua bagian utama:

### 1. Supabase Database

Supabase Database menyimpan data pesanan, seperti:

```text
ID pesanan
ID user
Nama user
Nama layanan
Harga layanan
Jumlah pesanan
Total harga
Nama file
Link file
Catatan
Status pesanan
Tanggal pesanan
```

### 2. Supabase Storage

Supabase Storage menyimpan file dokumen yang diunggah oleh user.

Contoh file:

```text
PDF tugas
Dokumen Word
Gambar JPG
Gambar PNG
```

Database tidak menyimpan file secara langsung. Database hanya menyimpan informasi pesanan dan link file, sedangkan file asli disimpan di Supabase Storage.

---

## Kelebihan Aplikasi

Beberapa kelebihan aplikasi Inkfinity adalah:

```text
Sudah online dan realtime
Bisa upload file dokumen
User dapat memesan dari HP
Admin dapat menerima pesanan dari laptop
Status pesanan dapat diubah oleh admin
Status user ikut berubah secara realtime
Ada estimasi harga otomatis
Ada riwayat pemesanan
Tampilan sederhana dan mudah digunakan
Cocok untuk prototype atau MVP aplikasi
```

---

## Keterbatasan Aplikasi

Aplikasi ini masih memiliki beberapa keterbatasan, yaitu:

```text
Login user masih menggunakan penyimpanan lokal
Belum menggunakan Supabase Authentication
Security policy Supabase masih dibuat sederhana untuk kebutuhan demo
Belum tersedia fitur pembayaran digital
Belum tersedia notifikasi otomatis
Belum ada dashboard admin web terpisah
Belum ada fitur cetak laporan pesanan
File yang dihapus dari riwayat belum otomatis terhapus dari storage
```

---

## Rencana Pengembangan

Beberapa fitur yang dapat dikembangkan pada versi berikutnya adalah:

```text
Menggunakan Supabase Authentication untuk login user dan admin
Meningkatkan keamanan database dengan aturan akses yang lebih ketat
Menambahkan validasi ukuran file sebelum upload
Menambahkan fitur pembayaran digital
Menambahkan notifikasi status pesanan
Membuat dashboard admin berbasis web
Menambahkan fitur laporan pesanan
Menambahkan fitur hapus file otomatis dari storage
Menambahkan halaman profil user
Menambahkan fitur pencarian pesanan untuk admin
```

---

## Cara Menjalankan Project

### 1. Clone Project

```bash
git clone https://github.com/JustYuzo/demo_project_inkfinity.git
```

### 2. Masuk ke Folder Project

```bash
cd demo_project_inkfinity
```

### 3. Install Dependency

```bash
npm install
```

### 4. Install Package Tambahan

```bash
npm install @supabase/supabase-js react-native-url-polyfill
```

```bash
npx expo install expo-document-picker
```

```bash
npx expo install expo-file-system
```

```bash
npm install base64-arraybuffer
```

### 5. Jalankan Project

Untuk menjalankan project:

```bash
npx expo start
```

Untuk menjalankan dengan membersihkan cache:

```bash
npx expo start -c
```

Untuk menjalankan melalui LAN:

```bash
npx expo start -c --lan
```

Untuk menjalankan melalui web browser:

```bash
npx expo start --web
```

---

## Cara Menjalankan di Expo Go

```text
1. Pastikan aplikasi Expo Go sudah terinstall di HP.
2. Jalankan project dengan perintah npx expo start -c --lan.
3. Pastikan HP dan laptop berada pada jaringan WiFi yang sama.
4. Scan QR Code menggunakan Expo Go.
5. Aplikasi akan terbuka di HP.
```

---

## Cara Menjalankan Admin di Laptop

```text
1. Jalankan aplikasi melalui Expo.
2. Tekan tombol w di terminal untuk membuka versi web.
3. Login menggunakan akun admin.
4. Admin Dashboard akan tampil di browser laptop.
```

Akun admin demo:

```text
Username: admin
Password: inkfinity123
```

---

## Cara Tes Realtime

```text
1. Jalankan aplikasi di laptop.
2. Buka admin dashboard di laptop.
3. Scan aplikasi menggunakan HP user.
4. Login sebagai user di HP.
5. User membuat pesanan dan upload file.
6. Pesanan akan masuk ke Supabase.
7. Admin melihat pesanan di dashboard laptop.
8. Admin mengubah status pesanan.
9. User membuka riwayat di HP.
10. Status pesanan user berubah.
```

---

## Konfigurasi Supabase

Project ini menggunakan file `supabase.js` untuk menghubungkan aplikasi ke Supabase.

Contoh format file:

```javascript
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "ISI_SUPABASE_URL";
const supabaseAnonKey = "ISI_ANON_PUBLIC_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Catatan penting:

```text
Gunakan Project URL yang benar dari Supabase.
Jangan menambahkan /rest/v1/ pada supabaseUrl.
Gunakan anon public key, bukan service_role key.
Jangan membagikan service_role key kepada siapa pun.
```

---

## Catatan Keamanan

Pada versi demo ini, konfigurasi akses Supabase masih dibuat sederhana agar proses upload file dan realtime dapat berjalan dengan mudah saat presentasi.

Untuk pengembangan aplikasi yang lebih aman, perlu ditambahkan:

```text
Supabase Authentication
Role user dan admin yang lebih aman
Policy database yang lebih ketat
Policy storage yang lebih aman
Validasi ukuran dan tipe file dari sisi aplikasi
```

---

## Kesimpulan

Inkfinity merupakan prototype aplikasi pemesanan layanan fotocopy dan print berbasis React Native Expo yang sudah terhubung dengan Supabase sebagai database online, storage file, dan realtime server.

Aplikasi ini memungkinkan user melakukan pemesanan melalui HP, mengunggah file dokumen, melihat estimasi harga, serta memantau status pesanan. Admin dapat melihat pesanan melalui laptop, membuka file yang diunggah user, dan mengubah status pesanan secara realtime.

Dengan fitur tersebut, Inkfinity sudah layak digunakan sebagai demo project aplikasi karena tidak hanya menampilkan antarmuka, tetapi juga memiliki alur sistem yang berjalan secara online dari sisi user hingga admin.

## Stack Teknologi Aplikasi

Aplikasi Inkfinity menggunakan **React Native Expo** sebagai teknologi front-end untuk membangun tampilan aplikasi mobile. Bahasa pemrograman yang digunakan adalah **JavaScript**, sedangkan tampilan aplikasi dibuat menggunakan **StyleSheet React Native**.

Pada bagian backend, aplikasi menggunakan **Supabase**. Supabase digunakan sebagai database online, storage file, dan realtime server. Dengan Supabase, data pesanan dapat tersimpan secara online, file dokumen dapat diunggah, dan status pesanan dapat diperbarui secara realtime antara user dan admin.

Secara ringkas, stack teknologi aplikasi Inkfinity adalah:

```text
Frontend: React Native Expo
Bahasa Pemrograman: JavaScript
Styling: StyleSheet React Native
Backend: Supabase
Database: Supabase Database
Storage: Supabase Storage
Realtime: Supabase Realtime
Local Storage: AsyncStorage
```
