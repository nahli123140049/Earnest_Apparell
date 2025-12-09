# Earnest Apparel Website

Website profil perusahaan dan katalog produk untuk **Earnest Apparel**, sebuah usaha konveksi dan sablon yang berbasis di Bandar Lampung. Website ini dibangun menggunakan teknologi web standar (HTML, CSS, JavaScript) tanpa framework berat, dan menggunakan **LocalStorage** browser untuk simulasi manajemen data produk.

## Fitur Utama

### 1. Halaman Publik (User)
*   **Beranda (Home):** Banner utama dan highlight layanan unggulan.
*   **Tentang Kami:** Profil perusahaan, visi, dan misi.
*   **Produk & Layanan:** Katalog produk dinamis. Pengunjung dapat melihat detail produk (Bahan, Warna, Ukuran) melalui popup modal dan langsung terhubung ke WhatsApp untuk pemesanan.
*   **Cara Pemesanan:** Panduan langkah demi langkah memesan jasa konveksi.
*   **Kontak:** Informasi lokasi (peta), jam operasional, dan kontak bisnis.
*   **WhatsApp Integration:** Tombol melayang (floating button) dan tombol tanya di setiap produk yang mengarahkan pengguna langsung ke chat WhatsApp dengan pesan template otomatis.

### 2. Halaman Admin (Dashboard)
*   **Login Admin:** Halaman login sederhana (Username: `admin`, Password: `admin123`).
*   **Manajemen Produk:**
    *   Menambah produk baru (Nama, Kategori, Deskripsi, Bahan, Warna, Ukuran).
    *   **Upload Gambar:** Mendukung upload gambar langsung dari komputer (disimpan lokal di browser).
    *   Menghapus produk yang sudah ada.
    *   Data tersimpan di LocalStorage browser, sehingga tidak memerlukan database server (namun data hanya tersimpan di perangkat admin yang digunakan).

## Struktur File

```
/
├─ index.html           # Halaman Utama
├─ about.html           # Halaman Tentang Kami
├─ produk.html          # Halaman Katalog Produk (Dinamis)
├─ cara-pemesanan.html  # Halaman Cara Pesan & FAQ
├─ kontak.html          # Halaman Kontak & Peta
├─ login.html           # Halaman Login Admin
├─ admin-dashboard.html # Halaman Dashboard Admin
├─ assets/
│  ├─ css/
│  │  └─ style.css      # Styling Global & Responsif
│  └─ js/
│     └─ main.js        # Logika JavaScript (CRUD Produk, Modal, WA)
└─ README.md            # Dokumentasi Proyek
```

## Cara Menjalankan

1.  **Download/Clone** folder proyek ini.
2.  Buka file `index.html` menggunakan browser modern (Chrome, Firefox, Edge).
3.  Untuk mengakses halaman admin, buka `login.html` atau tambahkan `/login.html` di url browser.
4.  Gunakan kredensial default:
    *   **Username:** `admin`
    *   **Password:** `admin123`

## Catatan Teknis

*   **Penyimpanan Gambar:** Karena menggunakan LocalStorage, disarankan mengupload gambar dengan ukuran kecil (di bawah 500KB) agar penyimpanan browser tidak cepat penuh.
*   **Persistensi Data:** Data produk yang ditambah via admin hanya tersimpan di browser komputer tersebut. Jika cache browser dibersihkan, data produk tambahan akan hilang dan kembali ke data default.

## Pertimbangan Teknologi: Perlu Node.js?

Anda mungkin bertanya: *"Apakah saya harus mengubah ini menjadi aplikasi Node.js?"*

### 1. Tetap Static (HTML/JS + LocalStorage) - *Kondisi Sekarang*
*   **Cocok untuk:** Website portofolio yang jarang update, atau jika Admin hanya menggunakan 1 komputer khusus untuk mengelola data.
*   **Kelebihan:** Gratis hosting (GitHub Pages/Netlify), sangat cepat, tidak ada maintenance server.
*   **Kekurangan:** Data produk tidak tersimpan online (hanya di browser admin).

### 2. Firebase (Serverless) - *Sangat Direkomendasikan*
*   **Cocok untuk:** UMKM seperti Earnest Apparel yang butuh update produk dinamis tanpa biaya server mahal.
*   **Kelebihan:** 
    *   **Tidak perlu Node.js/Backend Server.**
    *   Database Realtime (Online).
    *   Gratis (Tier Spark).
    *   Struktur kode HTML/CSS saat ini bisa dipertahankan 90%.
*   **Cara Migrasi:** Cukup daftar di Firebase Console, dapatkan API Key, dan ganti logika `localStorage` di `main.js` dengan `firebase.firestore()`.

### 3. Node.js + Database (Full Stack)
*   **Cocok untuk:** E-commerce skala besar (Tokopedia/Shopee clone) yang butuh sistem user kompleks, payment gateway otomatis, dan keamanan tingkat tinggi.
*   **Kekurangan:** Biaya hosting lebih mahal, kode lebih rumit (harus maintain Backend & Frontend), waktu pengembangan lebih lama.

**Kesimpulan:** Untuk kebutuhan katalog online sederhana, **Opsi 2 (Firebase)** adalah jalan tengah terbaik antara kemudahan dan fungsionalitas.

# Earnest Apparel (Node.js Version)

Website ini sekarang menggunakan **Node.js** sebagai backend server sederhana untuk menyimpan data produk ke dalam file JSON.

## Prasyarat
Pastikan komputer Anda sudah terinstall **Node.js**.
Cek dengan mengetik `node -v` di terminal/CMD.

## Cara Instalasi (Pertama Kali)

1.  Buka terminal/CMD di dalam folder proyek ini (`d:\SEM 5 CHUY\SI`).
2.  Jalankan perintah berikut untuk menginstall library yang dibutuhkan:
    ```bash
    npm install
    ```
    *(Ini akan membaca file `package.json` dan menginstall `express`, `cors`, dll)*

## Cara Menjalankan Website

1.  Di terminal, jalankan server dengan perintah:
    ```bash
    npm start
    ```
    atau
    ```bash
    node server.js
    ```
2.  Tunggu hingga muncul pesan: `Server berjalan di http://localhost:3000`.
3.  Buka browser dan akses: **[http://localhost:3000](http://localhost:3000)**.

## Fitur Backend
*   **Database:** Menggunakan file `data/products.json`. Data yang Anda tambah di Admin Dashboard akan tersimpan permanen di file ini.
*   **API:**
    *   `GET /api/products`: Mengambil semua produk.
    *   `POST /api/products`: Menambah produk baru.
    *   `DELETE /api/products/:id`: Menghapus produk.

# Earnest Apparel (Full Stack)

Website ini menggunakan arsitektur terpisah:
*   **Backend:** Node.js + Express + MongoDB (Port 5000)
*   **Frontend:** HTML + CSS + Vanilla JS (Client Side)

## Struktur Folder

```
/
├─ backend/             # Server Node.js & Koneksi Database
│  ├─ models/           # Schema MongoDB (Product.js)
│  ├─ server.js         # Kode Utama Server
│  └─ package.json
│
└─ frontend/            # Tampilan Website
   ├─ assets/           # CSS & JS (main.js)
   ├─ index.html
   ├─ produk.html
   ├─ admin-dashboard.html
   └─ ...
```

## Prasyarat
1.  **Node.js** sudah terinstall.
2.  **MongoDB** sudah terinstall dan berjalan di komputer Anda (Localhost).
    *   *Jika belum punya, install "MongoDB Community Server" dan "MongoDB Compass".*

## Cara Menjalankan

### Langkah 1: Jalankan Backend (Server)
Ini wajib dinyalakan agar data produk bisa muncul dan tersimpan ke database.

1.  Buka terminal (CMD/PowerShell).
2.  Masuk ke folder backend:
    ```bash
    cd backend
    ```
3.  Install library (hanya perlu dilakukan sekali di awal):
    ```bash
    npm install
    ```
4.  Jalankan server:
    ```bash
    npm start
    ```
5.  Tunggu sampai muncul pesan:
    > MongoDB Connected
    > Server running on port 5000

*Biarkan terminal ini tetap terbuka selama Anda menggunakan website.*

### Langkah 2: Buka Frontend (Website)
1.  Buka folder `frontend` di File Explorer.
2.  Klik dua kali file `index.html` atau `produk.html`.
3.  Website akan terbuka di browser.
4.  Coba buka halaman **Produk**. Jika loading selesai dan data muncul (atau kosong tapi tidak error), berarti koneksi ke Backend & MongoDB sukses.

### Langkah 3: Login Admin
1.  Buka file `frontend/login.html`.
2.  Login dengan:
    *   User: `admin`
    *   Pass: `admin123`
3.  Masuk ke Dashboard, coba tambah produk baru. Data akan tersimpan permanen ke MongoDB.

---

## Troubleshooting
*   **Data Produk tidak muncul (Loading terus)?**
    *   Cek terminal backend, pastikan tidak ada error merah.
    *   Pastikan MongoDB service di komputer Anda sudah nyala.
*   **Error "Network Error"?**
    *   Pastikan backend berjalan di port 5000.
    *   Cek `frontend/assets/js/main.js`, pastikan `API_URL` mengarah ke `http://localhost:5000/api/products`.
