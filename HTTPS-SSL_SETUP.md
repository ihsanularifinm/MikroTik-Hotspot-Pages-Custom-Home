# Panduan Setup SSL / HTTPS untuk Hotspot MikroTik

Fitur QR Code Scanner **MEWAJIBKAN** protokol HTTPS agar dapat berjalan.
Berikut adalah dua metode yang bisa Anda pilih untuk mengaktifkan HTTPS di MikroTik.

---

## Opsi 1: Metode Manual (Self-Signed)
Ini adalah cara paling dasar. Anda bisa membuat sertifikat sendiri langsung di dalam MikroTik.
Sertifikat ini valid untuk mengaktifkan HTTPS, namun biasanya browser akan menampilkan peringatan "Not Secure" (gembok merah/dicoret) karena sertifikatnya bukan dari otoritas terpercaya.

**Silakan ikuti panduan resmi dari MikroTik Indonesia:**
👉 **[Tutorial: Penggunaan HTTPS pada Halaman Login Hotspot](http://www.mikrotik.co.id/artikel_lihat.php?id=272)**

---

## Opsi 2: Metode SSL Gratis Trusted (Certbot WSL)

Jika Anda ingin terlihat lebih profesional dengan **Gembok Hijau** (Trusted), Anda bisa menggunakan sertifikat gratis dari Let's Encrypt.
Gunakan metode ini jika Anda memiliki **Domain Sendiri** (misal: `wlan.my.id`).

### Prasyarat
*   Anda harus punya domain sendiri.
*   Akses ke panel DNS domain tersebut.
*   Laptop dengan fitur WSL (Windows Subsystem for Linux).

### Langkah 1: Install Certbot
Buka terminal WSL kamu, lalu jalankan perintah ini (masukkan password root WSL jika diminta):

```bash
sudo apt update
sudo apt install certbot -y
```

### Langkah 2: Generate Sertifikat (Tentukan Pilihan)

Silakan pilih salah satu cara di bawah ini (A atau B) sesuai kebutuhan Anda.

#### Cara A: Metode Wildcard (Direkomendasikan) 🌟
Satu sertifikat berfungsi untuk semua subdomain (`wifi.wlan.my.id`, `login.wlan.my.id`, dll).
Ganti `wlan.my.id` dengan domain Anda.

1.  Ketik perintah di terminal WSL:
    ```bash
    sudo certbot certonly --manual --preferred-challenges dns -d wlan.my.id -d "*.wlan.my.id"
    ```
2.  Karena kita meminta 2 domain (root & wildcard), Anda akan diminta memasukkan **2 DNS TXT Record**.
3.  Deploy TXT record pertama `_acme-challenge.wlan.my.id.` sesuai token yang muncul.
4.  Lanjut ke token kedua, buat TXT record baru dengan nama yang sama `_acme-challenge.wlan.my.id.` tapi isi token berbeda.
5.  **Hasil:** Di DNS panel Anda harus ada 2 baris TXT record dengan nama sama.

---

#### Cara B: Metode Single Subdomain
Hanya berlaku untuk satu subdomain spesifik (misal: `hotspot.wlan.my.id`). Lebih simpel, validasi cuma 1 kali.
Ganti `hotspot.wlan.my.id` dengan subdomain Anda.

1.  Ketik perintah di terminal WSL:
    ```bash
    sudo certbot certonly --manual --preferred-challenges dns -d hotspot.wlan.my.id
    ```
2.  Anda hanya perlu memasukkan **1 DNS TXT Record**.
3.  Deploy TXT record `_acme-challenge.hotspot.wlan.my.id.` sesuai token yang muncul.
4.  **Hasil:** Di DNS panel cukup 1 baris TXT record.

---

### Langkah 3: Verifikasi Propagasi DNS (PENTING!)
⛔ **JANGAN TEKAN ENTER DULU DI TERMINAL!** ⛔

Sebelum lanjut, pastikan record tersebut sudah terbaca oleh internet.
1.  Buka [Google Admin Toolbox Dig](https://toolbox.googleapps.com/apps/dig/).
2.  Masukkan nama challenge record Anda (misal: `_acme-challenge.wlan.my.id`).
3.  Klik tombol **TXT**.
4.  **Pastikan kode token dari terminal sudah muncul di situ.**

### Langkah 4: Finalisasi
1.  Kembali ke terminal WSL.
2.  Tekan **Enter**.
3.  Jika sukses, muncul tulisan:
    > `Congratulations! Your certificate... saved at: /etc/letsencrypt/live/...`

### Langkah 5: Import ke MikroTik
1.  Ambil file dari WSL ke Windows (sesuaikan path foldernya):
    ```bash
    # Contoh untuk domain wlan.my.id
    mkdir -p /mnt/c/Users/Public/ssl-certbot/ssl-wlan.my.id/
    sudo cp /etc/letsencrypt/live/wlan.my.id/fullchain.pem /mnt/c/Users/Public/ssl-certbot/ssl-wlan.my.id/
    sudo cp /etc/letsencrypt/live/wlan.my.id/privkey.pem /mnt/c/Users/Public/ssl-certbot/ssl-wlan.my.id/
    ```
2.  Buka **Winbox** > **Files**. Drag & Drop kedua file (`fullchain.pem` & `privkey.pem`) dari folder `C:\Users\Public\ssl-certbot\ssl-wlan.my.id`.
3.  Masuk **System > Certificates** > Import kedua file tersebut.

### Langkah 6: Konfigurasi Hotspot
1.  **IP > Services:** Aktifkan `www-ssl` (port 443), pilih sertifikat tadi.
2.  **IP > Hotspot > Server Profiles:**
    *   Tab **Login**: Centang **HTTPS**, pilih sertifikat.
    *   Tab **General**: Isi **DNS Name** dengan domain/subdomain yang Anda daftarkan tadi.
3.  **IP > DNS > Static:** Arahkan domain ke IP Hotspot Gateway.

---
**Selesai!** Sekarang hotspot Anda sudah support HTTPS (Trusted).
