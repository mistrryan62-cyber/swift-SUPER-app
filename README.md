# 🚀 SWIFT Super-App Ecosystem

SWIFT Super-App adalah platform layanan terintegrasi modern berbasis web, PWA (Progressive Web App), dan Capacitor yang dirancang untuk mendukung berbagai layanan harian seperti transportasi, pengiriman, pembayaran digital, manajemen merchant, dan administrasi operasional.

## 📁 Struktur Direktori Proyek
- `/public` : Berisi seluruh aset antarmuka web interaktif (`index.html`, `driver.html`, `merchant-dashboard.html`, `wallet.html`, dll).
- `/capacitor.config.json` : Konfigurasi utama penghubung web ke platform native (Android/iOS).
- `/package.json` : Daftar pustaka dependensi dan skrip ekosistem.
- `/.github/workflows/build.yml` : Otomatisasi Cloud Build Pipeline (CI/CD) menggunakan GitHub Actions.

## 🛠️ Teknologi yang Digunakan
- **Frontend & UI:** HTML5, JavaScript (ES6+), React/JSX Components, Tailwind/CSS.
- **Backend & Database:** Supabase (Real-time Database, Auth, & Gateway).
- **Mobile Wrapper:** Ionic Capacitor.
- **CI/CD:** GitHub Actions.

## ⚙️ Panduan Instalasi & Pengembangan Lokal
1. Pastikan Node.js (versi 18.x atau 20.x) sudah terinstal di perangkat Anda (Chromebook/Termux/VS Code/Acode).
2. Jalankan perintah untuk menginstal dependensi:
   ```bash
   npm install
