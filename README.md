# Al Amin — Islamic Digital Display (Google Sheets Edition)

Display masjid modern, minimalis, aesthetic, responsif dengan nuansa biru • hitam • ungu.  
Sekarang **terintegrasi Google Sheets + Apps Script** sebagai database gratis.

## Fitur

- Jam real-time + tanggal Indonesia
- Jadwal shalat dinamis (AlAdhan API)
- Countdown shalat berikutnya + highlight aktif
- **Pengumuman running text** (dari Sheets)
- **Ayat / Hadits harian** (dari Sheets)
- **Status fasilitas masjid** (dari Sheets)
- **Jadwal kajian & kegiatan** (dari Sheets)
- Fullscreen mode (cocok untuk TV)
- Theme toggle
- Auto-refresh data setiap 3 menit
- Fallback lokal jika Sheets offline

## Cara Cepat

1. Ikuti panduan lengkap di **[SETUP.md](SETUP.md)**
2. Deploy Apps Script → dapatkan URL
3. Paste URL ke `config.js`
4. Upload ke GitHub Pages

## Struktur File

```
├── index.html
├── style.css
├── app.js
├── config.js          ← edit APPS_SCRIPT_URL di sini
├── favicon.svg
├── SETUP.md           ← panduan lengkap
├── README.md
└── apps-script/
    └── Code.gs        ← paste ke Google Apps Script
```

## Lisensi

Bebas dipakai untuk keperluan masjid & komunitas.
