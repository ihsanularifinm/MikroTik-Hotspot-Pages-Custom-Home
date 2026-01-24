# MikroTik Hotspot Pages - Custom Home

Sebuah templat halaman hotspot MikroTik yang modern, minimalis, dan responsif, dibangun dari awal menggunakan **Tailwind CSS**.

Template ini dirancang untuk menggantikan halaman hotspot default MikroTik dengan tampilan yang lebih bersih, lebih ringan, dan lebih ramah pengguna, terutama untuk perangkat mobile.

## ✨ Tampilan (Preview)

<p align="center">
  <img src="preview/screenshot-dark.png" width="45%" alt="Dark Mode Preview">
  &nbsp;&nbsp;
  <img src="preview/screenshot-light.png" width="45%" alt="Light Mode Preview">
</p>
<p align="center">
  <img src="preview/screenshot-id-lang.png" width="45%" alt="Bahasa Indonesia Preview">
  &nbsp;&nbsp;
  <img src="preview/screenshot-status.png" width="45%" alt="Status Preview">
</p>

## 🚀 Fitur Utama

- **Desain Modern & Minimalis**: Tampilan bersih dan terpusat (single card) untuk semua halaman (`login`, `status`, `logout`, `error`, `alogin`, `radvert`).
- **Dibangun dengan Tailwind CSS v4**: Kustomisasi yang sangat mudah dan ukuran file CSS yang sangat kecil berkat proses optimasi.
- **Mode Gelap & Terang (Dark/Light Mode)**: Pengguna bisa memilih tema favoritnya, dan pilihan akan disimpan di browser untuk kunjungan berikutnya.
- **Multi-Bahasa (English/Indonesia)**: Toggle bahasa dengan tombol EN/ID di pojok kanan atas. Pilihan bahasa disimpan di localStorage.
- **Sticky Navbar**: Tombol toggle tema dan bahasa berada di navbar sticky yang tidak overlap dengan konten di mobile.
- **Terjemahan Error Messages**: Pesan error dari MikroTik otomatis diterjemahkan sesuai bahasa yang dipilih.
- **Dual Mode QR Scanner**: Fitur scan QR Code canggih yang mendukung:
    - **Mode Internal (HTTPS)**: Menggunakan kamera browser langsung.
    - **Mode Eksternal (HTTP)**: Solusi "Walled Garden" untuk pengguna yang belum login, menggunakan modal inline tanpa redirect halaman yang mengganggu.
- **Cek Koneksi WebSocket**: Memastikan status Walled Garden akurat secara real-time (anti-cache).
- **Konfigurasi Terpusat (`config.js`)**: Atur logo, tema default, bahasa, dan opsi QR Scanner dari satu file.
- **Otomatisasi Protokol**: Sistem otomatis memilih mode scanner (Internal vs Eksternal) berdasarkan protokol (HTTP vs HTTPS).
- **Session Cookie Control**: Opsi "Log out & Clear" untuk menghapus session cookie saat logout (fresh login berikutnya).
- **Default Mode Gelap**: Secara otomatis menampilkan tema gelap untuk pengunjung baru untuk kenyamanan mata.
- **Tampilkan/Sembunyikan Password**: Memudahkan pengguna saat mengetik password di perangkat mobile.
- **Responsif**: Tampilan optimal di perangkat desktop maupun mobile.
- **Heroicons**: Menggunakan icon dari [Heroicons](https://heroicons.com/) - library icon official dari tim Tailwind CSS.
- **Ringan & Cepat**: Tidak menggunakan jQuery atau framework JavaScript berat lainnya, hanya Vanilla JavaScript murni.
- **Kompatibilitas Penuh**: Tetap mempertahankan semua variabel dan logika asli dari MikroTik Hotspot.

## 🔧 Konfigurasi (`js/config.js`)

Semua pengaturan utama dapat diubah melalui file `hotspot/js/config.js` tanpa perlu menyentuh kode HTML.

```javascript
const hotspotConfig = {
    // Enable/Disable QR Code Login
    // true  = Tampilkan tombol QR
    // false = Sembunyikan tombol QR
    enableQRCode: true,

    // Mode QR Scanner
    // 'auto'     = Deteksi otomatis (HTTP -> External, HTTPS -> Internal)
    // 'internal' = Paksa kamera browser (Wajib HTTPS)
    // 'external' = Paksa scanner eksternal (Wajib Walled Garden)
    qrMode: 'auto',

    // URL Scanner Eksternal
    // URL web scanner yang di-whitelist di Walled Garden
    qrExternalUrl: 'https://my-qr-as1.pages.dev/scanner/',

    // Bahasa Default ('en' atau 'id')
    defaultLang: 'en',

    // Tema Default ('light', 'dark', atau 'auto')
    defaultTheme: 'auto',

    // Logo & Favicon
    // Ubah path gambar di sini (misal: 'img/logo-baru.png')
    logo: 'img/smart-home.svg',
};
```

## 📁 Struktur Halaman

| File | Deskripsi |
|------|-----------|
| `login.html` | Halaman login dengan form username/password |
| `status.html` | Status koneksi dengan tombol Log out, Log out & Clear, dan Continue |
| `logout.html` | Konfirmasi logout dengan tombol Log in |
| `error.html` | Halaman error dengan pesan yang diterjemahkan |
| `alogin.html` | Halaman sukses login (redirect) |
| `radvert.html` | Halaman advertisement |
| `js/config.js` | Konfigurasi utama (Logo, QR, Bahasa, Tema) |
| `js/qr-scanner.js` | Logika pemindai QR Code & Modal |

## 🌐 Fitur Multi-Bahasa

Template ini mendukung dua bahasa:
- **English** (default)
- **Bahasa Indonesia**

Pengguna dapat mengganti bahasa dengan menekan tombol **EN/ID** di pojok kanan atas (sebelah tombol dark mode).

### Teks yang Diterjemahkan:
- Label form (Username, Password)
- Tombol (Login, Logout, Continue, dll)
- Pesan status dan informasi
- **Error messages dari MikroTik** (seperti "invalid username or password" → "nama pengguna atau kata sandi salah")

## 🛠️ Teknologi yang Digunakan

- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- Vanilla JavaScript - Untuk fungsionalitas interaktif (toggle tema, bahasa, dan password)

## ⚙️ Cara Penggunaan (Instalasi)

1.  Unduh rilis terbaru atau _clone_ repositori ini.
2.  Buka WinBox, lalu klik menu **Files**.
3.  _Drag and drop_ seluruh isi folder `hotspot` dari proyek ini ke dalam File List di MikroTik Anda. Jika sudah ada folder `hotspot`, timpa saja isinya.
4.  Buka **IP** -> **Hotspot** -> tab **Server Profiles**.
5.  Pilih profil server Anda, dan di kolom **HTML Directory**, pastikan namanya adalah `hotspot`.

## � Persyaratan Walled Garden (PENTING untuk HTTP)

Agar fitur **QR Scanner Eksternal** dapat berjalan bagi pengguna yang belum login (via HTTP), Anda **WAJIB** menambahkan domain scanner ke dalam Walled Garden MikroTik.

**WinBox:**
1.  Buka **IP** -> **Hotspot** -> **Walled Garden**.
2.  Klik **+** (Add).
3.  Set **Dst. Host** menjadi `my-qr-as1.pages.dev` (atau domain scanner Anda).
4.  Klik **OK**.
5.  (Opsional) Tambahkan juga `*.github.io` jika ada aset yang diambil dari GitHub.

Jika langkah ini tidak dilakukan, scanner akan menampilkan pesan error **"Connection Failed"** dengan ikon "Sad File".

> [!IMPORTANT]
> **Catatan Penting untuk Custom Scanner**
> Default `qrExternalUrl` menggunakan scanner ([`my-qr-as1.pages.dev`](https://my-qr-as1.pages.dev)) yang sudah terintegrasi dengan WebSocket Check.
>
> 🔗 **Source Code Scanner & Generator:** [https://github.com/ihsanularifinm/my-qr](https://github.com/ihsanularifinm/my-qr)
> 
> Jika Anda mengganti URL tersebut dengan **domain scanner Anda sendiri**, pastikan scanner Anda **WAJIB** memiliki implementasi WebSocket yang sesuai untuk merespon pengecekan koneksi (`/ws` endpoint).
> Jika scanner Anda hanya file HTML statis biasa tanpa WebSocket, logika pengecekan koneksi **tidak akan akurat**. Sistem mungkin mendeteksi "Sukses" palsu (False Positive) akibat cache browser/DNS, padahal akses Walled Garden sebenarnya terputus/diblokir.

## 🔒 Persyaratan HTTPS (Opsional untuk Mode Internal)

Jika Anda ingin menggunakan **Mode Internal** (kamera langsung di browser tanpa perantara), Anda **WAJIB** mengaktifkan HTTPS di MikroTik.

> **CATATAN:** Dengan sistem "Dual Mode" baru ini, HTTPS tidak lagi wajib mutlak. Jika HTTPS tidak tersedia, sistem akan otomatis beralih ke Mode Eksternal yang bekerja di HTTP (asalkan Walled Garden dikonfigurasi).

Namun jika Anda tetap ingin mengaktifkan HTTPS, silakan ikuti panduan:
👉 **[BACA PANDUAN LENGKAP: HTTPS-SSL_SETUP.md](HTTPS-SSL_SETUP.md)**

Setelah HTTPS aktif, fitur QR Code akan berjalan lancar karena sistem ini sudah otomatis mendeteksi dan mengalihkan ke protokol yang sesuai.

## 🎨 Kustomisasi & Pengembangan (Development)

Proyek ini menggunakan **Tailwind CSS v4**, yang memerlukan proses _build_ untuk menghasilkan file `style.css` final setiap kali ada perubahan pada _class_ HTML.

**Langkah-langkah untuk kustomisasi:**

1.  Pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal di komputer Anda.
2.  Buka terminal di folder proyek dan jalankan:
    ```bash
    npm install tailwindcss @tailwindcss/cli
    ```
3.  **Basic:** Ubah pengaturan dasar (logo, fitur QR, bahasa) melalui file `hotspot/js/config.js`.
4.  **Advanced:** Lakukan perubahan layout pada file HTML di dalam folder `hotspot` jika diperlukan.
5.  Untuk menambah/mengedit terjemahan, edit file `hotspot/js/app.js` pada object `translations`.
6.  Setelah selesai melakukan perubahan, jalankan perintah _build_ di terminal:
    ```bash
    npx @tailwindcss/cli -i ./src/input.css -o ./hotspot/css/style.css --minify
    ```
7.  Setelah proses _build_ selesai, unggah kembali folder `hotspot` yang sudah diperbarui ke MikroTik Anda.

## 📝 Menambah Terjemahan Baru

Untuk menambah atau mengedit terjemahan, buka file `hotspot/js/app.js` dan edit object `translations`:

```javascript
const translations = {
  en: {
    'login_btn': 'Connect',
    'logout_btn': 'Log out',
    'logout_clear_btn': 'Log out & Clear',
    // ... tambahkan key baru di sini
  },
  id: {
    'login_btn': 'Sambungkan',
    'logout_btn': 'Keluar',
    'logout_clear_btn': 'Keluar & Hapus Sesi',
    // ... tambahkan terjemahan di sini
  }
};
```

Kemudian di HTML, gunakan atribut `data-i18n`:
```html
<button data-i18n="login_btn">Login</button>
```

## 🙏 Credits

- Desain dikembangkan dari awal tetapi terinspirasi dari templat hotspot default MikroTik.
- Template asli referensi: [ihsanularifinm/MikroTik-Hotspot-Pages-Default](https://github.com/ihsanularifinm/MikroTik-Hotspot-Pages-Default)
- Library QR Code: [html5-qrcode](https://github.com/mebjas/html5-qrcode) by mebjas
- Icons: [Heroicons](https://heroicons.com/) by Tailwind CSS team
