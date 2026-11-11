# Frontend Medisin

Aplikasi frontend untuk **Sistem Informasi Rekam Medik & Kunjungan Pasien "Medisin"**, dibangun dengan Vue 3 + Vite + Tailwind CSS v4, dan terhubung penuh ke REST API backend Laravel (`D:/backend-medisin`).

## Fitur

- **Login** — autentikasi Bearer Token (Laravel Sanctum) dengan captcha bergambar. Payload `username`, `password`, dan `captcha_code` dienkripsi terlebih dahulu via `POST /security/encrypt` (AES-256-CBC) sebelum dikirim ke `POST /login`.
- **Dashboard Pasien** — daftar pasien dengan No Rekam Medik, Nama, NIK, Alamat, dan Jumlah Kunjungan (hasil berapa kali dibuat kunjungan) dari `GET /pasien`.
- **Tambah Pasien** — No Rekam Medik dibuat otomatis oleh backend (format `RM0001`, `RM0002`, ... urut). User hanya mengisi Nama, NIK, dan Alamat. Dilengkapi validasi client-side (NIK 10–20 digit angka, nama min. 2 karakter, alamat min. 3 karakter) plus pesan error validasi dari backend.
- **Buat Kunjungan** — cukup input No Rekam Medik; data pasien muncul otomatis (auto-search dengan debounce) melalui `GET /pasien/search/{no_rekam_medik}`, lalu kunjungan dibuat via `POST /kunjungan` dan tabel langsung di-refresh.
- **Session** — token disimpan di localStorage; saat halaman dibuka ulang, sesi divalidasi lewat `GET /me`. Logout memanggil `POST /logout`.

## Struktur Proyek

```
src/
├── assets/
│   ├── logo.png          # Logo Medisin
│   └── main.css          # Tailwind CSS + warna tema custom
├── components/
│   ├── LoginView.vue             # Halaman login (captcha bergambar)
│   ├── DashboardView.vue         # Dashboard + tabel pasien
│   ├── TambahPasienModal.vue     # Modal tambah pasien
│   └── BuatKunjunganModal.vue    # Modal buat kunjungan (auto-search)
├── services/
│   └── api.js            # Wrapper REST API (fetch + Bearer token)
├── App.vue               # State global (auth, data pasien, error)
└── main.js
```

## REST API (Backend Laravel)

Base URL default: `http://localhost:8000/api`

| Endpoint | Method | Keterangan |
|---|---|---|
| `/captcha` | GET | Ambil captcha (gambar PNG + token one-time) |
| `/security/encrypt` | POST | Enkripsi payload (AES-256-CBC) |
| `/login` | POST | Login (payload terenkripsi + `tokenCaptcha`) |
| `/me` | GET | Profil user aktif (Bearer) |
| `/logout` | POST | Logout & revoke token (Bearer) |
| `/pasien` | GET/POST | Daftar & tambah pasien (Bearer) |
| `/pasien/search/{no_rekam_medik}` | GET | Cari pasien by No Rekam Medik (Bearer) |
| `/kunjungan` | POST | Buat kunjungan (Bearer) |

Semua respons backend berformat `{ success, message, data }`. Error validasi (422) berisi `errors` dan ditampilkan langsung di modal.

## Menjalankan Proyek

**1. Backend** (folder `D:/backend-medisin`):

```sh
php artisan serve --port=8000
```

**2. Frontend** (folder ini):

```sh
npm install
npm run dev
```

Buka `http://localhost:5173`, login dengan akun seeder backend:

- Username: `admin`
- Password: `password`
- Captcha: ketik kode yang tampil pada gambar

## Konfigurasi

Base URL API dapat diubah lewat environment variable Vite — buat file `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Build Produksi

```sh
npm run build
npm run preview
```
