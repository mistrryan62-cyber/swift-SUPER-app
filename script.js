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