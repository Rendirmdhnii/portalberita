# Walkthrough - Pemindahan Rute Admin & Klik Video Langsung YouTube

Berikut adalah ringkasan dari langkah-langkah yang dilakukan untuk menyembunyikan jalur masuk admin (keamanan URL) dan mengubah fungsi klik video agar langsung membuka YouTube di tab baru:

---

## 1. Keamanan URL Admin (Sembunyikan Jalur Login)
* **Rename Folder**:
  - Mengubah nama folder `src/pages/admin` menjadi nama rahasia `src/pages/redaksi-portal` secara permanen.
* **Perbarui Link Login**:
  - Di `src/components/Footer.jsx`, link login diubah dari `/admin/login` menjadi `/redaksi-portal/login`.
* **Perbarui Tautan & Redirect Internal**:
  - Mengubah seluruh referensi link `/admin/` menjadi `/redaksi-portal/` di file-file kelola admin.

---

## 2. Sistem Klik Video Langsung ke YouTube
* **Anchor Wrapper**:
  - Pada halaman utama (`src/pages/index.jsx`), elemen video dibungkus dengan tag jangkar (`<a>`) yang mengarah langsung ke tautan YouTube dari database (`video.link` atau fallback `youtube.com/watch?v=youtube_id`).
  - Menambahkan atribut `target="_blank"` dan `rel="noopener noreferrer"`.

---

## 3. Teks Copyright Footer Terbaru
* Teks panjang hak cipta diubah menjadi: `@2026 PojokTV.com. Hak cipta dilindungi undang-undang`.
