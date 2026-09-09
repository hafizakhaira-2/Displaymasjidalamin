# Al Amin — Islamic Digital Display

Display masjid modern, minimalis, aesthetic, dan responsif dengan nuansa biru • hitam • ungu.

## Cara menjalankan
1. Extract ZIP.
2. Buka `index.html` di browser modern.
3. Izinkan akses lokasi agar jadwal shalat mengikuti posisi pengguna.
4. Untuk mode layar masjid/TV, klik **Fullscreen**.

## Catatan lokasi & jadwal
- Lokasi menggunakan Geolocation API browser setelah pengguna memberi izin.
- Reverse geocoding menggunakan OpenStreetMap Nominatim.
- Jadwal shalat mengambil data AlAdhan API.
- Untuk deployment masjid, sebaiknya tentukan koordinat tetap masjid dan metode perhitungan sesuai otoritas lokal.

## Struktur
- `index.html` — halaman utama
- `style.css` — UI/UX dan responsive styling
- `app.js` — jam, lokasi, jadwal shalat, countdown
- `config.json` — konfigurasi dasar


## Favicon
Favicon SVG dibuat khusus mengikuti identitas visual Al Amin: latar navy gelap, gradasi biru-ungu, bulan sabit, dan siluet masjid.
