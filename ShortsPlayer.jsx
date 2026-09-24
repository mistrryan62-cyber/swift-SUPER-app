import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient'; // Sesuaikan path file supabase Anda

export default function ShortsPlayer({ videoUrl, videoId, userId }) {
  const [hasClaimed, setHasClaimed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const videoRef = useRef(null);

  // Fungsi untuk memicu reward saat video selesai ditonton
  const handleVideoEnded = async () => {
    if (hasClaimed) return; // Cegah klaim ganda dalam satu sesi tonton

    try {
      // Memanggil fungsi RPC Supabase yang sudah kita buat sebelumnya
      const { data, error } = await supabase.rpc('claim_video_reward', {
        p_user_id: userId,
        p_video_id: videoId
      });

      if (error) throw error;

      if (data.status === 'success') {
        setToastMessage(`🎉 Selamat! Anda mendapat Rp ${data.reward}`);
        setHasClaimed(true);
        // Hilangkan notifikasi setelah 3 detik
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setToastMessage(data.message); // Contoh: Batas harian tercapai
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error("Gagal mengklaim reward:", err.message);
    }
  };

  return (
    <div className="relative w-full max-w-sm h-[550px] bg-black rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
      {/* Pemutar Video Pendek */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
        onEnded={handleVideoEnded}
      />

      {/* Toast Notifikasi Watch-to-Earn */}
      {toastMessage && (
        <div className="absolute top-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md text-sm font-bold animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
}