const CONFIG = {
    // === Baca dari file data/ jika ada, fallback ke localStorage ===
    ambilDaftar: function(nama) {
        return localStorage.getItem(nama) || '';
    },

    // === Simpan data pengunjung ===
    catatPengunjung: function(data) {
        const daftar = JSON.parse(localStorage.getItem('dataPengunjung') || '[]');
        daftar.unshift(data);
        localStorage.setItem('dataPengunjung', JSON.stringify(daftar));
    },

    // === Kirim ke Telegram ===
    kirimTelegram: function(pesan) {
        const token = localStorage.getItem('botTelegram');
        const chatId = localStorage.getItem('chatTelegram');
        if (!token || !chatId) return;
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: pesan, parse_mode: 'Markdown' })
        });
    }
};
