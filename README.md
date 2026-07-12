# PojokTV.com — Portal Berita JAMstack (Next.js + Supabase)

Portal berita modern yang dibangun dengan Next.js (Pages Router) dan Supabase sebagai backend cloud.

## Tech Stack

- **Frontend:** Next.js 15 (React), Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage (untuk gambar berita dan iklan)
- **Editor:** React-Quill (WYSIWYG)
- **Deploy:** Vercel

---

## Setup Cepat

### 1. Clone & Install

```bash
npm install
```

### 2. Konfigurasi Supabase

Edit file `.env.local` dan isi dengan nilai dari Supabase Dashboard Anda:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Dapatkan nilai-nilai ini di: **Supabase Dashboard → Project → Settings → API**

### 3. Setup Database Supabase

Buat tabel-tabel berikut di Supabase SQL Editor:

```sql
-- TABEL POSTS (Berita)
create table posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text,
  content text,
  image text,
  author text,
  status text default 'Published',
  views integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- TABEL CATEGORIES (Rubrik)
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  status text default 'Aktif',
  created_at timestamp with time zone default now()
);

-- TABEL VIDEOS
create table videos (
  id uuid default gen_random_uuid() primary key,
  judul text not null,
  youtube_id text not null,
  deskripsi text,
  created_at timestamp with time zone default now()
);

-- TABEL ADS (Iklan)
create table ads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  position text not null,
  image text,
  link text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);
```

### 4. Row Level Security (RLS) Supabase

Di Supabase Dashboard → Authentication → Policies, aktifkan RLS dan tambahkan policy:

**Untuk table `posts`, `categories`, `videos`, `ads` (SELECT publik):**
```sql
-- Policy: Allow public read
create policy "Allow public read" on posts
  for select using (true);
```

**Untuk INSERT/UPDATE/DELETE, hanya user terautentikasi:**
```sql
create policy "Allow authenticated write" on posts
  for all using (auth.role() = 'authenticated');
```

### 5. Setup Supabase Storage

Di Supabase Dashboard → Storage, buat bucket bernama `media` dengan akses **Public**.

### 6. Tambahkan User Admin

Di Supabase Dashboard → Authentication → Users → Add User, tambahkan email dan password admin.

### 7. Jalankan Development Server

```bash
npm run dev
```

Buka: http://localhost:3000

---

## Struktur Folder

```
pojoktv.com/
├── src/
│   ├── components/         # Navbar, Footer
│   ├── layouts/            # PublicLayout, AdminLayout
│   ├── lib/                # supabaseClient.js
│   ├── pages/
│   │   ├── index.jsx       # Halaman Utama
│   │   ├── login.jsx       # Halaman Login
│   │   ├── berita/
│   │   │   └── [slug].jsx  # Detail Artikel
│   │   ├── kategori/
│   │   │   └── [slug].jsx  # Halaman Kategori
│   │   └── admin/
│   │       ├── dashboard.jsx
│   │       ├── posts/
│   │       │   ├── index.jsx   # Daftar Berita
│   │       │   ├── create.jsx  # Tulis Berita Baru
│   │       │   └── edit/[id].jsx
│   │       ├── categories.jsx
│   │       ├── ads.jsx
│   │       └── videos.jsx
│   └── styles/
│       └── globals.css     # Design system utama
├── public/                 # Aset statis
├── .env.local              # Variabel environment (jangan di-commit!)
├── next.config.js
├── tailwind.config.js
└── vercel.json             # Konfigurasi Vercel
```

---

## Deploy ke Vercel

1. Push ke GitHub repository
2. Hubungkan di **vercel.com** → Import Project
3. Isi Environment Variables di Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

---

## Akses Admin

- URL: `/login`
- Login dengan email dan password yang dibuat di Supabase Authentication

---

*PojokTV.com — Tajam, Terpercaya, Terkini.*
