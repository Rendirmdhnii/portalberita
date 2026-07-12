# 📰 PojokTV - Jaringan Berita Nasional Terpercaya

> **Tautan Website Resmi**: [https://pojoktv.com](https://pojoktv.com)

---

## 📝 Deskripsi Proyek

**PojokTV** adalah platform media siber mutakhir yang dibangun menggunakan framework **Next.js** dan **Supabase**. Proyek ini tidak hanya dirancang sekadar sebagai portal baca berita bagi publik, melainkan juga mencakup **CMS (Content Management System)** berorientasi modern yang dibangun dari nol khusus untuk memfasilitasi tim redaksi serta jurnalis guna mempublikasikan berita, mengelola konten video, mengatur direktori rubrik, dan menayangkan penempatan iklan secara terotomatisasi dengan efisiensi tinggi.

---

## 🚀 Fitur Utama

- **Redaksi CMS (Admin Panel)**: Sistem tata letak kelola data yang dirancang khusus menggunakan konsep *Mobile-First* dengan fitur *slide-up modal form* dan *compact cards* yang sangat responsif serta hemat ruang gulir layar.
- **Rich Text Editor**: Editor penulisan artikel canggih yang terintegrasi secara dinamis dengan **React-Quill** dan sistem pengunggahan gambar (*image handler*) langsung ke dalam **Supabase Storage** secara instan.
- **Automated E2E Testing**: Suite pengujian otomatis berbasis **Playwright** yang mencakup verifikasi hulu-ke-hilir mulai dari alur autentikasi dashboard admin, manipulasi CRUD, hingga responsivitas layout halaman publik.
- **SEO & Metadata Ready**: Optimasi penjelajahan mesin pencari Google yang dinamis dilengkapi dengan pemanggilan favicon `/logo.png`, Open Graph tags, serta metatags deskripsi deskriptif bawaan di tingkat global.
- **Dynamic Breaking News**: Bilah berita berjalan (*Running Marquee*) bertema kontras yang secara otomatis menarik 5 artikel Published terhangat secara *real-time* langsung dari database PostgreSQL.

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

- **Frontend Framework**: Next.js & React
- **Styling & Responsive CSS**: Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **E2E Testing Suite**: Playwright
- **Hosting & Deployment**: Vercel

---

## ⚙️ Panduan Menjalankan Proyek di Localhost

### 1. Kloning Proyek
Unduh repositori proyek ini ke lokal Anda:
```bash
git clone https://github.com/Rendirmdhnii/portalberita.git
cd portalberita
```

### 2. Instalasi Dependencies
Pasang seluruh paket modul pustaka yang dibutuhkan proyek:
```bash
npm install
```

### 3. Pengaturan Variabel Lingkungan (Environment Variables)
Buat sebuah berkas bernama **`.env.local`** pada folder root proyek Anda dan masukkan konfigurasi kunci koneksi Supabase Anda:
```env
# URL & Kunci Anonim Supabase Publik
NEXT_PUBLIC_SUPABASE_URL=https://nama-proyek-anda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Kredensial Uji Coba Otomatis (E2E Testing)
TEST_EMAIL=redaksi@pojoktv.com
TEST_PASSWORD=Sidoarjo@79
```

### 4. Menjalankan Server Pengembangan (Dev Server)
Nyalakan server pengembangan lokal:
```bash
npm run dev
```
Setelah berjalan, buka browser Anda dan kunjungi tautan:
- **Halaman Publik**: `http://localhost:3000`
- **Dashboard Redaksi**: `http://localhost:3000/admin/login`
