/**
 * ============================================================
 *  KONFIGURASI DISPLAY AL AMIN
 * ============================================================
 *  Ganti APPS_SCRIPT_URL dengan URL Web App hasil deploy
 *  dari Google Apps Script (lihat SETUP.md).
 *
 *  Biarkan kosong ("") jika ingin pakai data lokal / fallback.
 * ============================================================
 */
const CONFIG = {
  // URL Web App Google Apps Script (setelah di-deploy)
  // Contoh: "https://script.google.com/macros/s/AKfycb.../exec"
  APPS_SCRIPT_URL: "",

  // Interval refresh data dari Sheets (ms) — default 3 menit
  REFRESH_INTERVAL: 3 * 60 * 1000,

  // Fallback data lokal (dipakai jika Sheets belum di-set / offline)
  FALLBACK: {
    config: {
      mosque_name: "AL AMIN",
      tagline: "Islamic Digital Display",
      hero_eyebrow: "✦ WELCOME TO MASJID AL AMIN",
      hero_desc: "Display masjid modern yang adaptif terhadap waktu dan lokasi jamaah. Simpel, hangat, dan Gen Z friendly.",
      footer: "Al Amin • Sebuah ruang untuk pulang kepada-Nya.",
      latitude: -2.991,
      longitude: 104.756,
      method: 11,
      timezone: "Asia/Jakarta",
      use_fixed_location: false   // true = pakai lat/lon di atas, tidak minta izin browser
    },
    pengumuman: [
      { text: "Selamat datang di Masjid Al Amin. Mari jaga kebersihan dan kekhusyukan.", active: true }
    ],
    quote: {
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      text: "“Sesungguhnya bersama kesulitan ada kemudahan.”",
      source: "QS. Al-Insyirah: 6"
    },
    status: [
      { icon: "🕌", label: "Suasana", value: "Damai & nyaman" },
      { icon: "💧", label: "Air wudhu", value: "Tersedia" },
      { icon: "📶", label: "Wi-Fi", value: "AlAmin_Guest" },
      { icon: "🌙", label: "Kajian", value: "Cek jadwal" }
    ],
    kajian: [
      {
        judul: "Kajian Rutin Malam Jumat",
        ustadz: "Ustadz Ahmad",
        hari: "Jumat",
        jam: "19:30",
        keterangan: "Ba'da Maghrib",
        active: true
      }
    ]
  }
};
