const CACHE_NAME = 'swift-master-v2';

// Daftar aset statis aplikasi (pastikan file-file ini ada di proyek Anda)
const STATIC_ASSETS = [
  '/',
  '/admin-dashboard.html',
  '/SWIFT ADMIN.html',
  '/wallet.html',
  '/auth.html',
  '/profile.html',
  '/app.js',
  '/script.js',
  '/manifest.json'
];

// 1. Install Service Worker & Simpan Aset Statis ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Menyimpan aset statis ke cache...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Aktivasi & Bersihkan Cache Lama jika Ada Versi Baru
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Menghapus cache lama:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Strategi Fetch: Pisahkan Aset Statis dan Permintaan ke Supabase
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // PENTING: Jika request mengarah ke Supabase / API eksternal, 
  // JANGAN gunakan cache. Selalu ambil langsung dari jaringan (Network-First).
  if (url.origin.includes('supabase.co') || url.pathname.includes('/rest/v1/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback opsional jika internet terputus total saat akses API
        return new Response(JSON.stringify({ error: "Tidak ada koneksi internet." }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Untuk aset statis (HTML, CSS, JS, Gambar): Cache-First, lalu update dari network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Kembalikan data cache, tapi fetch versi terbaru di background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Abaikan jika offline */});

        return cachedResponse;
      }

      // Jika tidak ada di cache, ambil dari network
      return fetch(event.request);
    })
  );
});