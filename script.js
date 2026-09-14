// ==========================================
// SWIFT APP MASTER ENGINE & INTEGRASI FINTEK
// ==========================================

// 1. Fungsi Pendaftaran Mitra SWIFT ke Supabase
async function registerMitraToSupabase() {
  const btnSubmit = document.getElementById('btnSubmitMitra');
  const kategori = document.getElementById('kategoriMitra').value;
  const nama = document.getElementById('namaLengkap').value;
  const hp = document.getElementById('nomorHp').value;

  if (!nama || !hp) {
    showToast('⚠️ Harap isi nama dan nomor HP!');
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.innerText = 'Mengirim Data...';

  try {
    // Memasukkan data pendaftaran ke tabel mitra di Supabase
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
    document.getElementById('formMitraSwift').reset();
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
  try {
    // Cek ketersediaan saldo
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

    // Catat transaksi penarikan saldo
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