/**
 * =====================================================================
 * SWIFT SUPER-APP - SUPABASE CLIENT INITIALIZATION (v8.0)
 * =====================================================================
 * Menghubungkan modul frontend dan native Capacitor ke database Supabase.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Konfigurasi Kredensial Supabase SWIFT Ecosystem
const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Sesuaikan URL Supabase Anda
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Sesuaikan Anon Key Supabase Anda

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper Global untuk Status Koneksi
export async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('app_config').select('*').limit(1);
        if (error) throw error;
        console.log('SWIFT Ecosystem: Terhubung ke Supabase dengan sukses.');
        return true;
    } catch (err) {
        console.warn('SWIFT Ecosystem: Menggunakan Mode Offline / Fallback LocalStorage.', err.message);
        return false;
    }
}
