// ==========================================
// SWIFT APP MASTER ENGINE & INTEGRASI FINTEK
// ==========================================

// Helper Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'swift-toast';
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: #1e293b; color: #fff; padding: 12px 24px; border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999; font-size: 14px;
    border: 1px solid #334155; transition: opacity 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 1. Fungsi Pendaftaran Mitra SWIFT ke Supabase
async function registerMitraToSupabase() {
  const btnSubmit = document.getElementById('btnSubmitMitra');
  const kategoriElem = document.getElementById('kategoriMitra');
  const namaElem = document.getElementById('namaLengkap');
  const hpElem = document.getElementById('nomorHp');

  if (!namaElem || !hpElem) {
    showToast('⚠️ Form pendaftaran tidak ditemukan.');
    return;
  }

  const kategori = kategoriElem ? kategoriElem.value : 'DRIVER_MOTOR';
  const nama = namaElem.value.trim();
  const hp = hpElem.value.trim();

  if (!nama || !hp) {
    showToast('⚠️ Harap isi nama dan nomor HP!');
    return;
  }

  if (typeof supabase === 'undefined') {
    showToast('❌ Koneksi Database Supabase belum siap!');
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.innerText = 'Mengirim Data...';

  try {
    const { data, error } = await supabase
      .from('mitra_registrations')
      .insert([
        { 
          full_name: nama, 
          phone_number: hp, 
          category: kategori,
          status: 'pending'
        }
      ]);

    if (error) throw error;

    showToast('✅ Pendaftaran Berhasil Dikirim!');
    const form = document.getElementById('formMitraSwift');
    if (form) form.reset();
  } catch (err) {
    console.error('Error Mitra:', err.message);
    showToast('❌ Gagal mengirim: ' + err.message);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerText = 'Kirim Pendaftaran Mitra';
  }
}

// 2. Integrasi Payment Gateway (Midtrans / Snap)
function loadPaymentGatewaySDK(snapToken, onSuccess, onPending, onError) {
  if (window.snap) {
    window.snap.pay(snapToken, {
      onSuccess: function(result) {
        console.log("Pembayaran Berhasil:", result);
        showToast("✅ Pembayaran Berhasil!");
        if (onSuccess) onSuccess(result);
      },
      onPending: function(result) {
        console.log("Menunggu Pembayaran:", result);
        showToast("⏳ Menunggu Pembayaran...");
        if (onPending) onPending(result);
      },
      onError: function(result) {
        console.error("Pembayaran Gagal:", result);
        showToast("❌ Pembayaran Gagal!");
        if (onError) onError(result);
      },
      onClose: function() {
        showToast("Transaksi dibatalkan");
      }
    });
  } else {
    showToast("⚠️ Gateway Pembayaran belum siap.");
  }
}

// 3. Pengajuan Withdrawal / Payout Saldo Dompet Mitra
async function requestPayout(userId, amount, bankName, accountNumber) {
  if (typeof supabase === 'undefined') {
    showToast('❌ Koneksi Database Supabase belum siap!');
    return;
  }

  try {
    const { data: wallet, error: walletErr } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (walletErr || !wallet) throw new Error("Gagal memeriksa saldo wallet.");
    if (wallet.balance < amount) {
      showToast("⚠️ Saldo tidak mencukupi untuk penarikan.");
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: 'payout',
        amount: amount,
        status: 'pending',
        payment_method: `${bankName}_${accountNumber}`
      }]);

    if (error) throw error;
    showToast("✅ Permintaan Penarikan Saldo Berhasil Diajukan!");
  } catch (err) {
    console.error("Error Payout:", err.message);
    showToast("❌ Gagal memproses penarikan saldo.");
  }
}

console.log("SWIFT Engine Script Loaded Successfully.");