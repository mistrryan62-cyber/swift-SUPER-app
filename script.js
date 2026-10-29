// ==========================================
// SWIFT Super-App Ecosystem - Central Script
// ==========================================

// Konfigurasi Supabase Resmi
const SUPABASE_URL = "https://ydulzwenmideyjrntwie.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdWx6d2VubWlkZXlqcm50d2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMDg3NjksImV4cCI6MjEwMzY4NDc2OX0.l_C6SfeqPFjmrNQxJZai_ZS9ZbTLNzEnFJT3l8h8K0w";

let supabaseClient = null;

/**
 * Inisialisasi dan Ambil Instance Supabase Klien
 */
function getSupabase() {
    if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

/**
 * Format Angka ke Mata Uang Rupiah (IDR)
 */
function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount || 0);
}

/**
 * Cek Status Sesi Pengguna secara Global
 */
async function checkAuthSession() {
    const client = getSupabase();
    if (!client) return null;
    const { data: { session }, error } = await client.auth.getSession();
    if (error) {
        console.error("Gagal mendapatkan sesi:", error.message);
        return null;
    }
    return session;
}

/**
 * Fungsi Logout Global yang Aman
 */
async function handleLogout() {
    const client = getSupabase();
    if (client) {
        const { error } = await client.auth.signOut();
        if (error) {
            alert("Gagal keluar: " + error.message);
            return;
        }
        window.location.href = 'index.html';
    }
}

/**
 * Memproses Pembayaran Otomatis (Money-in) via Xendit Edge Function
 */
async function bayarPesanan(totalHarga, emailPelanggan, idPesanan) {
    const client = getSupabase();
    if (!client) {
        alert("Klien Supabase belum siap.");
        return;
    }

    try {
        // Memanggil Supabase Edge Function 'create-invoice'
        const { data, error } = await client.functions.invoke('create-invoice', {
            body: {
                external_id: `SWIFT-ORDER-${idPesanan}-${Date.now()}`,
                amount: totalHarga,
                payer_email: emailPelanggan,
                description: `Pembayaran Pesanan SWiFT.App #${idPesanan}`
            }
        });

        if (error) throw error;

        // Jika berhasil, arahkan pengguna ke halaman pembayaran resmi Xendit
        if (data && data.invoice_url) {
            console.log("Link Pembayaran Xendit:", data.invoice_url);
            window.location.href = data.invoice_url;
        } else {
            alert("Gagal menghasilkan tagihan pembayaran dari Xendit.");
        }
    } catch (err) {
        console.error("Kesalahan proses pembayaran:", err);
        alert("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
    }
}

/**
 * Inisialisasi Proses Checkout dan Pembayaran Terintegrasi
 * Menghubungkan sesi pengguna aktif secara otomatis dengan Xendit
 */
async function handleCheckoutProcess(totalBelanja, idUnikPesanan) {
    const session = await checkAuthSession();
    
    // Validasi apakah pengguna sudah login
    if (!session || !session.user) {
        alert("Silakan masuk (login) terlebih dahulu untuk melanjutkan pembayaran.");
        window.location.href = 'index.html'; // Arahkan ke halaman login jika belum masuk
        return;
    }

    const emailPengguna = session.user.email;
    const idPesanan = idUnikPesanan || `SWIFT-${Math.floor(Math.random() * 1000000)}`;

    console.log(`Memproses pembayaran untuk: ${emailPengguna} dengan nominal: ${formatIDR(totalBelanja)}`);

    // Panggil fungsi utama bayarPesanan
    await bayarPesanan(totalBelanja, emailPengguna, idPesanan);
}

// Sinkronisasi Tombol Bayar di Frontend (HTML/JS) secara Real-Time dari Keranjang
document.addEventListener('DOMContentLoaded', () => {
    const tombolBayar = document.getElementById('btn-bayar-swift');
    
    if (tombolBayar) {
        tombolBayar.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Ambil total tagihan secara real-time dari elemen HTML keranjang belanja
            const totalElement = document.getElementById('cart-total-amount');
            let totalTagihan = 0;
            
            if (totalElement) {
                // Membersihkan teks mata uang agar menjadi angka murni
                const bersihTeks = totalElement.innerText.replace(/[^0-9.-]+/g, "");
                totalTagihan = parseFloat(bersihTeks) || 0;
            }
            
            if (totalTagihan <= 0) {
                alert("Keranjang belanja Anda masih kosong atau total belum dihitung.");
                return;
            }
            
            const kodeTransaksi = "TRX-SWIFT-" + Date.now();
            
            // Jalankan proses terintegrasi secara real-time
            await handleCheckoutProcess(totalTagihan, kodeTransaksi);
        });
    }
});
