async function fetchAdminSettings() {
    let client = getSupabase();
    // Jika klien belum siap, tunggu hingga 1.5 detik agar inisialisasi sempat selesai
    if (!client) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        client = getSupabase();
    }
    
    if (!client) {
        console.error("Gagal memuat: Supabase client tidak tersedia.");
        return [];
    }

    try {
        const { data, error } = await client
            .from('admin_settings')
            .select('*')
            .order('setting_key', { ascending: true });

        if (error) throw error;
        console.log("⚙️ Pengaturan Admin berhasil dimuat:", data);
        return data || [];
    } catch (err) {
        console.error("Gagal memuat pengaturan admin:", err.message);
        return [];
    }
}