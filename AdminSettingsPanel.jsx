import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Sesuaikan path file supabase Anda jika berbeda

export default function AdminSettingsPanel() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [inputValues, setInputValues] = useState({});

  // 1. Ambil data pengaturan dari tabel admin_settings Supabase
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);

      // Masukkan nilai awal ke dalam state lokal input
      const initialValues = {};
      data.forEach(item => {
        initialValues[item.setting_key] = item.setting_value;
      });
      setInputValues(initialValues);
    } catch (err) {
      console.error("Gagal memuat pengaturan admin:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 2. Handle perubahan ketikan pada input
  const handleInputChange = (key, value) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  // 3. Simpan perubahan ke database Supabase
  const handleSave = async (key) => {
    try {
      const newValue = inputValues[key];
      const { error } = await supabase
        .from('admin_settings')
        .update({ setting_value: newValue, updated_at: new Date() })
        .eq('setting_key', key);

      if (error) throw error;
      setStatusMessage(`Berhasil memperbarui ${key}!`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error("Gagal memperbarui pengaturan:", err.message);
      setStatusMessage(`Gagal: ${err.message}`);
    }
  };

  if (loading) return <div className="p-4 text-white">Memuat panel pengaturan...</div>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">⚙️ Panel Kontrol Pengaturan Admin</h2>
      {statusMessage && <div className="mb-4 p-2 bg-blue-600 rounded text-sm">{statusMessage}</div>}
      
      <div className="space-y-4">
        {settings.map((item) => (
          <div key={item.setting_key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <p className="font-semibold">{item.setting_key}</p>
              <p className="text-xs text-gray-400">{item.description || 'Tidak ada deskripsi'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValues[item.setting_key] || ''}
                onChange={(e) => handleInputChange(item.setting_key, e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
              />
              <button
                onClick={() => handleSave(item.setting_key)}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm font-bold"
              >
                Simpan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}