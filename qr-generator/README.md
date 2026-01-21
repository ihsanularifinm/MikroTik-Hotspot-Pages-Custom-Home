# 🎫 MikroTik Hotspot QR Code Generator

Alat canggih berbasis **offline** (browser-based) untuk membuat kode QR voucher MikroTik Hotspot secara massal maupun satuan. Didesain agar mudah digunakan, cepat, dan siap cetak dengan layout yang presisi.

## ✨ Fitur Utama

-   **Generate Satuan & Massal**: Buat satu voucher atau ratusan sekaligus dalam hitungan detik.
-   **Mode Input Fleksibel**:
    -   **User & Password**: Masukkan username dan password yang berbeda.
    -   **User = Password**: Cukup masukkan username, password otomatis disamakan (ala voucher gosok).
-   **Dukungan Logo Custom**: Upload logo ISP atau Hotspot Anda untuk ditempel otomatis di tengah kode QR.
-   **Layout Cetak A4 / Thermal Teroptimasi**:
    -   **Small (100px)**: Grid 6 Kolom (Muat paling banyak per halaman A4).
    -   **Medium (150px)**: Grid 5 Kolom (Ukuran sedang).
    -   **Large (200px)**: Grid 4 Kolom (Ukuran besar, paling jelas).
    -   Semua layout otomatis menyesuaikan dengan margin cetak A4 agar tidak terpotong.
-   **Mode QR Only**: Opsi untuk menyembunyikan tulisan Username/Password di kartu (hanya QR code saja), cocok untuk hemat ruang atau desain minimalis.
-   **Fitur Ekspor Cerdas**:
    -   **Pop-up Toast**: Notifikasi nyaman saat generate voucher tanpa perlu klik "OK" berulang kali.
    -   **Preview Modal**: Cek tampilan barcode + logo sebelum dicetak.
    -   **Save as PNG**: Simpan QR Code sebagai gambar (QR Only atau QR + Logo) untuk disebar di WA/Sosmed.
-   **Privasi Terjaga**: Semua proses berjalan lokal di browser komputer/HP Anda. Tidak ada data yang dikirim ke server manapun.

## 🚀 Cara Penggunaan

### 1. Pengaturan Logo (Opsional)
-   Klik tombol **"Choose File"** di bagian atas untuk upload logo usaha Anda.
-   Logo akan otomatis muncul di tengah semua kode QR yang dibuat.
-   Gunakan slider/input **Logo Size** di bawah untuk mengatur besar kecilnya logo agar barcode tetap bisa discan.

### 2. Membuat Voucher

#### Mode Single (Satuan)
1.  Pilih tab **Single**.
2.  Pilih opsinya:
    *   **User & Password**: Input manual keduanya.
    *   **User = Password**: Input username saja, password akan sama.
3.  Klik **Generate QR**.

#### Mode Bulk (Massal)
1.  Pilih tab **Bulk**.
2.  Pilih opsinya:
    *   **User & Password**: Format `username:password` (satu pasang per baris).
    *   **User = Password**: Format `username` (satu per baris).
3.  Klik **Generate All QR Codes**.
4.  Notifikasi Toast akan muncul memberitahu jumlah QR yang berhasil dibuat.

### 3. Mencetak (Print) & Ekspor

#### Untuk Mencetak Semua (Print A4)
1.  Gulir ke bawah ke bagian **Actions**.
2.  Atur **Display Size** sesuai kebutuhan:
    *   **Small (100px)** -> Menghasilkan layout **6 Kolom** (Hemat Kertas).
    *   **Medium (150px)** -> Menghasilkan layout **5 Kolom**.
    *   **Large (200px)** -> Menghasilkan layout **4 Kolom** (Paling Jelas).
3.  (Opsional) Centang **QR Only** jika ingin mencetak barcode-nya saja tanpa tulisan user/pass.
4.  Klik **Preview & Print**.
5.  Pilih opsi **Print With Logo** atau **No Logo** di menu pop-up.
6.  Jendela baru akan terbuka. Tekan `Ctrl + P` untuk print ke Printer atau simpan sebagai PDF.

#### Untuk Menyimpan Gambar (Satuan)
1.  Arahkan mouse ke salah satu kartu voucher.
2.  Klik ikon **Mata (👁️)** di pojok kanan atas kartu.
3.  Jendela preview akan muncul.
4.  Klik tombol **QR Only** atau **QR + Logo** untuk membuka gambar resolusi tinggi di tab baru, lalu **Save Image As**.

## 🛠️ Detail Teknis

-   **Framework**: Vanilla HTML5, JavaScript (Tanpa framework berat).
-   **Styling**: Tailwind CSS (via CDN).
-   **Library**:
    -   [`qrcode.min.js`](https://github.com/davidshimjs/qrcodejs): Library utama untuk generate QR code.
-   **Kompatibilitas**: Berjalan mulus di Chrome, Firefox, Edge, dan browser modern lainnya.

## ❤️ Kredit & Lisensi
Terima kasih kepada pengembang open source berikut:
-   **[qrcodejs](https://github.com/davidshimjs/qrcodejs)** oleh `davidshimjs` (MIT License) - *Mesin utama pembuat QR Code ini.*

## 📝 Catatan Penting
-   Pastikan halaman login MikroTik Anda sudah dikonfigurasi untuk menerima input login dari QR Code (biasanya format URL `http://hotspot.domain/login?username=...`).
-   Jika ingin mencetak di kertas Thermal (struk), atur **Display Size** ke Small atau gunakan CSS `@media print` khusus jika perlu kustomisasi lebih lanjut.
